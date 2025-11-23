// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Flota from './pages/Flota';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './context/language';
import Testimonios from './pages/Testimonios';
import Preloader from './components/Preloader';

export default function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Preloader />

        <Navbar />
        <main style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/flota" element={<Flota />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonios" element={<Testimonios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
