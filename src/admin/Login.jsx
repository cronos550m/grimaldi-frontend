import React, { useState } from "react";
import api from "../utils/api";

export default function AdminLogin({ onAuth }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", form);
      onAuth(res.data.token);
      window.location.href = "/admin";
    } catch (e) {
      console.error(e);
      setErr("Credenciales inválidas");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{ maxWidth: 360 }}>
        <input
          placeholder="Usuario"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, username: e.target.value }))
          }
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit">Login</button>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      </form>
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        Usuario por defecto: AdminGrimaldi / Grim2025*Admin
      </div>
    </div>
  );
}
