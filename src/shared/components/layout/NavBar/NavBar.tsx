import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

type NavBarConfig = {
  css: any; // 🔥 importante porque puede venir string
  color: boolean;
  colorScrolled: boolean;
};


// 🔥 fuera del componente (mejor rendimiento)
const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r || 0}, ${g || 0}, ${b || 0}, ${alpha})`;
};

export default function NavBar() {
  const location = useLocation();
  const [config, setConfig] = useState<NavBarConfig | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 📦 Fetch
  useEffect(() => {
    const fetchNavBar = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("navbar").select("*").limit(1);

      if (error) {
        console.error("SUPABASE ERROR:", error);
        setLoading(false);
        return;
      }

      setConfig(data?.[0] ?? null);
      setLoading(false);
    };

    fetchNavBar();
  }, []);

  // 📜 Scroll
  useEffect(() => {
    const noScrollRoutes = ["/product", "/cart", "/auth"];

    const handleScroll = () => {
      if (!noScrollRoutes.includes(location.pathname)) {
        setScrolled(window.scrollY > 50);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  if (loading || !config) return <div>Cargando navbar...</div>;

  // 🔥 PARSE SEGURO
  let parsedCss: any = {};
  try {
    parsedCss =
      typeof config.css === "string"
        ? JSON.parse(config.css)
        : config.css;
  } catch (e) {
    console.error("Error parsing CSS:", e);
    return <div>Error en configuración</div>;
  }

  const navbar = parsedCss?.navbar;

  if (!navbar) return <div>Navbar mal configurado</div>;

  const bg = navbar.background;

  // 🔥 valores seguros
  const useColor = config.color ?? true;
  const useColorScrolled = config.colorScrolled ?? true;

  // 🎨 COLOR
  const colorNormal = hexToRgba(bg?.normal?.color, bg?.normal?.alpha ?? 1);
  const colorScroll = hexToRgba(bg?.scroll?.color, bg?.scroll?.alpha ?? 1);

  // 🎨 GRADIENTE
  const gradientNormal = `linear-gradient(
    to right,
    ${hexToRgba(bg?.gradiente?.normal?.left, bg?.gradiente?.normal?.alpha ?? 1)},
    ${hexToRgba(bg?.gradiente?.normal?.right, bg?.gradiente?.normal?.alpha ?? 1)}
  )`;

  const gradientScroll = `linear-gradient(
    to right,
    ${hexToRgba(bg?.gradiente?.scroll?.left, bg?.gradiente?.scroll?.alpha ?? 1)},
    ${hexToRgba(bg?.gradiente?.scroll?.right, bg?.gradiente?.scroll?.alpha ?? 1)}
  )`;

  // 🔥 FINAL (una sola vez, sin duplicados)
// 🔥 FINAL (TU LÓGICA REAL)
let finalBackground = "";

// 🟣 CASO 1: USAR COLOR
if (useColor) {
  finalBackground = scrolled ? colorScroll : colorNormal;
}

// 🟢 CASO 2: USAR GRADIENTE
else {
  // 👉 si NO quieres cambio en scroll
  if (!useColorScrolled) {
    finalBackground = gradientNormal; // siempre el mismo
  } 
  // 👉 si quieres cambio en scroll
  else {
    finalBackground = scrolled ? gradientScroll : gradientNormal;
  }
}
  // 🖋 TEXT
  const linkStyle = {
    color: navbar.text?.color || "#fff",
    fontSize: `${navbar.text?.size || 14}px`,
    fontFamily: navbar.text?.font || "Arial",
    textDecoration: "none",
    transition: "color 0.3s",
  };

  return (
    <div
      style={{
        background: finalBackground,
        transition: "background 0.3s ease", // 🔥 animación pro
        padding: `${navbar.padding?.top || 10}px ${navbar.padding?.right || 10}px ${navbar.padding?.bottom || 10}px ${navbar.padding?.left || 10}px`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = navbar.text?.hoverColor || "red")}
          onMouseLeave={e => (e.currentTarget.style.color = navbar.text?.color || "#fff")}
        >
          Home
        </Link>

        <Link
          to="/products"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = navbar.text?.hoverColor || "red")}
          onMouseLeave={e => (e.currentTarget.style.color = navbar.text?.color || "#fff")}
        >
          Productos
        </Link>

        <Link
          to="/about"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = navbar.text?.hoverColor || "red")}
          onMouseLeave={e => (e.currentTarget.style.color = navbar.text?.color || "#fff")}
        >
          Nosotros
        </Link>
      </nav>
    </div>
  );
}