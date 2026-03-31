import style from "./seccion_7.module.css";

import imgPrueba from "../../../../assets/img/yt1.jpg";

const Seccion_7 = () => {

  return (
    <div className={style.seccion}>
      <span>Testimonios</span>
      <div className={style.imgPruebacss}>
        <img src={imgPrueba} alt="no hay imagen" />
        <img src={imgPrueba} alt="no hay imagen" />
        <img src={imgPrueba} alt="no hay imagen" />
      </div>
    </div>
  );
};

export default Seccion_7;