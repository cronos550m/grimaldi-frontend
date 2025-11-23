import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './pages/admin';
import './styles/global.css';
import "./styles/landing.css";

import { LanguageProvider } from "./context/language";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
