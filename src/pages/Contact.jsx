import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { LanguageContext } from '../context/language';

export default function Contact() {
  const { lang, texts } = useContext(LanguageContext);

  const [form, setForm] = useState({ name:'', email:'', message:'', phone:'' });
  const [ok, setOk] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setOk(false);
    try {
      await api.post('/contacto/message', form);
      setOk(true);
      setForm({ name: '', email: '', message: '', phone: '' });
    } catch (err) {
      console.error('Error enviando mensaje de contacto', err);
      alert('No se pudo enviar el mensaje. Intentá nuevamente.');
    }
  };
  

  return (
    <div className='container'>
      <h2>{texts?.contact_title?.[lang] || (lang === 'es' ? 'Contacto' : 'Contact')}</h2>

      {ok ? (
        <div className='card'>
          {texts?.contact_success?.[lang] || 
            (lang === 'es' ? 'Mensaje enviado. Gracias.' : 'Message sent. Thank you.')
          }
        </div>
      ) : (
        <form onSubmit={submit} style={{maxWidth:600}}>

          <input
            placeholder={texts?.contact_name?.[lang] || (lang === 'es' ? 'Nombre' : 'Name')}
            value={form.name}
            onChange={e=>setForm({...form, name:e.target.value})}
            style={{width:'100%',padding:8,marginBottom:8}}
          />

          <input
            placeholder={texts?.contact_email?.[lang] || (lang === 'es' ? 'Email' : 'Email')}
            value={form.email}
            onChange={e=>setForm({...form, email:e.target.value})}
            style={{width:'100%',padding:8,marginBottom:8}}
          />

          <input
            placeholder={texts?.contact_phone?.[lang] || (lang === 'es' ? 'Teléfono' : 'Phone')}
            value={form.phone}
            onChange={e=>setForm({...form, phone:e.target.value})}
            style={{width:'100%',padding:8,marginBottom:8}}
          />

          <textarea
            placeholder={texts?.contact_message?.[lang] || (lang === 'es' ? 'Mensaje' : 'Message')}
            value={form.message}
            onChange={e=>setForm({...form, message:e.target.value})}
            style={{width:'100%',padding:8,marginBottom:8}}
          />

          <button type='submit'>
            {texts?.contact_send?.[lang] || (lang === 'es' ? 'Enviar' : 'Send')}
          </button>

        </form>
      )}
    </div>
  );
}
