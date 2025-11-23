import React, { useState } from 'react';
import AdminLogin from './Login';
import AdminPanel from './Panel';

export default function AdminApp(){
  const [token, setToken] = useState(localStorage.getItem('grimaldi_token') || null);
  if (!token) return <AdminLogin onAuth={t=>{ setToken(t); localStorage.setItem('grimaldi_token', t); window.location.reload(); }} />;
  return <AdminPanel token={token} />;
}
