import { useEffect, useState } from "react";
import style from "./seccion_6.module.css";

import img1 from "../../../../assets/img/img1.jpg";
import img2 from "../../../../assets/img/img2.jpg";
import img3 from "../../../../assets/img/img3.jpg";
import img4 from "../../../../assets/img/img4.jpg";
import img5 from "../../../../assets/img/img5.jpg";
import img6 from "../../../../assets/img/img6.jpg";

const fondos = [img1, img2, img3, img4, img5, img6];

const textos = [
  
  "IE 100 COLEGIO BICENTENARIO Pueto Ocopa, Rio Tambo",
  "AEROPUERTO Jorge Chavez-Lima.",
  "CENTRAL PLAZA Santa Anita-Lima.",
  "COLEGIO BICENTENARIO Junin-Lima.",
  "VILLA PRIMAVERA ILO-Moquegua.",
  "CANAL DE RIEGO SANTA ELENA PAITA-Piura.",
];

const Seccion_6 = () => {
  const [index, setIndex] = useState(0);

  // Cambia fondo y texto cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % fondos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={style.seccion5}
      style={{ backgroundImage: `url(${fondos[index]})` }}
    >
      <div className={style.overlayGlobal}>
        <span>
          Obras <span className={style.construye5}>históricas</span>
        </span>

        <p className={style.descripcion}>Hagamos historia</p>

        {/* 👇 TEXTO SIN MAP */}
        <p key={index} className={style.textoDinamico}>
          {textos[index]}
        </p>
      </div>
    </section>
  );
};

export default Seccion_6;