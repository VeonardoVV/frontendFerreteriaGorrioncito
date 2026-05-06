import { useEffect, useState } from "react";
import style from "./CartPage.module.css";
import Seccion_1 from "../components/seccion_1/seccion_1";

const STORAGE_KEY = "cartItems";

export default function ProductPage() {
  const [tieneItems, setTieneItems] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      setTieneItems(false);
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setTieneItems(Array.isArray(parsed) && parsed.length > 0);
    } catch {
      setTieneItems(false);
    }
  }, []);

  return (
    <main className={style.contenidoHome}>
      {tieneItems ? (
        <header className={style.encabezado}>
          <h1 className={style.titulo}>Carrito de Compra</h1>
        </header>
      ) : null}

      <Seccion_1 />
    </main>
  );
}
