import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AboutAdmin({ token }) {
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState({
    about_title_es: "",
    about_desc_es: "",
    about_title_en: "",
    about_desc_en: "",
    about_image: "",
  });

  const [uploadAboutLoading, setUploadAboutLoading] = useState(false);

  // Mensajes en pantalla (éxito / error)
  const [status, setStatus] = useState(null);
  // status = { type: 'success' | 'error', message: string }

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};
        setLocal({
          about_title_es: data.about_title_es || "",
          about_desc_es: data.about_desc_es || "",
          about_title_en: data.about_title_en || "",
          about_desc_en: data.about_desc_en || "",
          about_image: data.about_image || "",
        });
      } catch (e) {
        console.error("Error cargando settings de Nosotros", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveAll = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const cfg = authConfig();

      await api.post(
        "/settings/about_title_es",
        { value: local.about_title_es },
        cfg
      );
      await api.post(
        "/settings/about_desc_es",
        { value: local.about_desc_es },
        cfg
      );
      await api.post(
        "/settings/about_title_en",
        { value: local.about_title_en },
        cfg
      );
      await api.post(
        "/settings/about_desc_en",
        { value: local.about_desc_en },
        cfg
      );

      await api.post(
        "/settings/about_image",
        { value: local.about_image },
        cfg
      );

      setStatus({
        type: "success",
        message: 'Sección "Nosotros" guardada correctamente.',
      });
    } catch (e) {
      console.error("Error guardando Nosotros", e);
      setStatus({
        type: "error",
        message:
          'Hubo un error al guardar la sección "Nosotros". Probá de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    setUploadAboutLoading(true);
    setStatus(null);

    try {
      const res = await api.post("/uploads", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data?.url || "";
      if (!url) {
        setStatus({
          type: "error",
          message: "No se recibió la URL del archivo subido.",
        });
        return;
      }

      setLocal((prev) => ({ ...prev, about_image: url }));
      setStatus({
        type: "success",
        message: "Imagen subida correctamente.",
      });
    } catch (e) {
      console.error("Error subiendo imagen", e);
      setStatus({
        type: "error",
        message: "Error subiendo la imagen. Probá de nuevo.",
      });
    } finally {
      setUploadAboutLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando sección "Nosotros"...</div>;
  }

  const statusStyle =
    status?.type === "success"
      ? {
          background: "#ecfdf3",
          border: "1px solid #22c55e55",
          color: "#166534",
        }
      : {
          background: "#fef2f2",
          border: "1px solid #ef444455",
          color: "#991b1b",
        };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Sección "Nosotros"</h2>
      <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
        Desde acá podés editar el título, la descripción y la imagen de la
        sección “Quiénes somos” que aparece en la web.
      </p>

      {status && (
        <div
          style={{
            ...statusStyle,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {status.message}
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>Texto (ES)</h3>
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder='Título ES (por ejemplo: "Quiénes somos")'
        value={local.about_title_es}
        onChange={(e) =>
          setLocal({ ...local, about_title_es: e.target.value })
        }
      />
      <textarea
        style={{ width: "100%", padding: 8, minHeight: 80, marginBottom: 8 }}
        placeholder="Descripción ES"
        value={local.about_desc_es}
        onChange={(e) =>
          setLocal({ ...local, about_desc_es: e.target.value })
        }
      />

      <h3 style={{ marginTop: 20 }}>Texto (EN)</h3>
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder='Title EN (por ejemplo: "Who we are")'
        value={local.about_title_en}
        onChange={(e) =>
          setLocal({ ...local, about_title_en: e.target.value })
        }
      />
      <textarea
        style={{ width: "100%", padding: 8, minHeight: 80, marginBottom: 8 }}
        placeholder="Description EN"
        value={local.about_desc_en}
        onChange={(e) =>
          setLocal({ ...local, about_desc_en: e.target.value })
        }
      />

      <h3 style={{ marginTop: 30 }}>Imagen de la sección "Nosotros"</h3>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Subí la imagen o pegá la URL manualmente. Es la foto que aparece al
        lado del texto de “Quiénes somos”.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files?.[0])}
        />
        {uploadAboutLoading && <span>Subiendo...</span>}
      </div>
      <input
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        placeholder="URL de la imagen de Nosotros"
        value={local.about_image}
        onChange={(e) =>
          setLocal({ ...local, about_image: e.target.value })
        }
      />
      {local.about_image && (
        <div style={{ marginBottom: 16 }}>
          <img
            src={local.about_image}
            alt="About preview"
            style={{ maxWidth: "100%", borderRadius: 12 }}
          />
        </div>
      )}

      <button
        onClick={saveAll}
        style={{
          marginTop: 24,
          padding: "10px 18px",
          background: "linear-gradient(135deg, #0b3d91, #2563eb)",
          color: "white",
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Guardar sección "Nosotros"
      </button>
    </div>
  );
}
