import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";

const authConfig = (token) => ({ headers: { Authorization: "Bearer " + token } });

export default function ServicesAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: { es: "", en: "" },
    description: { es: "", en: "" },
    image: "",
    order: 0,
    active: true,
  });
  const fileInputRef = useRef(null);

  // Mensajes lindos (éxito / error)
  const [status, setStatus] = useState(null);
  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  };

  const load = () => {
    api
      .get("/services")
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      image: "",
      order: 0,
      active: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({
      title: {
        es: it.title_es || (it.title && it.title.es) || "",
        en: it.title_en || (it.title && it.title.en) || "",
      },
      description: {
        es: it.desc_es || (it.description && it.description.es) || "",
        en: it.desc_en || (it.description && it.description.en) || "",
      },
      image: it.image || "",
      order: it.order || 0,
      active: it.active ?? true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      order: Number(form.order) || 0,
      active: !!form.active,
    };

    try {
      if (editing && editing.id) {
        await api.put("/services/" + editing.id, payload, authConfig(token));
      } else {
        await api.post("/services", payload, authConfig(token));
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      startNew();
      load();
      showStatus("success", "Servicio guardado correctamente");
    } catch (e) {
      console.error(e);
      showStatus("error", "No se pudo guardar el servicio");
    }
  };

  const del = async (it) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    try {
      await api.delete("/services/" + it.id, authConfig(token));
      load();
      showStatus("success", "Servicio eliminado correctamente");
    } catch (e) {
      console.error(e);
      showStatus("error", "No se pudo borrar el servicio");
    }
  };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/uploads", fd, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.url;
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      showStatus("success", "Imagen subida correctamente");
    } catch (err) {
      console.error(err);
      showStatus("error", "No se pudo subir la imagen");
    }
  };

  const resumen = (txt) => {
    if (!txt) return "";
    return txt.length > 90 ? txt.slice(0, 90) + "…" : txt;
  };

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
          color: "#b91c1c",
        };

  return (
    <div>
      <h2>Servicios</h2>
      <p>Gestioná los servicios que se muestran en la web.</p>

      {status && (
        <div
          style={{
            marginTop: 8,
            marginBottom: 10,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 14,
            ...statusStyle,
          }}
        >
          {status.msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* LISTADO */}
        <div>
          <h3>Listado</h3>
          <button onClick={startNew} style={{ marginBottom: 10 }}>
            Nuevo
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((it) => (
              <div
                key={it.id}
                className="card"
                style={{
                  padding: 8,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.title_es || ""}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, fontSize: 13 }}>
                  <strong>{it.title_es}</strong>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                    Orden: {it.order} · {it.active ? "Activo" : "Inactivo"}
                  </div>
                  <div>
                    <div>
                      <span style={{ fontWeight: 600 }}>ES: </span>
                      {resumen(it.desc_es || (it.description && it.description.es))}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>EN: </span>
                      {resumen(it.desc_en || (it.description && it.description.en))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEdit(it)}>Editar</button>
                  <button onClick={() => del(it)}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        <div>
          <h3>{editing ? "Editar servicio" : "Nuevo servicio"}</h3>
          <div
            className="card"
            style={{
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <label>
              Título (ES)
              <input
                value={form.title.es}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: { ...prev.title, es: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </label>

            <label>
              Título (EN)
              <input
                value={form.title.en}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: { ...prev.title, en: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </label>

            <label>
              Descripción (ES)
              <textarea
                rows={3}
                value={form.description.es}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: { ...prev.description, es: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </label>

            <label>
              Descripción (EN)
              <textarea
                rows={3}
                value={form.description.en}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: { ...prev.description, en: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </label>

            <label>Imagen</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                type="text"
                placeholder="URL de la imagen"
                value={form.image || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                style={{ width: "100%", padding: 6 }}
              />
              <input type="file" ref={fileInputRef} onChange={onFileChange} />
              {form.image && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    Vista previa:
                  </div>
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      width: 140,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
            </div>

            <label>
              Orden
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, order: e.target.value }))
                }
                style={{ width: "100%" }}
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
              />{" "}
              Activo
            </label>

            <button onClick={save} style={{ marginTop: 8 }}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
