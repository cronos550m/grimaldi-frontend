import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { LanguageContext } from '../context/language';

export default function Testimonios() {
  const { lang } = useContext(LanguageContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get('/testimonios')
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="container">
      <h2>{lang === 'es' ? 'Testimonios' : 'Testimonials'}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {items.map((t) => (
          <div className="card" key={t.id || t._id}>
            {t.image && (
              <img
                src={t.image}
                alt={t.author || 'Testimonio'}
                style={{
                  width: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
            )}

            <p style={{ fontStyle: 'italic', minHeight: 80 }}>
              “
              {(lang === 'es' ? t.text_es : t.text_en) ||
                t.text_es ||
                ''}
              ”
            </p>

            <div style={{ marginTop: 8 }}>
              <strong>{t.author}</strong>
              {t.position && (
                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  {t.position}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
