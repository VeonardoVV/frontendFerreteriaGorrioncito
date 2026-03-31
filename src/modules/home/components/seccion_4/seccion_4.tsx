import { useState, useEffect } from "react";
import style from "./seccion_4.module.css";

import imgPrueba3 from "../../../../assets/img/celsa.png";

const Seccion_4 = () => {
  const palabras = ["resultados", "agilidad", "soluciones reales", "eficiencia", "rapidez", "precisión"];
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % palabras.length); // va ciclando
    }, 1000); // cada 1 segundo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.seccion_3}>
      <div className={style.paraLetra}>
        <span>- Principales Marcas -</span>
        <p>
          Los grandes están con nosotros{" "}
          <span style={{ color: "rgb(247, 147, 30)" }}>
            {palabras[visibleIndex]}
          </span>{" "}
          .
        </p>
      </div>
      <div className={style.imgPruebacss3}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={style.imgContainer}>
            <img src={imgPrueba3} alt="no hay imagen" />
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Seccion_4;