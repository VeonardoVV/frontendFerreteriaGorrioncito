import { useEffect, useMemo, useState } from "react";
import style from "./seccion_4.module.css";
import { supabase } from "../../../../app/services/apiSupabase";
import { getField, resolveCatalogImage } from "../../../../shared/utils/catalogImage";

type ProductoHome = {
  id: number;
  titulo: string;
  categoria: string;
  precio: string;
  imagen: string;
};

function getStorageUrl(bucketName: string | null, fileName: string | null) {
  if (!bucketName || !fileName) return "";

  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data?.publicUrl ?? "";
}

function buildDisplayName(rawName: string | null, fileName: string | null, fallback: string) {
  const source = rawName || fileName;
  if (!source) return fallback;

  const baseName = /\.[A-Za-z]{2,5}$/.test(source) ? source.replace(/\.[^.]+$/, "") : source;
  const normalized = baseName.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!normalized) return fallback;

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPrice(value: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "Consultar precio";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) return `S/ ${value}`;

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(numeric);
}

const Seccion_4 = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [inicio, setInicio] = useState(0);
  const [productos, setProductos] = useState<ProductoHome[]>([]);
  const visiblesPorVista = 3;

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const [productosResult, categoriasResult] = await Promise.all([
          supabase.from("producto").select("*").limit(12),
          supabase.from("categoria").select("*"),
        ]);

        if (productosResult.error) {
          throw productosResult.error;
        }

        if (categoriasResult.error) {
          throw categoriasResult.error;
        }

        const categoriasMap = new Map<number, string>();
        for (const row of (categoriasResult.data ?? []) as Record<string, unknown>[]) {
          const id = getField<number>(row, "ctgraId", "ctgraid", "id");
          if (id === null || id === undefined) continue;

          const nombre = getField<string>(
            row,
            "ctgraNombre",
            "ctgranombre",
            "categoriaNombre",
            "categorianombre",
            "nombre"
          );
          const imagenNombre = getField<string>(row, "ctgraImgNombre", "ctgraimgnombre");
          categoriasMap.set(Number(id), buildDisplayName(nombre, imagenNombre, `Categoria ${id}`));
        }

        const productosMapeados = ((productosResult.data ?? []) as Record<string, unknown>[])
          .map((row, index) => {
            const id = getField<number>(row, "prdcId", "prdcid", "productoId", "id") ?? index + 1;
            const categoriaId = getField<number>(row, "ctgraId", "ctgraid");
            const nombre = getField<string>(
              row,
              "prdcNombre",
              "prdcnombre",
              "productoNombre",
              "productonombre",
              "nombre"
            );
            const imagenNombre = getField<string>(row, "prdcImgNombre", "prdcimgnombre");
            const precio = getField<string | number>(row, "prdcPrecio", "prdcprecio", "precio");

            return {
              id: Number(id),
              titulo: buildDisplayName(nombre, imagenNombre, `Producto ${id}`),
              categoria:
                categoriasMap.get(Number(categoriaId)) ||
                `Categoria ${categoriaId ?? id}`,
              precio: formatPrice(precio),
              imagen: resolveCatalogImage(row, getStorageUrl),
            };
          })
          .filter((item) => item.titulo);

        setProductos(productosMapeados);
      } catch (error) {
        console.error("No se pudieron cargar los productos del home:", error);
        setProductos([]);
      }
    };

    cargarProductos();
  }, []);

  const productosVisibles = useMemo(() => {
    if (productos.length === 0) return [];

    const total = Math.min(visiblesPorVista, productos.length);
    return Array.from({ length: total }, (_, index) => productos[(inicio + index) % productos.length]);
  }, [inicio, productos]);

  const siguiente = () => {
    if (productos.length <= 1) return;
    setInicio((prev) => (prev + 1) % productos.length);
  };

  const anterior = () => {
    if (productos.length <= 1) return;
    setInicio((prev) => (prev - 1 + productos.length) % productos.length);
  };

  return (
    <section className={style.seccion}>
      <h2 className={style.tituloPrincipal}>Productos</h2>

      <div className={style.sliderWrap}>
        <button
          className={`${style.flecha} ${style.flechaIzquierda}`}
          type="button"
          onClick={anterior}
          aria-label="Productos anteriores"
          disabled={productos.length <= 1}
        >
          &#8249;
        </button>

        <div className={style.tarjetas}>
          {productosVisibles.length > 0 ? (
            productosVisibles.map((producto) => (
              <article key={producto.id} className={style.card}>
                <div className={style.imagenWrap}>
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.titulo}
                      className={style.imagen}
                    />
                  ) : (
                    <div className={style.placeholder}>Sin imagen</div>
                  )}
                </div>

                <div className={style.cardBody}>
                  <h3 className={style.cardTitulo}>{producto.titulo}</h3>
                  <p className={style.cardCategoria}>{producto.categoria}</p>
                  <p className={style.cardPrecio}>{producto.precio}</p>

                  <button
                    className={style.botonCompra}
                    type="button"
                    onClick={() => setModalAbierto(true)}
                  >
                    <span className={style.icono}></span>
                    <span>Lo quiero</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className={style.vacio}>No hay productos disponibles.</div>
          )}
        </div>

        <button
          className={`${style.flecha} ${style.flechaDerecha}`}
          type="button"
          onClick={siguiente}
          aria-label="Siguientes productos"
          disabled={productos.length <= 1}
        >
          &#8250;
        </button>
      </div>

      {modalAbierto && (
        <div className={style.modalOverlay} onClick={() => setModalAbierto(false)}>
          <div className={style.modal} onClick={(event) => event.stopPropagation()}>
            <h3 className={style.modalTitulo}>Como deseas continuar?</h3>
            <p className={style.modalTexto}>
              Elige una opcion para poder completar tu compra
            </p>

            <button className={style.accionCarrito} type="button">
              <span className={style.modalIcono}>C</span>
              <span>Anadir al carrito</span>
            </button>

            <button className={style.accionCompra} type="button">
              <span className={style.modalIcono}>WA</span>
              <span>Realizar la compra</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Seccion_4;
