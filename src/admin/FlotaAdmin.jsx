import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';

const authConfig = (token) => ({ headers: { Authorization: 'Bearer ' + token } });

export default function FlotaAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: { es: '', en: '' },
    description: { es: '', en: '' },
    image: '',
    capacity: '',
    active: true,
  });

  const fileInputRef = useRef(null);

  const load = () => {
    api
      .get('/flota')
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({
      name: { es: '', en: '' },
      description: { es: '', en: '' },
      image: '',
      capacity: '',
      active: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({
      name: {
        es: it.name_es || (it.name && it.name.es) || '',
        en: it.name_en || (it.name && it.name.en) || '',
      },
      description: {
        es: it.desc_es || (it.description && it.description.es) || '',
        en: it.desc_en || (it.description && it.description.en) || '',
      },
      image: it.image || '',
      capacity: it.capacity || '',
      active: it.active ?? true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      capacity: form.capacity,
      active: !!form.active,
    };

    try {
      if (editing && editing.id) {
        await api.put('/flota/' + editing.id, payload, authConfig(token));
      } else {
        await api.post('/flota', payload, authConfig(token));
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      startNew();
      load();
    } catch (e) {
      alert('No se pudo guardar el vehículo');
    }
  };

  const del = async (it) => {
    if (!window.confirm('¿Eliminar este vehículo de flota?')) return;
    try {
      await api.delete('/flota/' + it.id, authConfig(token));
      load();
    } catch (e) {
      alert('No se pudo borrar el vehículo');
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
      <h2>Flota</h2>
      <p>Gestioná los vehículos que se muestran en la sección de flota.</p>

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
                style={{
                  padding: 8,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name_es || ''}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, fontSize: 13 }}>
                  <strong>{it.name_es}</strong>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                    {it.capacity && `Capacidad: ${it.capacity} · `}
                    {it.active ? 'Activo' : 'Inactivo'}
                  </div>
                  <div>
                    <div>
                      <span style={{ fontWeight: 600 }}>ES: </span>
                      {resumen(it.desc_es || (it.description && it.description.es))}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>EN: </span>
                      {resumen(it.desc_en || (it.description && it.description.en))}
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
          <h3>{editing ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
          <div
            className="card"
            style={{
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <label>
              Nombre (ES)
              <input
                value={form.name.es}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: { ...prev.name, es: e.target.value },
                  }))
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Nombre (EN)
              <input
                value={form.name.en}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: { ...prev.name, en: e.target.value },
                  }))
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Descripción (ES)
              <textarea
                rows={3}
                value={form.description.es}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: { ...prev.description, es: e.target.value },
                  }))
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>
              Descripción (EN)
              <textarea
                rows={3}
                value={form.description.en}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: { ...prev.description, en: e.target.value },
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
                      width: 160,
                      height: 110,
                      objectFit: 'cover',
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}
            </div>

            <label>
              Capacidad
              <input
                value={form.capacity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, capacity: e.target.value }))
                }
                style={{ width: '100%' }}
              />
            </label>

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
