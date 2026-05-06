import { useState } from "react";
import style from "./comprar.module.css";

const API = "https://backendgorrioncito.onrender.com:3001";

export type ItemCotizar = {
  id: number;
  titulo: string;
  categoria: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type Props = {
  items: ItemCotizar[];
  onCerrar: () => void;
};

type Estado = "formulario" | "enviando" | "exito" | "error";

const ModalComprar = ({ items, onCerrar }: Props) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [dni, setDni] = useState("");
  const [estado, setEstado] = useState<Estado>("formulario");
  const [errorMsg, setErrorMsg] = useState("");

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const validar = (): string | null => {
    if (!nombreCompleto.trim()) return "Por favor ingresa tu nombre completo.";
    if (!/^\d{8}$/.test(dni)) return "El DNI debe tener exactamente 8 dígitos.";
    return null;
  };

  const handleEnviar = async () => {
    const err = validar();
    if (err) { setErrorMsg(err); return; }

    setEstado("enviando");
    setErrorMsg("");

    try {
      const body = {
        nombre_completo: nombreCompleto.trim(),
        dni: dni.trim(),
        items: items.map((i) => ({
          id_producto: i.id,
          cantidad: i.cantidad,
        })),
      };

      const res = await fetch(`${API}/api/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Error al registrar la venta.");
      }

      setEstado("exito");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error inesperado.");
      setEstado("error");
    }
  };

  const handleCerrar = () => {
    setNombreCompleto("");
    setDni("");
    setEstado("formulario");
    setErrorMsg("");
    onCerrar();
  };

  return (
    <div
      className={style.overlay}
      onClick={(e) => e.target === e.currentTarget && handleCerrar()}
    >
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Formulario de cotización"
      >
        <div className={style.header}>
          <h2 className={style.headerTitulo}>Cotizar pedido</h2>
          <button type="button" className={style.cerrarBtn} onClick={handleCerrar} aria-label="Cerrar modal">
            ✕
          </button>
        </div>

        {estado === "exito" && (
          <div className={style.exito}>
            <div className={style.exitoIcono}>✅</div>
            <h3>¡Cotización registrada!</h3>
            <p>Nos comunicaremos contigo vía WhatsApp para coordinar el envío y confirmar tu pedido.</p>
            <button type="button" className={style.botonVerde} onClick={handleCerrar}>
              Entendido
            </button>
          </div>
        )}

        {estado !== "exito" && (
          <>
            <div className={style.listaProductos}>
              <h3 className={style.subtitulo}>Productos a cotizar ({items.length})</h3>
              <div className={style.tabla}>
                {items.map((item) => (
                  <div key={item.id} className={style.fila}>
                    <div className={style.filaImagen}>
                      {item.imagen
                        ? <img src={item.imagen} alt={item.titulo} />
                        : <div className={style.filaImagenPlaceholder}>?</div>
                      }
                    </div>
                    <div className={style.filaInfo}>
                      <span className={style.filaTitulo}>{item.titulo}</span>
                      <span className={style.filaCategoria}>{item.categoria}</span>
                    </div>
                    <div className={style.filaCantidad}>x{item.cantidad}</div>
                    <div className={style.filaPrecio}>S/{(item.precio * item.cantidad).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className={style.totalRow}>
                <span>Total estimado:</span>
                <strong>S/{total.toFixed(2)}</strong>
              </div>
            </div>

            <div className={style.formulario}>
              <h3 className={style.subtitulo}>Tus datos</h3>
              <div className={style.campo}>
                <label htmlFor="nombreCompleto" className={style.label}>Nombre completo</label>
                <input
                  id="nombreCompleto"
                  type="text"
                  className={style.input}
                  placeholder="Ej: Juan Pérez García"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  disabled={estado === "enviando"}
                  maxLength={100}
                />
              </div>
              <div className={style.campo}>
                <label htmlFor="dni" className={style.label}>DNI (8 dígitos)</label>
                <input
                  id="dni"
                  type="text"
                  inputMode="numeric"
                  className={style.input}
                  placeholder="Ej: 12345678"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  disabled={estado === "enviando"}
                  maxLength={8}
                />
              </div>

              {errorMsg && (
                <p className={style.errorMsg} role="alert">⚠ {errorMsg}</p>
              )}

              <div className={style.botonesRow}>
                <button type="button" className={style.botonCancelar} onClick={handleCerrar} disabled={estado === "enviando"}>
                  Cancelar
                </button>
                <button type="button" className={style.botonVerde} onClick={handleEnviar} disabled={estado === "enviando"}>
                  {estado === "enviando" ? "Enviando…" : "Confirmar cotización"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalComprar;