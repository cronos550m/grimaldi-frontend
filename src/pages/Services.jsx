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
        {items.map((it) => {
          const imgSrc = isMobile
            ? it.image_mobile || it.image || "/placeholder.png"
            : it.image || it.image_mobile || "/placeholder.png";

          return (
            <div className="card" key={it._id || it.id}>
              <img
                src={imgSrc}
                alt={it.title?.[lang] || it.title?.es || "Servicio"}
                style={{
                  width: "100%",
                  height: isMobile ? 180 : 140,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <h3>{it.title?.[lang] || it.title?.es}</h3>
              <p>{it.description?.[lang] || it.description?.es}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
