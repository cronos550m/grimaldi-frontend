import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function SettingsAdmin({ token }) {
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState({
    home_hero_image: "",
    home_hero_image_mobile: "", // mobile
    navbar_theme: "blue",
    show_hero_tag: false,
  });

  const [uploadHeroLoading, setUploadHeroLoading] = useState(false);

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/settings");
        const data = res.data || {};
        setLocal({
          home_hero_image: data.home_hero_image || "",
          home_hero_image_mobile: data.home_hero_image_mobile || "",
          navbar_theme: data.navbar_theme || "blue",
          show_hero_tag:
            data.show_hero_tag === true || data.show_hero_tag === "true",
        });
      } catch (e) {
        console.error("Error cargando settings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveAll = async () => {
    setLoading(true);
    try {
      const cfg = authConfig();

      await api.post(
        "/settings/home_hero_image",
        { value: local.home_hero_image },
        cfg
      );

      // guardar imagen hero mobile
      await api.post(
        "/settings/home_hero_image_mobile",
        { value: local.home_hero_image_mobile },
        cfg
      );

      await api.post(
        "/settings/navbar_theme",
        { value: local.navbar_theme },
        cfg
      );

      await api.post(
        "/settings/show_hero_tag",
        { value: local.show_hero_tag },
        cfg
      );

      alert("Settings guardados correctamente");
    } catch (e) {
      console.error("Error guardando settings", e);
      alert("Error al guardar settings");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, field = "home_hero_image") => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    setUploadHeroLoading(true);

    try {
      const res = await api.post("/uploads", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data?.url || "";
      if (!url) {
        alert("No se recibió la URL del archivo");
        return;
      }

      setLocal((prev) => ({ ...prev, [field]: url }));
    } catch (e) {
      console.error("Error subiendo imagen", e);
      alert("Error subiendo imagen");
    } finally {
      setUploadHeroLoading(false);
    }
  };

  const navbarThemes = [
    { value: "blue", label: "Azul corporativo" },
    { value: "dark", label: "Oscuro" },
    { value: "navy", label: "Azul noche" },
    { value: "green", label: "Verde" },
    { value: "orange", label: "Naranja" },
  ];

  const renderNavbarPreview = (value) => {
    const baseStyle = {
      width: "100%",
      height: 32,
      borderRadius: 999,
      marginTop: 8,
      border: "1px solid rgba(148,163,184,0.6)",
    };

    const gradients = {
      blue: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      dark: "linear-gradient(135deg, #020617, #111827)",
      navy: "linear-gradient(135deg, #0b1f4b, #1e293b)",
      green: "linear-gradient(135deg, #16a34a, #15803d)",
      orange: "linear-gradient(135deg, #f97316, #ea580c)",
    };

    return {
      ...baseStyle,
      backgroundImage: gradients[value] || gradients.blue,
    };
  };

  if (loading) {
    return <div>Cargando settings...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Settings del sitio</h2>

      <h3 style={{ marginTop: 30 }}>Imagen del Hero</h3>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Configurá las imágenes del hero para versión desktop y versión mobile.
        Las URLs se completan automáticamente al subir los archivos, pero podés
        pegarlas a mano si ya las tenés.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {/* Hero desktop */}
        <div style={{ marginBottom: 8 }}>
          <h4 style={{ marginBottom: 4 }}>Versión desktop</h4>
          <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            Idealmente una imagen horizontal (por ejemplo 1920×1080).
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
              onChange={(e) =>
                uploadImage(e.target.files?.[0], "home_hero_image")
              }
            />
            {uploadHeroLoading && <span>Subiendo...</span>}
          </div>

          <input
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
            placeholder="URL de la imagen del hero (desktop)"
            value={local.home_hero_image}
            onChange={(e) =>
              setLocal({ ...local, home_hero_image: e.target.value })
            }
          />

          {local.home_hero_image && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={local.home_hero_image}
                alt="Hero desktop preview"
                style={{
                  maxWidth: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {/* Hero mobile */}
        <div style={{ marginBottom: 8 }}>
          <h4 style={{ marginBottom: 4 }}>Versión mobile</h4>
          <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            Esta imagen se usará en la versión mobile (pantallas chicas). Lo
            ideal es una imagen vertical (por ejemplo 1080×1920). Si la dejás
            vacía, se usará la imagen de desktop.
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
              onChange={(e) =>
                uploadImage(
                  e.target.files?.[0],
                  "home_hero_image_mobile"
                )
              }
            />
            {uploadHeroLoading && <span>Subiendo...</span>}
          </div>

          <input
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
            placeholder="URL de la imagen del hero (mobile)"
            value={local.home_hero_image_mobile}
            onChange={(e) =>
              setLocal({
                ...local,
                home_hero_image_mobile: e.target.value,
              })
            }
          />

          {local.home_hero_image_mobile && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={local.home_hero_image_mobile}
                alt="Hero mobile preview"
                style={{
                  width: 160,
                  height: 260,
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: 30 }}>Color del Navbar</h3>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Elegí un color con degradé para el fondo del menú superior.
      </p>
      <select
        style={{ width: "100%", padding: 8, marginTop: 4 }}
        value={local.navbar_theme}
        onChange={(e) =>
          setLocal({ ...local, navbar_theme: e.target.value })
        }
      >
        {navbarThemes.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div style={renderNavbarPreview(local.navbar_theme)} />

      <h3 style={{ marginTop: 30 }}>Etiqueta superior del hero</h3>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
        }}
      >
        <input
          type="checkbox"
          checked={local.show_hero_tag}
          onChange={(e) =>
            setLocal({ ...local, show_hero_tag: e.target.checked })
          }
        />
        Mostrar la etiqueta
        {" “GRIMALDI LOG • Transporte y logística nacional e internacional”"}
      </label>

      <button
        onClick={saveAll}
        style={{
          marginTop: 24,
          padding: 10,
          background: "#0b3d91",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Guardar settings
      </button>
    </div>
  );
}
