import React, { useEffect, useState } from "react";
import api from "../utils/api";

const authConfig = (token) => ({ headers: { Authorization: "Bearer " + token } });

export default function MessagesAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // notification: { type: 'error' | 'success' | 'confirm-delete', message, onConfirm? }
  const [notification, setNotification] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contacto/messages", authConfig(token));
      setItems(res.data || []);
    } catch (err) {
      console.error("Error cargando mensajes de contacto", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Confirmación de borrado con modal lindo
  const del = (m) => {
    setNotification({
      type: "confirm-delete",
      message: "¿Seguro que querés eliminar este mensaje?",
      onConfirm: async () => {
        try {
          await api.delete("/contacto/messages/" + m.id, authConfig(token));
          await load();
          setNotification({
            type: "success",
            message: "Mensaje eliminado correctamente.",
          });
        } catch (err) {
          setNotification({
            type: "error",
            message: "No se pudo borrar el mensaje.",
          });
        }
      },
    });
  };

  // Normaliza teléfono para usar en wa.me (pensado para Argentina)
  const normalizePhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return "";

    let digits = String(rawPhone).replace(/\D/g, "");
    if (!digits) return "";

    if (digits.startsWith("54")) {
      return digits;
    }

    if (digits.length === 10 && digits.startsWith("11")) {
      return "54" + digits;
    }

    if (digits.length === 9 && digits.startsWith("15")) {
      return "54" + "11" + digits.slice(1);
    }

    if (digits.length === 10 && digits.startsWith("15")) {
      return "54" + "11" + digits.slice(2);
    }

    if (digits.length === 8) {
      return "5411" + digits;
    }

    return "54" + digits;
  };

  const contactByWhatsApp = (m) => {
    if (!m.phone) {
      setNotification({
        type: "error",
        message: "Este mensaje no tiene teléfono para WhatsApp.",
      });
      return;
    }

    const phoneE164 = normalizePhoneForWhatsApp(m.phone);
    if (!phoneE164) {
      setNotification({
        type: "error",
        message: "El teléfono no es válido para WhatsApp.",
      });
      return;
    }

    const text = `Hola ${m.name || ""}, recibimos tu mensaje desde la web:\n\n"${m.message || ""}"`;

    const url =
      "https://wa.me/" +
      phoneE164 +
      "?text=" +
      encodeURIComponent(text);

    window.open(url, "_blank");
  };

  // Copiar email del cliente al portapapeles, con cartel lindo
  const copyEmail = (m) => {
    if (!m.email) {
      setNotification({
        type: "error",
        message: "Este mensaje no tiene email para copiar.",
      });
      return;
    }

    const email = String(m.email).trim();
    if (!email) {
      setNotification({
        type: "error",
        message: "El email no es válido para copiar.",
      });
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          setNotification({
            type: "success",
            message: `Email copiado: ${email}`,
          });
        })
        .catch(() => {
          setNotification({
            type: "error",
            message:
              "No se pudo copiar automáticamente. Copiá este email: " + email,
          });
        });
    } else {
      setNotification({
        type: "error",
        message:
          "No se pudo copiar automáticamente. Copiá este email: " + email,
      });
    }
  };

  const resumen = (txt) => {
    if (!txt) return "";
    return txt.length > 120 ? txt.slice(0, 120) + "…" : txt;
  };

  const closeNotification = () => setNotification(null);

  const handleConfirm = async () => {
    if (notification && typeof notification.onConfirm === "function") {
      const fn = notification.onConfirm;
      setNotification(null);
      await fn();
    }
  };

  const isConfirm = notification?.type === "confirm-delete";

  // Estilo básico para botones
  const buttonStyle = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: 12,
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "#1976d2",
    color: "#fff",
    border: "1px solid #1565c0",
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: "#e53935",
    color: "#fff",
    border: "1px solid #c62828",
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: 4 }}>
        Mensajes de contacto
      </h2>
      <p style={{ textAlign: "center", marginBottom: 16, fontSize: 14 }}>
        Mensajes enviados desde el formulario de contacto de la web.
      </p>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <button
          onClick={load}
          style={{ ...buttonStyle, padding: "6px 16px" }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {items.length === 0 && !loading && (
        <p style={{ textAlign: "center" }}>No hay mensajes aún.</p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
              borderRadius: 10,
              border: "1px solid #e0e0e0",
              background: "#fafafa",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <strong style={{ fontSize: 14 }}>
                {m.name || "(Sin nombre)"}
              </strong>
              {m.email && (
                <div style={{ fontSize: 12, opacity: 0.8 }}>{m.email}</div>
              )}
              {m.phone && (
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Tel: {m.phone}
                </div>
              )}
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                {m.createdAt &&
                  new Date(m.createdAt).toLocaleString("es-AR")}
              </div>
            </div>

            <div
              style={{
                marginTop: 4,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontWeight: 600 }}>Mensaje: </span>
              {resumen(m.message)}
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => copyEmail(m)}
                style={buttonStyle}
              >
                Copiar mail
              </button>
              <button
                onClick={() => contactByWhatsApp(m)}
                style={primaryButtonStyle}
              >
                WhatsApp
              </button>
              <button
                onClick={() => del(m)}
                style={dangerButtonStyle}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cartel lindo centrado (notificaciones + confirm) */}
      {notification && (
        <div
          onClick={closeNotification}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              minWidth: 280,
              maxWidth: 400,
              background: "#ffffff",
              borderRadius: 8,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: 10,
                fontWeight: 600,
                color: isConfirm
                  ? "#f39c12"
                  : notification.type === "error"
                  ? "#c0392b"
                  : "#27ae60",
              }}
            >
              {isConfirm
                ? "Confirmar"
                : notification.type === "error"
                ? "Atención"
                : "Listo"}
            </div>
            <div style={{ fontSize: 14, marginBottom: 16 }}>
              {notification.message}
            </div>

            {isConfirm ? (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={closeNotification}
                  style={buttonStyle}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  style={dangerButtonStyle}
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <button
                onClick={closeNotification}
                style={buttonStyle}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
