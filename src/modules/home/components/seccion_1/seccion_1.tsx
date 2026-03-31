import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./seccion_1.module.css";

import img1 from "../../../../assets/img/Sin título-11.png";
import img2 from "../../../../assets/img/Sin título-13.png";
import img3 from "../../../../assets/img/img6.jpg";
import img4 from "../../../../assets/img/img2.jpg";
import img5 from "../../../../assets/img/img3.jpg";
import img6 from "../../../../assets/img/img4.jpg";
import img7 from "../../../../assets/img/img5.jpg";

const images = [
  { src: img1, link: "/proveedores" },
  { src: img2, link: "/catalogo" },
  { src: img3, link: "/nosotros" },
  { src: img4, link: "/productos" },
  { src: img5, link: "/contacto" },
  { src: img6, link: "/ofertas" },
  { src: img7, link: "/servicios" }
];

const Seccion_1 = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.carousel}>

      {/* Flecha izquierda */}
      <button
        className={styles.arrowLeft}
        onClick={prevSlide}
      >
        ❮
      </button>

      {/* Imagen clickeable */}
      <Link to={images[currentIndex].link}>
        <img
          src={images[currentIndex].src}
          alt={`Imagen ${currentIndex + 1}`}
          className={styles.carouselImage}
        />
      </Link>

      {/* Flecha derecha */}
      <button
        className={styles.arrowRight}
        onClick={nextSlide}
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

    </section>
  );
};

export default Seccion_1;