import style from "./seccion_5.module.css";
import imgPrueba from "../../../../assets/img/Celsa.png";

const Seccion_5 = () => {
  return (
    <div className={style.seccion4}>
      

      <div className={style.imgPruebacss4}>
        <div className={style.carrusel4}>
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
        </div>
      </div>
      <h2>Nos eligen para construir, nos respaldan para crecer.</h2> 
      <div className={style.imgPruebacss4_2}>
        <div className={style.carrusel4_2}>
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
          <img src={imgPrueba} alt="no hay imagen" />
        </div>
      </div>
    </div>
  );
};

export default Seccion_5;