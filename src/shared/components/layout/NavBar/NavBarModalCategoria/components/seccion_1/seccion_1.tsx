import styles from "./seccion_1.module.css";
import { Link } from "react-router-dom";

export default function Seccion_1() {
  return (
    <div className={styles.categorias}>
      <h3>categorias</h3>
      <div className={styles.contenido}>
        <p><b>Electricidad</b>
          <ul>cables</ul>
        </p>
          
        <p><b>Acero</b>
          <ul>Alambres</ul>
          <ul>Barras de Acero</ul>
          <ul>Clavos</ul>
          <ul>cables</ul>
        </p>

        <p><b>Tuverías,Válvulas y conexiones</b>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
        </p>

        <p><b>Embolsadosssssss</b>
          <ul>Cemento</ul>
        </p>

        <p><b>Herramientas</b>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
        </p>


        <p><b>Quimicos para construcción</b>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
        </p>
      
        <p><b>Quimicos para construcción</b>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
          <ul>Agua</ul>
          <ul>Desasgue</ul>
          <ul>Eléctrica</ul>
          <ul>UF</ul>
        </p>

      </div>
    </div>
  );
}