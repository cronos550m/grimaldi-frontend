import React, { useState } from 'react';
import api from '../utils/api';

export default function AdminLogin({ onAuth }){
  const [form, setForm] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      onAuth(res.data.token);
    } catch(e){ setErr('Credenciales inválidas'); }
  };
  return (
    <div style={{padding:40}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{maxWidth:360}}>
        <input placeholder='Usuario' value={form.username} onChange={e=>setForm({...form,username:e.target.value})} style={{width:'100%',padding:8,marginBottom:8}} />
        <input placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={{width:'100%',padding:8,marginBottom:8}} />
        <button type='submit'>Login</button>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
      <div style={{marginTop:12}}>Default admin: AdminGrimaldi / Grim2025*Admin (run backend seed)</div>
    </div>
  );
}
