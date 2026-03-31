import styles from "./NavBarModalProducto.module.css";
import Seccion_1 from "./components/seccion_1/seccion_1";
import Seccion_2 from "./components/seccion_2/seccion_2";

export default function NavBarModalProducto() {
  return (
    <div className={styles.container}>
      <div className={styles.contenidoPrincipal}>
      <Seccion_1 />
      <Seccion_2 />      
    </div>
    <div className={styles.barraAbajo}>
      Ver todos los productos
    </div>

    </div>
  );
}