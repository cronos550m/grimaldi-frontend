import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';

const authConfig = (token) => ({ headers: { Authorization: 'Bearer ' + token } });

export default function TestimoniosAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    author: '',
    text: { es: '', en: '' },
    position: '',
    image: '',
    active: true,
  });

  // referencia al input file para poder limpiarlo
  const fileInputRef = useRef(null);

  const load = () => {
    api
      .get('/testimonios')
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({
      author: '',
      text: { es: '', en: '' },
      position: '',
      image: '',
      active: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({
      author: it.author || '',
      text: {
        es: it.text_es || (it.text && it.text.es) || '',
        en: it.text_en || (it.text && it.text.en) || '',
      },
      position: it.position || '',
      image: it.image || '',
      active: it.active ?? true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    const payload = {
      author: form.author,
      text: form.text,
      position: form.position,
      image: form.image,
      active: !!form.active,
    };

    try {
      if (editing && editing.id) {
        await api.put('/testimonios/' + editing.id, payload, authConfig(token));
      } else {
        await api.post('/testimonios', payload, authConfig(token));
      }

      // después de guardar: reset form + limpiar file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      startNew();
      load();
    } catch (e) {
      alert('No se pudo guardar el testimonio');
    }
  };

  const del = async (it) => {
    if (!window.confirm('¿Eliminar este testimonio?')) return;
    try {
      await api.delete('/testimonios/' + it.id, authConfig(token));
      load();
    } catch (e) {
      alert('No se pudo borrar el testimonio');
    }
  };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/uploads', fd, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.url;
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      // no limpiamos el input acá para que el usuario vea que seleccionó algo;
      // lo limpiamos al guardar o al hacer "Nuevo"/"Editar"
    } catch (err) {
      alert('No se pudo subir la imagen');
    }
  };

  const resumen = (txt) => {
    if (!txt) return '';
    return txt.length > 90 ? txt.slice(0, 90) + '…' : txt;
  };

  return (
    <div>
      <h2>Testimonios</h2>
      <p>Gestioná los testimonios que se muestran en la web.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* LISTADO */}
        <div>
          <h3>Listado</h3>
          <button onClick={startNew} style={{ marginBottom: 10 }}>
            Nuevo
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((it) => (
              <div
                key={it.id}
                className="card"
                style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.author}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, fontSize: 13 }}>
                  <strong>{it.author}</strong>
                  {it.position && (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{it.position}</div>
                  )}
                  <div style={{ marginTop: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>ES: </span>
                      {resumen(it.text_es || (it.text && it.text.es))}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>EN: </span>
                      {resumen(it.text_en || (it.text && it.text.en))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => startEdit(it)}>Editar</button>
                  <button onClick={() => del(it)}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        <div>
          <h3>{editing ? 'Editar testimonio' : 'Nuevo testimonio'}</h3>

          <div
            className="card"
            style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <label>
              Autor
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Cargo / Empresa
              <input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Texto (ES)
              <textarea
                rows={3}
                value={form.text.es}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    text: { ...prev.text, es: e.target.value },
                  }))
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Texto (EN)
              <textarea
                rows={3}
                value={form.text.en}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    text: { ...prev.text, en: e.target.value },
                  }))
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>Imagen</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <input
                type="text"
                placeholder="URL de la imagen"
                value={form.image || ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                style={{ width: '100%', padding: 6 }}
              />
              <input type="file" ref={fileInputRef} onChange={onFileChange} />
              {form.image && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>Vista previa:</div>
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
              />{' '}
              Activo
            </label>

            <button onClick={save} style={{ marginTop: 8 }}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
