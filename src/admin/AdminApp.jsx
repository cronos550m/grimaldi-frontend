import React, { useState } from "react";
import AdminLogin from "./Login";
import AdminPanel from "./Panel";

export default function AdminApp() {
  const [token, setToken] = useState(
    localStorage.getItem("grimaldi_token") || null
  );

  const handleAuth = (t) => {
    setToken(t);
    localStorage.setItem("grimaldi_token", t);
  };

  if (!token) {
    return <AdminLogin onAuth={handleAuth} />;
  }

  return <AdminPanel token={token} />;
}
