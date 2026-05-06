import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import style from "./seccion_1.module.css";

type CartItem = {
  id: string;
  titulo: string;
  categoria: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

const STORAGE_KEY = "cartItems";

const Seccion_1 = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    try {
      const parsed = JSON.parse(data) as CartItem[];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  const persistir = (nextItems: CartItem[]) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  const cambiarCantidad = (id: string, delta: number) => {
    const nextItems = items.map((item) =>
      item.id === id
        ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
        : item
    );

    persistir(nextItems);
  };

  const eliminar = (id: string) => {
    const nextItems = items.filter((item) => item.id !== id);
    persistir(nextItems);
  };

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <section className={style.vacio}>
        <div className={style.vacioIcono}>
          <svg
            viewBox="0 0 80 80"
            aria-hidden="true"
            className={style.vacioSvg}
          >
            <rect x="16" y="28" width="48" height="28" rx="6" />
            <path d="M28 16h24v16H28z" />
            <circle cx="58" cy="18" r="9" />
            <path d="M56 18h4M60 18l-2 2M60 18l-2-2" />
          </svg>
        </div>
        <h2 className={style.vacioTitulo}>
          Volver a <span>Comprar</span>
        </h2>
        <p className={style.vacioTexto}>
          Tu carrito esta vacio. Explora nuevamente el catalogo y agrega los
          productos que necesitas.
        </p>
        <Link to="/product" className={style.vacioBoton}>
          Volver a comprar
        </Link>
      </section>
    );
  }

  return (
    <section className={style.seccion}>
      <div className={style.contenido}>
        <div className={style.listaArea}>
          <h2 className={style.titulo}>
            <span className={style.tituloIcono}>🛒</span>
            <span>Mi Carrito</span>
          </h2>

          <div className={style.selector}>
            <span className={style.selectorCheck}>✓</span>
            <span>Seleccionar</span>
          </div>

          <div className={style.lista}>
            {items.map((item) => (
              <article key={item.id} className={style.card}>
                <div className={style.cardCheck}>✓</div>

                <div className={style.cardImagenWrap}>
                  <img src={item.imagen} alt={item.titulo} className={style.cardImagen} />
                </div>

                <div className={style.cardInfo}>
                  <h3 className={style.cardTitulo}>{item.titulo}</h3>
                  <p className={style.cardCategoria}>{item.categoria}</p>
                  <p className={style.cantidadLabel}>Cantidad</p>

                  <div className={style.cardAcciones}>
                    <div className={style.cantidadBox}>
                      <button type="button" onClick={() => cambiarCantidad(item.id, -1)}>
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button type="button" onClick={() => cambiarCantidad(item.id, 1)}>
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={style.eliminarBtn}
                      onClick={() => eliminar(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className={style.cardPrecio}>
                  S/{(item.precio * item.cantidad).toFixed(2)}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={style.resumen}>
          <h3 className={style.resumenTitulo}>Resumen de la orden</h3>
          <p className={style.resumenTexto}>
            Costo de envio por coordinar via WhatsApp
          </p>

          <div className={style.resumenProductos}>
            Productos seleccionados ({items.length})
          </div>

          <div className={style.totales}>
            <p>
              <span>Subtotal:</span>
              <strong>S/{subtotal.toFixed(2)}</strong>
            </p>
            <p className={style.totalFinal}>
              <span>Total:</span>
              <strong>S/{subtotal.toFixed(2)}</strong>
            </p>
          </div>

          <button type="button" className={style.botonVerde}>
            Cotizar seleccionados
          </button>
          <button type="button" className={style.botonVerdeSecundario}>
            Cotizar todo
          </button>

          <Link to="/product" className={style.verMas}>
            Ver mas productos
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Seccion_1;
