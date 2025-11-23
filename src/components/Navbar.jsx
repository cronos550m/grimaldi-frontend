import React, { useContext, useState } from "react";
import { LanguageContext } from "../context/language";
import "../styles/navbar.css";

export default function Navbar() {
  const { lang, setLang, texts } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 60;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

  // tema leído desde settings (ui.navbarTheme)
  const themeKey = texts.ui?.navbarTheme || "blue";

  return (
    <header className={`navbar navbar-theme-${themeKey}`}>
      <div className="navbar-inner">
        <button
          className="navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-menu ${open ? "is-open" : ""}`}>
          {/* Logo junto al botón Home */}
          <button
            type="button"
            className="navbar-menu-logo"
            onClick={() => scrollToSection("hero")}
          >
            <img
              src="/logotransparente.png"
              alt="Grimaldi Log"
              className="navbar-logo"
            />
          </button>

          <button type="button" onClick={() => scrollToSection("hero")}>
            {lang === "es" ? "Inicio" : "Home"}
          </button>

          <button type="button" onClick={() => scrollToSection("servicios")}>
            {lang === "es" ? "Servicios" : "Services"}
          </button>

          <button type="button" onClick={() => scrollToSection("nosotros")}>
            {lang === "es" ? "Nosotros" : "About us"}
          </button>

          <button type="button" onClick={() => scrollToSection("testimonios")}>
            {lang === "es" ? "Testimonios" : "Testimonials"}
          </button>

          {/* NUEVO: Dónde estamos */}
          <button type="button" onClick={() => scrollToSection("ubicacion")}>
            {lang === "es" ? "Dónde estamos" : "Where we are"}
          </button>

          <button type="button" onClick={() => scrollToSection("contacto")}>
            {lang === "es" ? "Contacto" : "Contact"}
          </button>

          <div className="navbar-lang-switch">
            <button
              onClick={() => setLang("es")}
              className={lang === "es" ? "active" : ""}
            >
              ES
            </button>
            <button
              onClick={() => setLang("en")}
              className={lang === "en" ? "active" : ""}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
