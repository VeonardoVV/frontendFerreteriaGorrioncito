import { useMemo, useState } from "react";
import styles from "./seccion_3.module.css";
import type { CatalogProduct } from "../catalogData";

type Props = {
  productos: CatalogProduct[];
  categoriasSeleccionadas: string[];
  marcasSeleccionadas: string[];
  busquedaGeneral: string;
  onEliminarCategoria: (categoria: string) => void;
  onEliminarMarca: (marca: string) => void;
  productosVisibles: number;
  onCargarMas: () => void;
};

type CartItem = {
  id: number;
  titulo: string;
  categoria: string;
  precio: string;
  imagen: string;
  cantidad: number;
};

export default function Seccion_3({
  productos,
  categoriasSeleccionadas,
  marcasSeleccionadas,
  busquedaGeneral,
  onEliminarCategoria,
  onEliminarMarca,
  productosVisibles,
  onCargarMas,
}: Props) {
  const STORAGE_KEY = "cartItems";
  const whatsappNumber = "51915144663";
  const [mostrarModalCompra, setMostrarModalCompra] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<CatalogProduct | null>(null);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoriasSeleccionadas.length === 0 ||
        categoriasSeleccionadas.includes(producto.categoria);

      const coincideMarca =
        marcasSeleccionadas.length === 0 ||
        marcasSeleccionadas.includes(producto.marca);

      const textoBusqueda = `${producto.titulo} ${producto.categoria} ${producto.marca}`.toLowerCase();
      const coincideBusqueda =
        busquedaGeneral.length === 0 || textoBusqueda.includes(busquedaGeneral);

      return coincideCategoria && coincideMarca && coincideBusqueda;
    });
  }, [productos, categoriasSeleccionadas, marcasSeleccionadas, busquedaGeneral]);

  const productosRenderizados = useMemo(
    () => productosFiltrados.slice(0, productosVisibles),
    [productosFiltrados, productosVisibles]
  );

  const abrirModalCompra = (producto: CatalogProduct) => {
    setProductoSeleccionado(producto);
    setMostrarModalCompra(true);
  };

  const cerrarModalCompra = () => {
    setMostrarModalCompra(false);
    setProductoSeleccionado(null);
  };

  const anadirAlCarrito = () => {
    if (!productoSeleccionado) return;

    const actual = localStorage.getItem(STORAGE_KEY);
    const cartItems: CartItem[] = actual ? JSON.parse(actual) : [];
    const existente = cartItems.find((item) => item.id === productoSeleccionado.id);

    const nextItems = existente
      ? cartItems.map((item) =>
          item.id === productoSeleccionado.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      : [
          ...cartItems,
          {
            id: productoSeleccionado.id,
            titulo: productoSeleccionado.titulo,
            categoria: productoSeleccionado.categoria,
            precio: productoSeleccionado.precio,
            imagen: productoSeleccionado.imagen,
            cantidad: 1,
          },
        ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    cerrarModalCompra();
  };

  const comprarPorWhatsapp = () => {
    if (!productoSeleccionado) return;

    const mensaje = [
      "Hola, quiero comprar este producto:",
      productoSeleccionado.titulo,
      `Marca: ${productoSeleccionado.marca}`,
      `Categoria: ${productoSeleccionado.categoria}`,
      `Precio: ${productoSeleccionado.precio}`,
    ].join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <section className={styles.contenido}>
        <div className={styles.resumen}>
          <div className={styles.resumenCabecera}>
            <div>
              <p className={styles.resumenTitulo}>Filtros activos</p>
              <p className={styles.resumenTexto}>
                Ajusta categorias y marcas para encontrar mas rapido.
              </p>
            </div>
          </div>

          <div className={styles.resumenGrid}>
            <div className={styles.resumenBloque}>
              <p className={styles.etiqueta}>Marca</p>
              <div className={styles.tagsFila}>
                {marcasSeleccionadas.length > 0 ? (
                  marcasSeleccionadas.map((marca) => (
                    <button
                      key={marca}
                      type="button"
                      className={styles.tagBoton}
                      onClick={() => onEliminarMarca(marca)}
                    >
                      <span className={styles.tagTexto}>{marca}</span>
                      <span className={styles.tagCerrar}>x</span>
                    </button>
                  ))
                ) : (
                  <span className={styles.tag}>Todas</span>
                )}
              </div>
            </div>

            <div className={styles.resumenBloque}>
              <p className={styles.etiqueta}>Categorias</p>
              <div className={styles.tagsFila}>
                {categoriasSeleccionadas.length > 0 ? (
                  categoriasSeleccionadas.map((categoria) => (
                    <button
                      key={categoria}
                      type="button"
                      className={styles.tagBoton}
                      onClick={() => onEliminarCategoria(categoria)}
                    >
                      <span className={styles.tagTexto}>{categoria}</span>
                      <span className={styles.tagCerrar}>x</span>
                    </button>
                  ))
                ) : (
                  <span className={styles.tag}>Todas</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cuerpo}>
          <div className={styles.productosArea}>
            {productos.length === 0 ? (
              <div className={styles.vacio}>Cargando productos...</div>
            ) : productosFiltrados.length > 0 ? (
              <div className={styles.gridProductos}>
                {productosRenderizados.map((producto) => (
                  <article key={producto.id} className={styles.productoCard}>
                    <div className={styles.productoImagenWrap}>
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.titulo}
                          className={styles.productoImagen}
                        />
                      ) : (
                        <div className={styles.productoPlaceholder}>Sin imagen</div>
                      )}
                    </div>

                    <h3 className={styles.productoTitulo}>{producto.titulo}</h3>
                    <p className={styles.productoCategoria}>{producto.categoria}</p>
                    <p className={styles.productoMarca}>{producto.marca}</p>
                    <p className={styles.productoPrecio}>{producto.precio}</p>

                    <button
                      type="button"
                      className={styles.productoBoton}
                      onClick={() => abrirModalCompra(producto)}
                    >
                      Lo quiero
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.vacio}>
                No hay productos para la seleccion actual.
              </div>
            )}

            {productosFiltrados.length > productosRenderizados.length && (
              <div className={styles.acciones}>
                <button type="button" className={styles.cargarMas} onClick={onCargarMas}>
                  Ver mas productos
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mostrarModalCompra && (
        <div className={styles.modalOverlay} onClick={cerrarModalCompra}>
          <div className={styles.modalCompra} onClick={(event) => event.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Como deseas continuar?</h3>
            <p className={styles.modalTexto}>
              Elige una opcion para poder completar tu compra
            </p>

            <button
              type="button"
              className={styles.modalBotonNaranja}
              onClick={anadirAlCarrito}
            >
              <span className={styles.modalIcono}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.modalSvg}>
                  <path
                    d="M7 6h14l-1.5 7.5H9L7 4H3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="19" r="1.6" fill="currentColor" />
                  <circle cx="18" cy="19" r="1.6" fill="currentColor" />
                </svg>
              </span>
              <span>Anadir al carrito</span>
            </button>

            <button type="button" className={styles.modalBotonVerde} onClick={comprarPorWhatsapp}>
              <span className={styles.modalIcono}>WA</span>
              <span>Realizar la compra</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
