import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../../lib/supabase";
import ModalComprar, { ItemCotizar } from "./comprar";
import style from "./seccion_1.module.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type CartItem = {
  id: number;
  titulo: string;
  categoria: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type ProductoRow = {
  prdcid: number;
  prdcprecio: number;
  prdcimgnombre: string;
  prdcimgnombrebucket: string | null;
  categoria: {
    ctgraimgnombre: string;
  };
};

const STORAGE_KEY = "cartItems";

// ─── Helper URL pública ───────────────────────────────────────────────────────
const getPublicUrl = (bucket: string | null, nombre: string): string => {
  if (!bucket) return "";
  const { data } = supabase.storage.from(bucket).getPublicUrl(nombre);
  return data?.publicUrl ?? "";
};

// ─── Componente ───────────────────────────────────────────────────────────────
const Seccion_1 = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargando, setCargando] = useState(true);

  // IDs seleccionados con checkbox
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());

  // Control modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemsParaCotizar, setItemsParaCotizar] = useState<ItemCotizar[]>([]);

  // ── 1. Cargar localStorage + verificar precios en Supabase ─────────────────
  useEffect(() => {
    const init = async () => {
      setCargando(true);

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { setCargando(false); return; }

      let local: CartItem[] = [];
      try {
        const parsed = JSON.parse(raw);
        local = Array.isArray(parsed) ? parsed : [];
      } catch {
        local = [];
      }

      if (local.length === 0) { setCargando(false); return; }

      const ids = local.map((i) => i.id);
      const { data, error } = await supabase
        .from("producto")
        .select(
          `prdcid,
           prdcprecio,
           prdcimgnombre,
           prdcimgnombrebucket,
           categoria ( ctgraimgnombre )`
        )
        .in("prdcid", ids);

      if (error || !data) {
        setItems(local);
        setCargando(false);
        return;
      }

      const merged: CartItem[] = local
        .map((localItem) => {
          const row = (data as ProductoRow[]).find(
            (r) => r.prdcid === Number(localItem.id)
          );
          if (!row) return null;
          return {
            id: row.prdcid,
            titulo: row.prdcimgnombre,
            categoria: row.categoria?.ctgraimgnombre ?? "",
            precio: Number(row.prdcprecio ?? 0),
            imagen: getPublicUrl(row.prdcimgnombrebucket, row.prdcimgnombre),
            cantidad: localItem.cantidad ?? 1,
          } satisfies CartItem;
        })
        .filter((i): i is CartItem => i !== null);

      setItems(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setCargando(false);
    };

    init();
  }, []);

  // ── 2. Persistir ────────────────────────────────────────────────────────────
  const persistir = (nextItems: CartItem[]) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  // ── 3. Cantidad ─────────────────────────────────────────────────────────────
  const cambiarCantidad = (id: number, delta: number) => {
    const nextItems = items.map((item) =>
      item.id === id
        ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
        : item
    );
    persistir(nextItems);
  };

  // ── 4. Eliminar ─────────────────────────────────────────────────────────────
  const eliminar = (id: number) => {
    persistir(items.filter((item) => item.id !== id));
    setSeleccionados((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // ── 5. Checkboxes ───────────────────────────────────────────────────────────
  const todosSeleccionados =
    items.length > 0 && seleccionados.size === items.length;

  const toggleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(items.map((i) => i.id)));
    }
  };

  const toggleItem = (id: number) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── 6. Subtotal ─────────────────────────────────────────────────────────────
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items]
  );

  // ── 7. Abrir modal ──────────────────────────────────────────────────────────
  const abrirModal = (modo: "seleccionados" | "todos") => {
    const lista =
      modo === "todos"
        ? items
        : items.filter((item) => seleccionados.has(item.id));

    if (lista.length === 0) return;

    setItemsParaCotizar(
      lista.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        categoria: item.categoria,
        precio: item.precio,
        imagen: item.imagen,
        cantidad: item.cantidad,
      }))
    );
    setModalAbierto(true);
  };

  // ── Cargando ────────────────────────────────────────────────────────────────
  if (cargando) {
    return (
      <section className={style.vacio}>
        <p className={style.vacioTexto}>Cargando carrito…</p>
      </section>
    );
  }

  // ── Vacío ───────────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <section className={style.vacio}>
        <div className={style.vacioIcono}>
          <svg viewBox="0 0 80 80" aria-hidden="true" className={style.vacioSvg}>
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
          Tu carrito está vacío. Explora nuevamente el catálogo y agrega los
          productos que necesitas.
        </p>
        <Link to="/product" className={style.vacioBoton}>
          Volver a comprar
        </Link>
      </section>
    );
  }

  // ── Vista principal ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Modal cotización */}
      {modalAbierto && (
        <ModalComprar
          items={itemsParaCotizar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      <section className={style.seccion}>
        <div className={style.contenido}>
          {/* Lista de productos */}
          <div className={style.listaArea}>
            <h2 className={style.titulo}>
              <span className={style.tituloIcono}>🛒</span>
              <span>Mi Carrito</span>
            </h2>

            {/* Seleccionar todos */}
            <div
              className={style.selector}
              onClick={toggleSeleccionarTodos}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              <span
                className={style.selectorCheck}
                style={{
                  opacity: todosSeleccionados ? 1 : 0.3,
                  transition: "opacity 0.2s",
                }}
              >
                ✓
              </span>
              <span>
                {todosSeleccionados ? "Deseleccionar todos" : "Seleccionar todos"}
              </span>
            </div>

            <div className={style.lista}>
              {items.map((item) => {
                const estaSeleccionado = seleccionados.has(item.id);

                return (
                  <article
                    key={item.id}
                    className={style.card}
                    style={{
                      outline: estaSeleccionado ? "2px solid #16a34a" : "2px solid transparent",
                      transition: "outline 0.15s",
                    }}
                  >
                    {/* Checkbox individual */}
                    <div
                      className={style.cardCheck}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        cursor: "pointer",
                        opacity: estaSeleccionado ? 1 : 0.25,
                        transition: "opacity 0.2s",
                        userSelect: "none",
                      }}
                    >
                      ✓
                    </div>

                    <div className={style.cardImagenWrap}>
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.titulo}
                          className={style.cardImagen}
                        />
                      ) : (
                        <div className={style.cardImagenPlaceholder}>Sin imagen</div>
                      )}
                    </div>

                    <div className={style.cardInfo}>
                      <h3 className={style.cardTitulo}>{item.titulo}</h3>
                      <p className={style.cardCategoria}>{item.categoria}</p>

                      <p className={style.precioUnitario}>
                        Precio unit.:{" "}
                        <strong>S/{Number(item.precio).toFixed(2)}</strong>
                      </p>

                      <p className={style.cantidadLabel}>Cantidad</p>

                      <div className={style.cardAcciones}>
                        <div className={style.cantidadBox}>
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(item.id, -1)}
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(item.id, 1)}
                            aria-label="Aumentar cantidad"
                          >
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
                );
              })}
            </div>
          </div>

          {/* Resumen lateral */}
          <aside className={style.resumen}>
            <h3 className={style.resumenTitulo}>Resumen de la orden</h3>
            <p className={style.resumenTexto}>
              Costo de envío por coordinar vía WhatsApp
            </p>

            <div className={style.resumenProductos}>
              Productos seleccionados ({seleccionados.size} / {items.length})
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

            <button
              type="button"
              className={style.botonVerde}
              onClick={() => abrirModal("seleccionados")}
              disabled={seleccionados.size === 0}
              style={{ opacity: seleccionados.size === 0 ? 0.5 : 1, cursor: seleccionados.size === 0 ? "not-allowed" : "pointer" }}
            >
              Cotizar seleccionados ({seleccionados.size})
            </button>

            <button
              type="button"
              className={style.botonVerdeSecundario}
              onClick={() => abrirModal("todos")}
            >
              Cotizar todo
            </button>

            <Link to="/product" className={style.verMas}>
              Ver más productos
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Seccion_1;