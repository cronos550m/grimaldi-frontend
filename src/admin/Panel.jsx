import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import ServicesAdmin from "./ServicesAdmin";
import TestimoniosAdmin from "./TestimoniosAdmin";
import SettingsAdmin from "./SettingsAdmin";
import ContactsAdmin from "./ContactsAdmin";
import MessagesAdmin from "./MessagesAdmin";
import AboutAdmin from "./AboutAdmin";
import ProfileAdmin from "./ProfileAdmin";

export default function AdminPanel({ token }) {
  const logout = () => {
    localStorage.removeItem("grimaldi_token");
    window.location.href = "/admin";
  };

  const linkStyle = (active) => ({
    display: "block",
    padding: "8px 10px",
    borderRadius: 6,
    marginBottom: 4,
    textDecoration: "none",
    fontSize: 14,
    background: active ? "rgba(15,23,42,0.85)" : "transparent",
    color: "white",
    border: active ? "1px solid rgba(148,163,184,0.8)" : "none",
  });

  const [pathname, setPathname] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const isActive = (path) => pathname.startsWith(path);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          background: "linear-gradient(180deg,#0b3d91,#1e293b)",
          color: "white",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Admin Grimaldi</h2>

        <nav style={{ flex: 1 }}>
          <Link
            to="/admin/services"
            style={linkStyle(isActive("/admin/services"))}
          >
            Servicios
          </Link>
          <Link
            to="/admin/flota"
            style={linkStyle(isActive("/admin/flota"))}
          >
            Flota
          </Link>
          <Link
            to="/admin/testimonios"
            style={linkStyle(isActive("/admin/testimonios"))}
          >
            Testimonios
          </Link>
          <Link
            to="/admin/settings"
            style={linkStyle(isActive("/admin/settings"))}
          >
            Settings
          </Link>
          <Link
            to="/admin/about"
            style={linkStyle(isActive("/admin/about"))}
          >
            Nosotros
          </Link>
          <Link
            to="/admin/contacts"
            style={linkStyle(isActive("/admin/contacts"))}
          >
            Contacto
          </Link>
          <Link
            to="/admin/messages"
            style={linkStyle(isActive("/admin/messages"))}
          >
            Mensajes contacto
          </Link>
          <Link
            to="/admin/profile"
            style={linkStyle(isActive("/admin/profile"))}
          >
            Perfil
          </Link>
        </nav>

        <button
          type="button"
          onClick={logout}
          style={{
            marginTop: 16,
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #fff",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/services" replace />}
          />
          <Route
            path="/services"
            element={<ServicesAdmin token={token} />}
          />
          <Route
            path="/testimonios"
            element={<TestimoniosAdmin token={token} />}
          />
          <Route
            path="/settings"
            element={<SettingsAdmin token={token} />}
          />
          <Route
            path="/about"
            element={<AboutAdmin token={token} />}
          />
          <Route
            path="/contacts"
            element={<ContactsAdmin token={token} />}
          />
          <Route
            path="/messages"
            element={<MessagesAdmin token={token} />}
          />
          <Route
            path="/profile"
            element={<ProfileAdmin token={token} />}
          />
          <Route
            path="*"
            element={<Navigate to="/admin/services" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
