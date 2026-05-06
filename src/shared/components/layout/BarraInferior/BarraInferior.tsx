import { useEffect, useState } from "react";
import style from "./BarraInferior.module.css";
import { DEFAULT_LOGO_IMAGE } from "../../../utils/catalogImage";

const productos = [
  "ALAMBRE N16",
  "ABRAZADERA 2 A 3/4 INRELY",
  "ARANDELA",
  "ACCESORIOS",
  "ADAPTADOR HDPE 3/4",
];

const whatsappNumber = "51915144663";
const whatsappMessage = "Hola, quiero solicitar una cotizacion.";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
const facebookUrl = "https://www.facebook.com/Distribuidoraferregorrioncito/";
const tiktokUrl = "https://www.tiktok.com/@ferreteriagorrioncito0";
const BarraInferior = () => {
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_IMAGE);

  useEffect(() => {
    setLogoUrl(DEFAULT_LOGO_IMAGE);
  }, []);

  return (
    <footer className={style.footer}>
      <div className={style.superior}>
        <div className={style.columnaMarca}>
          <div className={style.logoWrap}>
            <img src={logoUrl} alt="Logo Gorrioncito" className={style.logo} />
          </div>

          <div className={style.datosEmpresa}>
            <p><strong>Razon Social:</strong></p>
            <p>DISTRIBUIDORA FERRETERA GORRIONCITO E.I.R.L.</p>
            <p><strong>RUC:</strong> 20602960227</p>
            <p><strong>Tipo de Empresa:</strong></p>
            <p>Empresa Individual de Responsabilidad Limitada</p>
          </div>
        </div>

        <div className={style.columna}>
          <h3 className={style.titulo}>Nuestros productos</h3>
          <ul className={style.lista}>
            {productos.map((producto) => (
              <li key={producto}>{producto}</li>
            ))}
          </ul>
        </div>

        <div className={style.columna}>
          <h3 className={style.titulo}>Enlaces rapidos</h3>
          <ul className={style.lista}>
            <li>Nosotros</li>
          </ul>
        </div>

        <div className={style.columna}>
          <h3 className={style.titulo}>Contactos</h3>
          <div className={style.contactos}>
            <p>+51 915 144 663</p>
            <p>distribuidoraferrorgorrioncito@gmail.com</p>
          </div>

          <div className={style.iconos}>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className={`${style.icono} ${style.iconoFacebook} ${style.iconoLink}`}
              aria-label="Visitar Facebook"
            >
              F
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className={`${style.icono} ${style.iconoTikTok} ${style.iconoLink}`}
              aria-label="Visitar TikTok"
            >
              T
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className={`${style.icono} ${style.iconoMessenger} ${style.iconoLink}`}
              aria-label="Contactar por Messenger"
            >
              M
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`${style.icono} ${style.iconoWhatsapp} ${style.iconoLink}`}
              aria-label="Contactar por WhatsApp"
            >
              WA
            </a>
          </div>
        </div>
      </div>

      <div className={style.inferior}>
        <p>&copy; 2026 Gorrioncito. Todos los derechos reservados.</p>
        <p>Av. Primero de Noviembre Mza. a Lote, 06 Sec. Quinta Aurora</p>
      </div>

      <div className={style.politica}>
        <h3 className={style.politicaTitulo}>Politica de privacidad</h3>
        <p>
          Este sitio no tiene registro ni inicio de sesion y no recopila datos
          personales directamente desde la web.
        </p>
        <p>
          Las cotizaciones se gestionan por WhatsApp; cualquier informacion
          enviada por el usuario se comparte de forma voluntaria y se utiliza
          solo para atender consultas o solicitudes. El uso de WhatsApp esta
          sujeto a sus propias politicas de privacidad.
        </p>
      </div>
    </footer>
  );
};

export default BarraInferior;
