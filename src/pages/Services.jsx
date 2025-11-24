import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { LanguageContext } from "../context/language";

export default function Services() {
  const [items, setItems] = useState([]);
  const { lang } = useContext(LanguageContext);

  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Cargar servicios
  useEffect(() => {
    api
      .get("/services")
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  }, []);

  // ordenar y filtrar solo activos
  const visibleItems = (items || [])
    .filter((it) => it.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="container">
      <h2>Servicios</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 12,
        }}
      >
        {visibleItems.map((it) => {
          // títulos y descripciones desde múltiples posibles campos
          const titleEs = it.title_es || (it.title && it.title.es) || "";
          const titleEn = it.title_en || (it.title && it.title.en) || "";
          const descEs =
            it.desc_es || (it.description && it.description.es) || "";
          const descEn =
            it.desc_en || (it.description && it.description.en) || "";

          const title = lang === "es"
            ? titleEs || titleEn
            : titleEn || titleEs;

          const desc = lang === "es"
            ? descEs || descEn
            : descEn || descEs;

          // misma lógica que en ServicesAdmin: fuentes para imagen
          const baseImage =
            it.image ||
            it.image_url ||
            it.url ||
            it.path ||
            (it.media && it.media.image);

          const baseImageMobile =
            it.image_mobile ||
            it.imageMobile ||
            baseImage;

          const imgSrc = isMobile
            ? baseImageMobile || baseImage || "/placeholder.png"
            : baseImage || baseImageMobile || "/placeholder.png";

          return (
            <div className="card" key={it._id || it.id || title + it.order}>
              <img
                src={imgSrc}
                alt={title || "Servicio"}
                style={{
                  width: "100%",
                  height: isMobile ? 180 : 140,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <h3>{title || "Servicio"}</h3>
              <p>{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
