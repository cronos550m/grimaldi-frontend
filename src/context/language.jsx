import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "es");
  const [texts, setTexts] = useState({});

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};

        // Agrupar claves terminadas en _es / _en
        const grouped = {};
        Object.keys(data).forEach((key) => {
          if (key.endsWith("_es")) {
            const base = key.slice(0, -3);
            if (!grouped[base]) grouped[base] = {};
            grouped[base].es = data[key];
          } else if (key.endsWith("_en")) {
            const base = key.slice(0, -3);
            if (!grouped[base]) grouped[base] = {};
            grouped[base].en = data[key];
          }
        });

        const home = {
          title:
            lang === "es"
              ? data.home_title_es || grouped.home_title?.es
              : data.home_title_en || grouped.home_title?.en,
          desc:
            lang === "es"
              ? data.home_desc_es || grouped.home_desc?.es
              : data.home_desc_en || grouped.home_desc?.en,
          heroImage: data.home_hero_image || "",
          // NUEVO: imagen específica para mobile, cae a la de desktop si no hay
          heroImageMobile:
            data.home_hero_image_mobile || data.home_hero_image || "",
        };

        const about = {
          title:
            lang === "es"
              ? data.about_title_es || grouped.about_title?.es
              : data.about_title_en || grouped.about_title?.en,
          desc:
            lang === "es"
              ? data.about_desc_es || grouped.about_desc?.es
              : data.about_desc_en || grouped.about_desc?.en,
          image: data.about_image || "",
        };

        const contact = {
          title:
            lang === "es"
              ? data.contact_title_es || grouped.contact_title?.es
              : data.contact_title_en || grouped.contact_title?.en,
        };

        const ui = {
          navbarTheme: data.navbar_theme || "blue",
          showHeroTag:
            data.show_hero_tag === true || data.show_hero_tag === "true",
        };

        const normalized = {
          ...grouped,
          home,
          about,
          contact,
          ui,
        };

        setTexts(normalized);
      } catch (e) {
        console.error("Error cargando textos", e);
      }
    }

    load();
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, texts }}>
      {children}
    </LanguageContext.Provider>
  );
}
