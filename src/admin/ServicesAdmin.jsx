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
    image_mobile: "",
    order: 0,
    active: true,
  });

  const fileInputRef = useRef(null);
  const fileInputMobileRef = useRef(null);

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

  const resetFileInputs = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (fileInputMobileRef.current) fileInputMobileRef.current.value = "";
  };

  const startNew = () => {
    setEditing(null);
    setForm({
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      image: "",
      image_mobile: "",
      order: 0,
      active: true,
    });
    resetFileInputs();
  };

  const startEdit = (it) => {
    // fuente de imagen principal y mobile desde lo que venga del backend
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
      image: baseImage || "",
      image_mobile: baseImageMobile || "",
      order: it.order || 0,
      active: it.active ?? true,
    });
    resetFileInputs();
  };

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      image_mobile: form.image_mobile,
      order: Number(form.order) || 0,
      active: !!form.active,
    };

    try {
      const cfg = authConfig(token);
      const id = editing && (editing.id || editing._id);

      if (id) {
        await api.put("/services/" + id, payload, cfg);
      } else {
        await api.post("/services", payload, cfg);
      }

      resetFileInputs();
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
      const cfg = authConfig(token);
      const id = it.id || it._id;
      await api.delete("/services/" + id, cfg);
      load();
      showStatus("success", "Servicio eliminado correctamente");
    } catch (e) {
      console.error(e);
      showStatus("error", "No se pudo borrar el servicio");
    }
  };

  // subir imagen (desktop o mobile) al mismo endpoint
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/uploads", fd, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    const data = res.data || {};
    // intenta tomar url o path, lo que venga
    const url = data.url || data.path || data.Location || data.location || "";
    if (!url) {
      throw new Error("No se recibió URL de la imagen");
    }
    return url;
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

  // subida de imagen mobile
  const onFileChangeMobile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image_mobile: url }));
      showStatus("success", "Imagen mobile subida correctamente");
    } catch (err) {
      console.error(err);
      showStatus("error", "No se pudo subir la imagen mobile");
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
            {items.map((it) => {
              const thumb =
                it.image ||
                it.image_mobile ||
                it.image_url ||
                it.url ||
                it.path ||
                (it.media && it.media.image);

              return (
                <div
                  key={it.id || it._id}
                  className="card"
                  style={{
                    padding: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={it.title_es || (it.title && it.title.es) || ""}
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
                    <strong>
                      {it.title_es || (it.title && it.title.es) || "Sin título"}
                    </strong>
                    <div
                      style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}
                    >
                      Orden: {it.order} · {it.active ? "Activo" : "Inactivo"}
                    </div>
                    <div>
                      <div>
                        <span style={{ fontWeight: 600 }}>ES: </span>
                        {resumen(
                          it.desc_es ||
                            (it.description && it.description.es)
                        )}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>EN: </span>
                        {resumen(
                          it.desc_en ||
                            (it.description && it.description.en)
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <button onClick={() => startEdit(it)}>Editar</button>
                    <button onClick={() => del(it)}>Borrar</button>
                  </div>
                </div>
              );
            })}
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
                    description: {
                      ...prev.description,
                      es: e.target.value,
                    },
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
                    description: {
                      ...prev.description,
                      en: e.target.value,
                    },
                  }))
                }
                style={{ width: "100%" }}
              />
            </label>

            {/* Imagen desktop */}
            <label>Imagen (desktop)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                type="text"
                placeholder="URL de la imagen desktop"
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
                    Vista previa desktop:
                  </div>
                  <img
                    src={form.image}
                    alt="preview desktop"
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

            {/* Imagen mobile */}
            <label style={{ marginTop: 8 }}>Imagen (mobile)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                type="text"
                placeholder="URL de la imagen mobile (vertical)"
                value={form.image_mobile || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image_mobile: e.target.value,
                  }))
                }
                style={{ width: "100%", padding: 6 }}
              />
              <input
                type="file"
                ref={fileInputMobileRef}
                onChange={onFileChangeMobile}
              />
              {form.image_mobile && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    Vista previa mobile:
                  </div>
                  <img
                    src={form.image_mobile}
                    alt="preview mobile"
                    style={{
                      width: 100,
                      height: 160,
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
