import { useEffect, useMemo, useState } from "react";
import style from "./seccion_3.module.css";
import { supabase } from "../../../../app/services/apiSupabase";
import {
  buildStorageImageUrls,
  getField,
  listStorageFolderFiles,
  resolveFolderImage,
  resolveBrandImage,
  resolveStorageFileName,
} from "../../../../shared/utils/catalogImage";

type MarcaItem = {
  id: number;
  nombre: string;
  imagen: string;
  alternativas: string[];
};

function getStorageUrl(bucketName: string | null, fileName: string | null) {
  if (!bucketName || !fileName) return "";

  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data?.publicUrl ?? "";
}

function buildDisplayName(rawName: string | null, fileName: string | null, fallback: string) {
  const source = rawName || fileName;
  if (!source) return fallback;

  const baseName = source.replace(/\.[^.]+$/, "");
  const normalized = baseName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return fallback;

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function BrandImage({ marca }: { marca: MarcaItem }) {
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [marca.id, marca.imagen]);

  const src = marca.alternativas[srcIndex] ?? marca.imagen;

  return (
    <img
      src={src}
      alt={marca.nombre}
      className={style.imagen}
      onError={() => {
        setSrcIndex((current) => {
          if (current >= marca.alternativas.length - 1) {
            return current;
          }

          return current + 1;
        });
      }}
    />
  );
}

async function fetchAllRows(tableName: string) {
  const pageSize = 1000;
  const allRows: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Record<string, unknown>[];
    allRows.push(...rows);

    if (rows.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return allRows;
}

const Seccion_3 = () => {
  const [marcas, setMarcas] = useState<MarcaItem[]>([]);

  useEffect(() => {
    const cargarMarcas = async () => {
      let data: Record<string, unknown>[];
      let archivosMarca: string[];
      try {
        const [marcasData, storageFiles] = await Promise.all([
          fetchAllRows("marca"),
          listStorageFolderFiles("marca"),
        ]);
        data = marcasData;
        archivosMarca = storageFiles;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        console.error("No se pudieron cargar las marcas del inicio:", message);
        setMarcas([]);
        return;
      }

      const marcasMapeadas = data
        .map((row) => {
          const id = getField<number>(row, "marcaId", "marcaid", "id");
          if (id === null || id === undefined) return null;

          const nombre = getField<string>(row, "marcaNombre", "marcanombre", "nombre");
          const imagenNombre = getField<string>(row, "marcaImgNombre", "marcaimgnombre");
          const imagenArchivo = getField<string>(
            row,
            "marcaImgNombreBucket",
            "marcaimgnombrebucket"
          );
          const imagenBase = getField<string>(row, "marcaImgNombre", "marcaimgnombre", "nombre");
          const archivoResuelto =
            resolveStorageFileName(imagenArchivo, imagenBase, archivosMarca) ?? imagenArchivo;
          const imagen =
            archivoResuelto
              ? resolveFolderImage("marca", archivoResuelto, getStorageUrl)
              : resolveBrandImage(row, getStorageUrl);
          const alternativas = buildStorageImageUrls("marca", archivoResuelto, getStorageUrl);

          return {
            id: Number(id),
            nombre: buildDisplayName(nombre, imagenNombre, `Marca ${id}`),
            imagen,
            alternativas,
          };
        })
        .filter((item): item is MarcaItem => Boolean(item));

      setMarcas(
        marcasMapeadas.filter(
          (marca, index, array) => array.findIndex((item) => item.nombre === marca.nombre) === index
        )
      );
    };

    cargarMarcas();
  }, []);

  const marcasDuplicadas = useMemo(() => {
    if (marcas.length === 0) return [];
    return [...marcas, ...marcas];
  }, [marcas]);

  return (
    <section className={style.seccion}>
      <div className={style.encabezado}>
        <span className={style.kicker}>Aliados comerciales</span>
        <h2 className={style.titulo}>Marcas</h2>
        <p className={style.descripcion}>
          Trabajamos con marcas reconocidas para ofrecer productos confiables en cada categoria.
        </p>
      </div>

      <div className={style.carruselMarco}>
        <button className={`${style.flecha} ${style.flechaIzquierda}`} type="button">
          &#8249;
        </button>

        <div className={style.viewport}>
          {marcasDuplicadas.length > 0 ? (
            <div className={style.pista}>
              {marcasDuplicadas.map((marca, index) => (
                <article key={`${marca.id}-${index}`} className={style.card}>
                  {marca.imagen ? (
                    <BrandImage marca={marca} />
                  ) : (
                    <div className={style.placeholder}>{marca.nombre}</div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className={style.vacio}>No hay marcas disponibles.</div>
          )}
        </div>

        <button className={`${style.flecha} ${style.flechaDerecha}`} type="button">
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default Seccion_3;
