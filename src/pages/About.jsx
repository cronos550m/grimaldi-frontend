import React, { useContext } from 'react';
import { LanguageContext } from '../context/language';

export default function About() {
  const { lang, texts } = useContext(LanguageContext);
  const aboutTitle =
    texts.about?.title || (lang === 'es' ? 'Sobre Grimaldi Log' : 'About Grimaldi Log');
  const aboutDesc =
    texts.about?.desc ||
    (lang === 'es'
      ? 'Somos una empresa especializada en transporte de carga refrigerada y contenedores, con foco en exportaciones desde Argentina.'
      : 'We are a company specialized in refrigerated cargo and container transport, focused on exports from Argentina.');
  const aboutImage = texts.about?.image;

  return (
    <div className="section-landing">
      <div
        className="section-inner"
        style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2 className="section-title">{aboutTitle}</h2>
          <p className="section-subtitle">{aboutDesc}</p>
        </div>

        {aboutImage && (
          <div style={{ flex: 1, minWidth: 260 }}>
            <img
              src={aboutImage}
              alt={lang === 'es' ? 'Sobre Grimaldi Log' : 'About Grimaldi Log'}
              style={{
                width: '100%',
                display: 'block',
                borderRadius: 24,
                objectFit: 'cover',
                boxShadow: '0 18px 50px rgba(15,23,42,0.18)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
