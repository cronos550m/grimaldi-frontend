import React, { useEffect, useState } from "react";
import api from "../utils/api";

const authConfig = (token) => ({
  headers: { Authorization: "Bearer " + token },
});

export default function ContactsAdmin({ token }) {
  const [data, setData] = useState({
    company: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    mapUrl: "",
    qrImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQR, setUploadingQR] = useState(false);

  // Mensajes lindos (éxito / error)
  const [status, setStatus] = useState(null);
  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  };

  useEffect(() => {
    api
      .get("/contacto")
      .then((r) => {
        const c = r.data || {};
        setData({
          company: c.company || "",
          email: c.email || "",
          phone: c.phone || "",
          whatsapp: c.whatsapp || "",
          address: c.address || "",
          mapUrl: c.mapUrl || "",
          qrImage: c.qrImage || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadQrImage = async (file) => {
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

  const onQrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingQR(true);
      const url = await uploadQrImage(file);
      setData((prev) => ({ ...prev, qrImage: url }));
      showStatus("success", "Imagen QR subida correctamente");
    } catch (err) {
      console.error(err);
      showStatus("error", "No se pudo subir la imagen QR");
    } finally {
      setUploadingQR(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.post(
        "/contacto",
        {
          company: data.company || "",
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          address: data.address || "",
          mapUrl: data.mapUrl || "",
          qrImage: data.qrImage || "",
        },
        authConfig(token)
      );
      showStatus("success", "Datos de contacto guardados correctamente");
    } catch (err) {
      console.error(err);
      showStatus("error", "No se pudieron guardar los datos de contacto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando datos de contacto...</div>;
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
          color: "#b91c1c",
        };

  return (
    <div>
      <h2>Datos de contacto de la empresa</h2>
      <p>
        Estos datos se usarán en la sección pública{" "}
        <strong>"Dónde estamos"</strong> y, en parte, en el formulario de
        contacto.
      </p>

      {status && (
        <div
          style={{
            marginTop: 10,
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

      <div
        style={{
          maxWidth: 720,
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Nombre de la empresa
          <input
            value={data.company}
            onChange={handleChange("company")}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Email
          <input
            value={data.email}
            onChange={handleChange("email")}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            Teléfono
            <input
              value={data.phone}
              onChange={handleChange("phone")}
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #cbd5e1",
              }}
            />
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            WhatsApp
            <input
              value={data.whatsapp}
              onChange={handleChange("whatsapp")}
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #cbd5e1",
              }}
            />
          </label>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Dirección
          <textarea
            rows={2}
            value={data.address}
            onChange={handleChange("address")}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              resize: "vertical",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          URL de mapa (Google Maps embed)
          <input
            value={data.mapUrl}
            onChange={handleChange("mapUrl")}
            placeholder="Pegá acá el src del iframe de Google Maps (opcional)"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1" }}
          />
        </label>

        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: "1px dashed #cbd5e1",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            Imagen QR (opcional)
            <input type="file" accept="image/*" onChange={onQrFileChange} />
            {uploadingQR && (
              <span style={{ fontSize: 12 }}>Subiendo imagen QR...</span>
            )}
          </label>

          {data.qrImage && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Vista previa:</div>
              <img
                src={data.qrImage}
                alt="QR contacto"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "contain",
                  background: "#020617",
                  borderRadius: 12,
                  padding: 6,
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary"
            style={{ minWidth: 140 }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
