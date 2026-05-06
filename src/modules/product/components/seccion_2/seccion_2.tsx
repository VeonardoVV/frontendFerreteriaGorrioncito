import { useMemo, useState } from "react";
import styles from "./seccion_2.module.css";
import type { CatalogCategory } from "../catalogData";

type Props = {
  categorias: CatalogCategory[];
  marcas: string[];
  categoriasSeleccionadas: string[];
  marcasSeleccionadas: string[];
  onCategoriaSeleccionada: (categoria: string) => void;
  onMarcaSeleccionada: (marca: string) => void;
};

export default function Seccion_2({
  categorias,
  marcas,
  categoriasSeleccionadas,
  marcasSeleccionadas,
  onCategoriaSeleccionada,
  onMarcaSeleccionada,
}: Props) {
  const [tabActiva, setTabActiva] = useState<"categorias" | "marcas">("categorias");
  const [busqueda, setBusqueda] = useState("");

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, categorias]);

  const marcasFiltradas = useMemo(() => {
    return marcas.filter((item) =>
      item.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, marcas]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tabActiva === "categorias" ? styles.tabActiva : ""}`}
          onClick={() => setTabActiva("categorias")}
        >
          Categorias
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tabActiva === "marcas" ? styles.tabActiva : ""}`}
          onClick={() => setTabActiva("marcas")}
        >
          Marcas
        </button>
      </div>

      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>Q</span>
        <input
          type="text"
          placeholder={tabActiva === "categorias" ? "Buscar Categoria" : "Buscar Marca"}
          className={styles.searchInput}
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
        />
      </div>

      {tabActiva === "categorias" ? (
        <div className={styles.lista}>
          <h3 className={styles.titulo}>Categorias</h3>
          {categoriasFiltradas.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={`${styles.item} ${
                categoriasSeleccionadas.includes(categoria.nombre) ? styles.itemActivo : ""
              }`}
              onClick={() => onCategoriaSeleccionada(categoria.nombre)}
            >
              <span>{categoria.nombre}</span>
              <span>({categoria.total})</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.lista}>
          <h3 className={styles.titulo}>Marcas</h3>
          {marcasFiltradas.map((marca) => (
            <button
              key={marca}
              type="button"
              className={`${styles.item} ${
                marcasSeleccionadas.includes(marca) ? styles.itemActivo : ""
              }`}
              onClick={() => onMarcaSeleccionada(marca)}
            >
              <span>{marca}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
