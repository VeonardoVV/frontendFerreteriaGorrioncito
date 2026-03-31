import { useState, useEffect } from "react";
import style from "./seccion_2.module.css";

import imgPrueba from "../../../../assets/img/imagenPrueba.jpg";

const Seccion_2 = () => {
  const palabras = ["resultados", "agilidad", "soluciones reales", "eficiencia", "rapidez", "precisión"];
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % palabras.length); // va ciclando
    }, 1000); // cada 1 segundo
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className={style.seccion}>
      <span>- Pasos para cotizar -</span>
      <p>
        Tu tiempo merece{" "}
        <span style={{ color: "rgb(247, 147, 30)" }}>
          {palabras[visibleIndex]}
        </span>{" "}
        .
      </p>
      <div className={style.imgPruebacss}>
        <img src={imgPrueba} alt="no hay imagen" />
        <img src={imgPrueba} alt="no hay imagen" />
        <img src={imgPrueba} alt="no hay imagen" />
      </div>
    </div>
  );
};

export default Seccion_2;