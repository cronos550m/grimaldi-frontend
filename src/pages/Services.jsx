import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { LanguageContext } from '../context/language';
export default function Services(){
  const [items, setItems] = useState([]);
  const { lang } = useContext(LanguageContext);
  useEffect(()=> { api.get('/services').then(r=>setItems(r.data)).catch(()=>{}); }, []);
  return (
    <div className='container'>
      <h2>Servicios</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
        {items.map(it=>(
          <div className='card' key={it._id}>
            <img src={it.image || '/placeholder.png'} style={{width:'100%',height:140,objectFit:'cover',borderRadius:6}}/>
            <h3>{it.title?.[lang] || it.title?.es}</h3>
            <p>{it.description?.[lang] || it.description?.es}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
