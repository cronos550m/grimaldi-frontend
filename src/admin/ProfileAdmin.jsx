
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function ProfileAdmin({ token }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null); // { type, msg }
  const [sendingCode, setSendingCode] = useState(false);
  const [changing, setChanging] = useState(false);

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/profile/me", authConfig());
        setProfile(res.data || { username: "", email: "" });
      } catch (e) {
        console.error(e);
        setStatus({ type: "error", msg: "No se pudo cargar el perfil" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  };

  const sendCode = async () => {
    if (!profile.email) {
      showStatus("error", "Ingresá un email primero");
      return;
    }
    setSendingCode(true);
    try {
      await api.post(
        "/profile/send-code",
        { email: profile.email },
        authConfig()
      );
      showStatus(
        "success",
        "Código enviado al email. Revisá tu bandeja de entrada."
      );
    } catch (e) {
      console.error(e);
      showStatus("error", "No se pudo enviar el código");
    } finally {
      setSendingCode(false);
    }
  };

  const changePassword = async () => {
    if (!code || !newPassword) {
      showStatus(
        "error",
        "Completá el código y la nueva contraseña antes de guardar"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showStatus("error", "Las contraseñas no coinciden");
      return;
    }
    setChanging(true);
    try {
      await api.post(
        "/profile/change-password",
        {
          email: profile.email,
          code,
          newPassword,
        },
        authConfig()
      );
      showStatus(
        "success",
        "Contraseña cambiada correctamente. Usá la nueva en el próximo login."
      );
      setNewPassword("");
      setConfirmPassword("");
      setCode("");
    } catch (e) {
      console.error(e);
      const msg =
        e.response?.data?.error || "No se pudo cambiar la contraseña";
      showStatus("error", msg);
    } finally {
      setChanging(false);
    }
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

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h2>Perfil</h2>
      <p style={{ fontSize: 13, opacity: 0.8 }}>
        Desde acá podés actualizar el email asociado al admin y cambiar la
        contraseña con un código de verificación enviado por mail.
      </p>

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

      <div
        className="card"
        style={{
          marginTop: 16,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 480,
        }}
      >
        <label>
          Usuario
          <input
            value={profile.username}
            disabled
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              background: "#e5e7eb",
              borderRadius: 4,
              border: "1px solid #cbd5f5",
            }}
          />
        </label>

        <label>
          Email
          <input
            value={profile.email}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="tu-email@ejemplo.com"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="button"
          onClick={sendCode}
          disabled={sendingCode}
          style={{
            marginTop: 4,
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#0b3d91",
            color: "white",
            cursor: "pointer",
          }}
        >
          {sendingCode ? "Enviando código..." : "Enviar código al email"}
        </button>

        <hr style={{ margin: "16px 0" }} />

        <label>
          Código recibido por email
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej: 123456"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          Nueva contraseña
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          Repetir nueva contraseña
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="button"
          onClick={changePassword}
          disabled={changing}
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, #0b3d91, #2563eb)",
            color: "white",
            cursor: "pointer",
          }}
        >
          {changing ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
}
