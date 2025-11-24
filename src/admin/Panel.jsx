import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import ServicesAdmin from "./ServicesAdmin";
import TestimoniosAdmin from "./TestimoniosAdmin";
import SettingsAdmin from "./SettingsAdmin";
import ContactsAdmin from "./ContactsAdmin";
import UploadWidget from "./UploadWidget";
import MessagesAdmin from "./MessagesAdmin";
import AboutAdmin from "./AboutAdmin"; // NUEVO

export default function AdminPanel({ token }) {
  const logout = () => {
    localStorage.removeItem("grimaldi_token");
    window.location.href = "/admin";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          background: "#0b3d91",
          color: "#fff",
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          {/* Logo + título Admin */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <img
              src="/logotransparente.png"
              alt="Grimaldi Log"
              style={{ height: 28, width: "auto" }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Admin
            </span>
          </div>

          {/* Menú de navegación */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 24,
            }}
          >
            <Link
              to="/admin/services"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Servicios
            </Link>

            {/* NUEVO: botón Nosotros */}
            <Link
              to="/admin/about"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Nosotros
            </Link>

            <Link
              to="/admin/testimonios"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Testimonios
            </Link>

            <Link
              to="/admin/settings"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Settings
            </Link>

            <Link
              to="/admin/contacts"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Contacto empresa
            </Link>

            <Link
              to="/admin/messages"
              style={{
                display: "block",
                padding: "6px 10px",
                borderRadius: 4,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Mensajes contacto
            </Link>

            {/* Botón de cerrar sesión */}
            <button
              type="button"
              onClick={logout}
              style={{
                marginTop: 16,
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #fff",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Panel de administración</h1>
                <p>Elegí una sección del menú de la izquierda.</p>
              </div>
            }
          />

          <Route
            path="services/*"
            element={<ServicesAdmin token={token} />}
          />

          {/* NUEVA RUTA: Nosotros */}
          <Route
            path="about/*"
            element={<AboutAdmin token={token} />}
          />

          <Route
            path="testimonios/*"
            element={<TestimoniosAdmin token={token} />}
          />
          <Route
            path="settings"
            element={<SettingsAdmin token={token} />}
          />
          <Route
            path="contacts"
            element={<ContactsAdmin token={token} />}
          />
          <Route
            path="messages"
            element={<MessagesAdmin token={token} />}
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
