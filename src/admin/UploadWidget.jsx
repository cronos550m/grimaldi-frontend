import React, { useState } from 'react';
import api from '../utils/api';

export default function UploadWidget({ token }){
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const upload = async (e) => {
    e.preventDefault();
    if(!file){ alert('Seleccioná un archivo'); return; }
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/uploads', fd, { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }});
    setUrl(res.data.url);
  };
  return (
    <div>
      <h2>Subir Imagen</h2>
      <form onSubmit={upload}>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {url && <div>Subido: <a href={url} target="_blank" rel="noreferrer">{url}</a></div>}
    </div>
  );
}
