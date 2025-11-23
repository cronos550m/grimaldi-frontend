import React from 'react';
export default function Footer(){
  return (
    <footer style={{padding:20,background:'#f5f7fa',marginTop:40}}>
      <div className='container' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>© {new Date().getFullYear()} Grimaldi</div>
        <div>Contacto: info@grimaldi.example</div>
      </div>
    </footer>
  );
}
