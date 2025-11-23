import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function TranslationsAdmin({ token }) {
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState({
    home_title_es: "",
    home_title_en: "",
    home_desc_es: "",
    home_desc_en: "",
    contact_title_es: "",
    contact_title_en: "",
  });

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // FIX: useEffect sin async directo
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};

        setTexts({
          home_title_es: data.home_title_es || "",
          home_title_en: data.home_title_en || "",
          home_desc_es: data.home_desc_es || "",
          home_desc_en: data.home_desc_en || "",
          contact_title_es: data.contact_title_es || "",
          contact_title_en: data.contact_title_en || "",
        });
      } catch (err) {
        console.error("Error cargando traducciones:", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  const saveKey = async (key, value) => {
    await api.post(`/settings/${key}`, { value }, authConfig());
  };

  const saveAll = async () => {
    for (const k of Object.keys(texts)) {
      await saveKey(k, texts[k]);
    }
    alert("Traducciones guardadas correctamente");
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div>
      <h1>Traducciones ES / EN</h1>

      <h2>Home</h2>

      <label>Título ES</label>
      <input
        style={{ width: "100%", marginBottom: 10 }}
        value={texts.home_title_es}
        onChange={(e) =>
          setTexts({ ...texts, home_title_es: e.target.value })
        }
      />

      <label>Título EN</label>
      <input
        style={{ width: "100%", marginBottom: 10 }}
        value={texts.home_title_en}
        onChange={(e) =>
          setTexts({ ...texts, home_title_en: e.target.value })
        }
      />

      <label>Descripción ES</label>
      <textarea
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        value={texts.home_desc_es}
        onChange={(e) =>
          setTexts({ ...texts, home_desc_es: e.target.value })
        }
      />

      <label>Descripción EN</label>
      <textarea
        style={{ width: "100%", height: 100, marginBottom: 10 }}
        value={texts.home_desc_en}
        onChange={(e) =>
          setTexts({ ...texts, home_desc_en: e.target.value })
        }
      />

      <h2>Contacto</h2>

      <label>Título ES</label>
      <input
        style={{ width: "100%", marginBottom: 10 }}
        value={texts.contact_title_es}
        onChange={(e) =>
          setTexts({ ...texts, contact_title_es: e.target.value })
        }
      />

      <label>Título EN</label>
      <input
        style={{ width: "100%", marginBottom: 10 }}
        value={texts.contact_title_en}
        onChange={(e) =>
          setTexts({ ...texts, contact_title_en: e.target.value })
        }
      />

      <button
        onClick={saveAll}
        style={{
          marginTop: 20,
          padding: 12,
          background: "#0b3d91",
          color: "white",
          borderRadius: 6,
          border: "none",
        }}
      >
        Guardar Traducciones
      </button>
    </div>
  );
}
