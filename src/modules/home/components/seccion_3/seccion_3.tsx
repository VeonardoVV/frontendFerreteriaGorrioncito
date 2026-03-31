import { useEffect, useState } from "react";
import style from "./seccion_3.module.css";

const Seccion_3 = () => {

  const [imagenes, setImagenes] = useState<string[]>([]);

  useEffect(() => {

    fetch("http://localhost:8080/proyecto_gorrioncito/backend/api/listar_imagenes.php")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setImagenes(data);
      });

  }, []);

  return (
    <div className={style.seccion2}>
      <span>- Principales Categorías -</span>
      <p>
        ¡Elige, haz clic y <span className={style.construye}>construye</span>!
      </p>

      <div className={style.imgPruebacss}>
        <div className={style.carrusel}>

          {imagenes.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8080/proyecto_gorrioncito/frontend/img/categorias/${img}`}
              alt="categoria"
            />
          ))}

        </div>
      </div>

    </div>
  );
};

export default Seccion_3;