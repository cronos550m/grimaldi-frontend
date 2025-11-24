import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { LanguageContext } from "../context/language";

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactConfig, setContactConfig] = useState(null);

  const { lang, texts } = useContext(LanguageContext);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactOk, setContactOk] = useState(false);
  const [contactSending, setContactSending] = useState(false);

  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Cargar servicios
  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data || []))
      .catch(() => {});
  }, []);

  // Cargar testimonios
  useEffect(() => {
    api
      .get("/testimonios")
      .then((r) => setTestimonials(r.data || []))
      .catch(() => setTestimonials([]));
  }, []);

  // Cargar datos de contacto de la empresa
  useEffect(() => {
    api
      .get("/contacto")
      .then((r) => setContactConfig(r.data || null))
      .catch(() => setContactConfig(null));
  }, []);

  // HERO
  const heroTitle =
    texts.home?.title ||
    (lang === "es"
      ? "Conectamos tu carga con cualquier punto del país y del mundo"
      : "We connect your cargo with any point in the country and the world");

      const heroDesc = texts.home?.desc || "";

      // imagen por defecto del hero (está en public/)
      const HERO_FALLBACK = "/grimaldi_left_bigger2_1920x1080_64c.png";
      const heroImage = texts.home?.heroImage || HERO_FALLBACK;
    
  // SERVICIOS
  const servicesTitle =
    texts.services_title?.[lang] ||
    (lang === "es"
      ? "Servicios de transporte y logística"
      : "Transport and logistics services");

  const servicesSubtitle =
    texts.services_subtitle?.[lang] ||
    (lang === "es"
      ? "Brindamos soluciones integrales de transporte y logística nacional e internacional. Integramos transporte terrestre, marítimo y aéreo, almacenaje y gestión aduanera para que tu carga llegue a destino de forma segura y a tiempo."
      : "We provide comprehensive national and international transport and logistics solutions, integrating road, sea and air transport, warehousing and customs management so your cargo arrives safely and on time.");

  const servicesIntro = texts.services_intro?.[lang] || "";

  // NOSOTROS
  const aboutTitle =
    texts.about?.title || (lang === "es" ? "Quiénes somos" : "Who we are");

  const aboutDesc =
    texts.about?.desc ||
    (lang === "es"
      ? "Somos una empresa de transporte y logística que brinda soluciones nacionales e internacionales para distintos sectores. Integramos transporte terrestre, marítimo y aéreo con almacenaje, distribución y gestión aduanera."
      : "We are a transport and logistics company providing national and international solutions for different sectors, integrating road, sea and air transport with warehousing, distribution and customs management.");

      const ABOUT_FALLBACK_IMAGE = "/nosotros/nosotros_familia2_1920x1080.jpg";
      const aboutImage = texts.about?.image || ABOUT_FALLBACK_IMAGE;

  // TESTIMONIOS
  const testimonialsTitle =
    texts.testimonials_title?.[lang] ||
    (lang === "es"
      ? "Lo que nuestros clientes destacan"
      : "What our clients value");

  const testimonialsSubtitle =
    texts.testimonials_subtitle?.[lang] ||
    (lang === "es"
      ? "Empresas de diferentes rubros confían en nosotros para planificar y ejecutar sus operaciones de transporte y logística, dentro y fuera del país."
      : "Companies from different industries trust us to plan and execute their transport and logistics operations, both domestically and abroad.");

  // CONTACTO
  const contactTitle =
    texts.contact?.title ||
    (lang === "es"
      ? "Hablemos de tu próxima operación logística"
      : "Let's talk about your next logistics operation");

  const contactSubtitle =
    texts.contact_subtitle?.[lang] ||
    (lang === "es"
      ? "Contanos qué necesitás transportar, desde dónde, hacia qué destinos y con qué frecuencia, y armamos una propuesta de transporte y logística ajustada a tu negocio."
      : "Tell us what you need to ship, from where, to which destinations and how often, and we will design a transport and logistics proposal tailored to your business.");

  const contactInfo1 =
    texts.contact_info1?.[lang] ||
    (lang === "es"
      ? "Para cotizar mejor, indicá tipo de carga, origen, destino, volumen estimado, frecuencia de envíos y si necesitás almacenaje, distribución y gestión aduanera."
      : "For an accurate quote, tell us the type of cargo, origin, destination, estimated volume, shipping frequency and whether you need warehousing, distribution and customs services.");

  const contactInfo2 =
    texts.contact_info2?.[lang] ||
    (lang === "es"
      ? "Nuestro equipo analizará la información y te responderá con alternativas de servicio, tiempos estimados y una propuesta económica clara."
      : "Our team will analyze the information and reply with service options, estimated transit times and a clear commercial proposal.");

  const contactInfo3 =
    texts.contact_info3?.[lang] ||
    (lang === "es"
      ? "Te acompañamos en la planificación y ejecución de tus envíos nacionales e internacionales, manteniéndote informado en cada etapa."
      : "We support you in planning and executing your national and international shipments, keeping you informed at every stage.");

  const handleContactChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitContact = async (e) => {
    e.preventDefault();
    setContactOk(false);
    setContactSending(true);
    try {
      await api.post("/contacto/message", contactForm);
      setContactOk(true);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error enviando mensaje de contacto", err);
      alert(
        lang === "es"
          ? "No se pudo enviar el mensaje. Intentá nuevamente."
          : "Message could not be sent. Please try again."
      );
    } finally {
      setContactSending(false);
    }
  };

  // MAPA / CONTACT CONFIG
  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.9265203194363!2d-58.5023531!3d-34.8580736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd6d1304db0a3%3A0xd91ddc1a0d92cabb!2sMariano%20Castex%201140%2C%20B1803%20Canning%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1763695029478!5m2!1ses!2sar";

  const contactMapUrl =
    (contactConfig && contactConfig.mapUrl) || googleMapsEmbedUrl;

  const contactCompany =
    contactConfig?.company ||
    (lang === "es" ? "Grimaldi Logística" : "Grimaldi Logistics");

  const contactEmail = contactConfig?.email || "grimaldi.log@gmail.com";
  const contactPhone = contactConfig?.phone || "+54 11 6935-8089";
  const contactWhatsapp = contactConfig?.whatsapp || "+54 9 11 6935-8089";
  const contactAddress =
    contactConfig?.address ||
    (lang === "es"
      ? "Mariano Castex 1140, Piso 4 Oficina 412, Canning, Buenos Aires"
      : "Mariano Castex 1140, 4th floor, office 412, Canning, Buenos Aires");

      const DEFAULT_QR_IMAGE = "/QRSer.png";
      const contactQrImage = contactConfig?.qrImage || DEFAULT_QR_IMAGE;
    

  // CARRUSEL DE SERVICIOS
  const fallbackImages = [
    "/services/camion-refrigerado.png",
    "/services/camion-container.png",
    "/services/integral.png",
  ];

  const fallbackServices = [
    {
      id: "refrigerado",
      title:
        lang === "es" ? "Transporte refrigerado" : "Refrigerated transport",
      desc:
        lang === "es"
          ? "Camiones y semirremolques refrigerados con control de temperatura continuo, registro de temperatura y unidades preparadas para transporte de carne, alimentos congelados y productos que no pueden romper la cadena de frío."
          : "Refrigerated trucks and semi-trailers with continuous temperature control, temperature logging and units prepared to transport meat, frozen food and any cargo that must maintain an unbroken cold chain.",
      image: fallbackImages[0],
    },
    {
      id: "contenedor",
      title:
        lang === "es"
          ? "Contenedores y semis tipo araña"
          : "Container & skeletal trailers",
      desc:
        lang === "es"
          ? "Camiones con semirremolques tipo araña cargando contenedores marítimos, coordinando puerto, depósitos y plantas para que la operación de entrada y salida de la carga sea ordenada."
          : "Trucks with skeletal semi-trailers hauling maritime containers, coordinating port, depots and plants to keep in/out cargo operations organized.",
      image: fallbackImages[1],
    },
    {
      id: "integral",
      title:
        lang === "es"
          ? "Logística integral nacional e internacional"
          : "End-to-end national & international logistics",
      desc:
        lang === "es"
          ? "Integramos transporte terrestre, marítimo, aéreo, almacenaje y gestión aduanera en una sola solución para que tengas un solo interlocutor en toda la operación."
          : "We integrate road, sea, air, warehousing and customs services into a single solution so you have one point of contact for the entire operation.",
      image: fallbackImages[2],
    },
  ];

  const apiHasContent =
    services &&
    services.some(
      (s) =>
        (s.title && (s.title[lang] || s.title.es)) ||
        (s.description && (s.description[lang] || s.description.es)) ||
        s.image
    );

  const carouselItems = apiHasContent
    ? services.map((s, idx) => {
        const fallback = fallbackServices[idx % fallbackServices.length];
        return {
          id: s.id || s._id || `srv-${idx}`,
          title: s.title?.[lang] || s.title?.es || fallback.title,
          desc:
            s.description?.[lang] ||
            s.description?.es ||
            s.desc_es ||
            fallback.desc,
          image: s.image || fallback.image,
        };
      })
    : fallbackServices;

  const totalSlides = carouselItems.length;

  const nextSlide = () => {
    setCurrentServiceSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentServiceSlide((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const goToSlide = (idx) => {
    setCurrentServiceSlide(idx);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(() => {
      setCurrentServiceSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(id);
  }, [totalSlides]);

  // TESTIMONIOS
  const fallbackTestimonials = [
    {
      id: "t1",
      text_es:
        "Buen timing en las cargas, solución rápida ante imprevistos y comunicación clara durante todo el viaje.",
      text_en:
        "Good timing on loads, quick solutions when something changes and clear communication throughout the journey.",
      author: "Cliente exportador de carne",
      position: "",
      image: "",
    },
    {
      id: "t2",
      text_es:
        "Nos ayudaron a ordenar la operatoria con puerto y depósitos, reduciendo tiempos muertos y costos extra.",
      text_en:
        "They helped us streamline operations with port and depots, reducing idle time and extra costs.",
      author: "Planta frigorífica",
      position: "",
      image: "",
    },
    {
      id: "t3",
      text_es:
        "Pudimos centralizar todo en un solo interlocutor para el tramo terrestre de nuestras exportaciones.",
      text_en:
        "We were able to centralize the whole inland leg of our exports with a single point of contact.",
      author: "Operador de comercio exterior",
      position: "",
      image: "",
    },
  ];

  const testimonialItems =
    testimonials && testimonials.length
      ? testimonials.map((t, idx) => {
          const fallback =
            fallbackTestimonials[idx % fallbackTestimonials.length];
          const text =
            lang === "es"
              ? t.text_es ||
                (t.text && (t.text.es || t.text["es"])) ||
                fallback.text_es
              : t.text_en ||
                (t.text && (t.text.en || t.text["en"])) ||
                fallback.text_en;
          return {
            id: t.id || t._id || `t-${idx}`,
            text,
            author: t.author || fallback.author,
            position: t.position || fallback.position,
            image: t.image || fallback.image || "",
          };
        })
      : fallbackTestimonials.map((t) => ({
          id: t.id,
          text: lang === "es" ? t.text_es : t.text_en,
          author: t.author,
          position: t.position,
          image: t.image || "",
        }));

  const totalTestimonials = testimonialItems.length;

  useEffect(() => {
    if (totalTestimonials <= 1) return;
    const id = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
    }, 8000);
    return () => clearInterval(id);
  }, [totalTestimonials]);

  const nextTestimonial = () => {
    if (totalTestimonials <= 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
  };

  const prevTestimonial = () => {
    if (totalTestimonials <= 0) return;
    setCurrentTestimonial((prev) =>
      prev === 0 ? totalTestimonials - 1 : prev - 1
    );
  };

  // ANIMACIÓN SCROLL: títulos desde la izquierda, textos desde la derecha
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-landing" style={{ paddingTop: 40 }}>
      {/* HERO */}
      <div
        id="hero"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          minHeight: "calc(90vh - 80px)",
          display: "flex",
          alignItems: "center",
          backgroundImage: heroImage
            ? `linear-gradient(120deg, rgba(15,23,42,0.55), rgba(15,23,42,0.2)), url(${heroImage})`
            : "linear-gradient(135deg, #020617, #0f172a)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            gap: 32,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 360px",
              maxWidth: 620,
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h1
              className="hero-title"
              data-animate="left"
              style={{
                fontSize: 38,
                lineHeight: 1.15,
                margin: 0,
                textShadow: "0 12px 30px rgba(0,0,0,0.7)",
              }}
            >
              {heroTitle}
            </h1>

            {heroDesc && (
              <p
                className="hero-text"
                data-animate="right"
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  margin: 0,
                  opacity: 0.96,
                  textShadow: "0 10px 26px rgba(0,0,0,0.7)",
                }}
              >
                {heroDesc}
              </p>
            )}

            <div
              className="hero-actions"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 10,
              }}
            >
              <button
                className="btn-primary"
                onClick={() => {
                  const el = document.getElementById("contacto");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {lang === "es" ? "Solicitar cotización" : "Request a quote"}
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  const el = document.getElementById("servicios");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {lang === "es" ? "Ver servicios" : "View services"}
              </button>
            </div>

            <div
              className="hero-stats"
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid rgba(148,163,184,0.5)",
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                fontSize: 13,
              }}
            >
              <div>
                <div
                  className="stat-number"
                  style={{ fontSize: 22, fontWeight: 600 }}
                >
                  +10
                </div>
                <div className="stat-label" style={{ opacity: 0.9 }}>
                  {lang === "es"
                    ? "Años de experiencia"
                    : "Years of experience"}
                </div>
              </div>
              <div>
                <div
                  className="stat-number"
                  style={{ fontSize: 16, fontWeight: 600 }}
                >
                  COBERTURA
                </div>
                <div className="stat-label" style={{ opacity: 0.9 }}>
                  {lang === "es"
                    ? "Red nacional e internacional"
                    : "National & international network"}
                </div>
              </div>
              <div>
                <div
                  className="stat-number"
                  style={{ fontSize: 22, fontWeight: 600 }}
                >
                  360°
                </div>
                <div className="stat-label" style={{ opacity: 0.9 }}>
                  {lang === "es"
                    ? "Soluciones logísticas integrales"
                    : "End-to-end logistics solutions"}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 260px",
              minHeight: 220,
            }}
          />
        </div>
      </div>

      {/* SERVICIOS con CARRUSEL */}
      <section id="servicios" className="section-landing">
        <div className="section-inner">
          <h2 className="section-title" data-animate="left">
            {servicesTitle}
          </h2>
          <p className="section-subtitle" data-animate="right">
            {servicesSubtitle}
          </p>

          {servicesIntro && (
            <p
              data-animate="right"
              style={{
                maxWidth: 800,
                marginTop: 8,
                marginBottom: 20,
                fontSize: 15,
                lineHeight: 1.6,
                opacity: 0.95,
              }}
            >
              {servicesIntro}
            </p>
          )}

          <div
            className="services-carousel"
            style={{
              position: "relative",
              maxWidth: 900,
              margin: "0 auto",
              padding: "8px 0 24px",
            }}
          >
            <div
              style={{
                overflow: "hidden",
                borderRadius: 24,
                boxShadow: "0 22px 70px rgba(15,23,42,0.22)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: `${totalSlides * 100}%`,
                  transform: `translateX(-${
                    currentServiceSlide * (100 / totalSlides)
                  }%)`,
                  transition: "transform 0.5s ease",
                }}
              >
                {carouselItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      width: `${100 / totalSlides}%`,
                      minHeight: 550,
                      backgroundColor: "#020617",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        minHeight: 550,
                        backgroundImage: item.image
                          ? `url(${item.image})`
                          : "linear-gradient(135deg, #1d4ed8, #0f172a)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          background: "rgba(15,23,42,0.72)",
                          backdropFilter: "blur(2px)",
                          padding: "18px 20px 20px",
                          color: "white",
                          boxSizing: "border-box",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 19,
                            fontWeight: 600,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            lineHeight: 1.6,
                            opacity: 0.96,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={prevSlide}
              style={{
                position: "absolute",
                top: "50%",
                left: -8,
                transform: "translateY(-50%)",
                borderRadius: "999px",
                border: "none",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15,23,42,0.9)",
                color: "white",
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              style={{
                position: "absolute",
                top: "50%",
                right: -8,
                transform: "translateY(-50%)",
                borderRadius: "999px",
                border: "none",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15,23,42,0.9)",
                color: "white",
                cursor: "pointer",
              }}
            >
              ›
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 12,
              }}
            >
              {carouselItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background:
                      idx === currentServiceSlide
                        ? "#0f172a"
                        : "rgba(148,163,184,0.7)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="section-landing">
        <div
          className="section-inner"
          style={{
            display: "flex",
            gap: 32,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 className="section-title" data-animate="left">
              {aboutTitle}
            </h2>
            <p className="section-subtitle" data-animate="right">
              {aboutDesc}
            </p>
          </div>

          {texts.about?.image && (
          <div style={{ flex: 1, minWidth: 260 }}>
          <img
            src={aboutImage}
            alt={lang === "es" ? "Equipo de logística" : "Logistics team"}
            style={{
              width: "100%",
              display: "block",
              borderRadius: 24,
              objectFit: "cover",
              boxShadow: "0 18px 50px rgba(15,23,42,0.18)",
            }}
          />
        </div>


          )}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="section-landing">
        <div className="section-inner">
          <h2 className="section-title" data-animate="left">
            {testimonialsTitle}
          </h2>
          <p className="section-subtitle" data-animate="right">
            {testimonialsSubtitle}
          </p>

          {totalTestimonials > 0 && (
            <div
              style={{
                marginTop: 28,
                maxWidth: 900,
                marginLeft: "auto",
                marginRight: "auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                  padding: "4px 4px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: `${totalTestimonials * 100}%`,
                    transform: `translateX(-${
                      (currentTestimonial * 100) / totalTestimonials
                    }%)`,
                    transition: "transform 1.1s ease-in-out",
                  }}
                >
                  {testimonialItems.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      style={{
                        width: `${100 / totalTestimonials}%`,
                        padding: "0 6px",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #020617, #0b1f4b)",
                          borderRadius: 22,
                          padding: 0,
                          boxShadow: "0 18px 40px rgba(15,23,42,0.45)",
                          maxWidth: 450,
                          width: "100%",
                          minHeight: 450,
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid rgba(148,163,184,0.45)",
                        }}
                      >
                        <div
                          style={{
                            borderRadius: 18,
                            padding: "18px 22px 22px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            color: "#e5e7eb",
                            gap: 10,
                          }}
                        >
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.author || "Cliente"}
                              style={{
                                height: 150,
                                width: "auto",
                                objectFit: "contain",
                                display: "block",
                                filter:
                                  "drop-shadow(0 4px 8px rgba(15,23,42,0.7))",
                                backgroundColor: "#020617",
                                borderRadius: 10,
                                padding: 8,
                                marginBottom: 4,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #1d4ed8, #38bdf8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 24,
                                fontWeight: 600,
                                flexShrink: 0,
                                marginBottom: 4,
                              }}
                            >
                              {(t.author || "?")
                                .substring(0, 1)
                                .toUpperCase()}
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {t.author && (
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 15,
                                }}
                              >
                                {t.author}
                              </span>
                            )}
                            {t.position && (
                              <span
                                style={{
                                  fontSize: 13,
                                  opacity: 0.85,
                                }}
                              >
                                {t.position}
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              marginBottom: 4,
                              width: 40,
                              height: 2,
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, #38bdf8, #1d4ed8)",
                              opacity: 0.9,
                            }}
                          />

                          <div
                            style={{
                              fontSize: 14,
                              lineHeight: 1.7,
                              opacity: 0.97,
                            }}
                          >
                            {`“${t.text}”`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalTestimonials > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevTestimonial}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: -10,
                      transform: "translateY(-50%)",
                      borderRadius: "999px",
                      border: "none",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,23,42,0.9)",
                      color: "white",
                      cursor: "pointer",
                      boxShadow: "0 10px 25px rgba(15,23,42,0.55)",
                    }}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextTestimonial}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -10,
                      transform: "translateY(-50%)",
                      borderRadius: "999px",
                      border: "none",
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15,23,42,0.9)",
                      color: "white",
                      cursor: "pointer",
                      boxShadow: "0 10px 25px rgba(15,23,42,0.55)",
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {totalTestimonials > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  {testimonialItems.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentTestimonial(idx)}
                      style={{
                        width: idx === currentTestimonial ? 11 : 8,
                        height: idx === currentTestimonial ? 11 : 8,
                        borderRadius: "999px",
                        border: "none",
                        cursor: "pointer",
                        background:
                          idx === currentTestimonial
                            ? "#0f172a"
                            : "rgba(148,163,184,0.7)",
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* DÓNDE ESTAMOS */}
      <section id="ubicacion" className="section-landing">
        <div className="section-inner">
          <h2 className="section-title" data-animate="left">
            {lang === "es" ? "Dónde estamos" : "Where we are"}
          </h2>
          <p className="section-subtitle" data-animate="right">
            {lang === "es"
              ? "Datos de contacto y ubicación de nuestras oficinas."
              : "Contact details and location of our offices."}
          </p>

          <div
            className="contact-layout"
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "stretch",
              marginTop: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 260,
                maxWidth: 480,
                borderRadius: 16,
                padding: "20px 22px",
                background: "#0f172a",
                color: "#e5e7eb",
                boxShadow: "0 18px 40px rgba(15,23,42,0.28)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  maxWidth: 320,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 18 }}>{contactCompany}</h3>

                <div style={{ fontSize: 14, opacity: 0.96 }}>
                  <div>{contactAddress}</div>

                  <div style={{ marginTop: 6 }}>
                    <strong>Email: </strong>
                    <a
                      href={`mailto:${contactEmail}`}
                      style={{ color: "#38bdf8" }}
                    >
                      {contactEmail}
                    </a>
                  </div>

                  <div>
                    <strong>Tel: </strong>
                    <a
                      href={`tel:${contactPhone}`}
                      style={{ color: "#38bdf8" }}
                    >
                      {contactPhone}
                    </a>
                  </div>

                  {contactWhatsapp && (
                    <div>
                      <strong>WhatsApp: </strong>
                      <a
                        href={`https://wa.me/${contactWhatsapp.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        style={{ color: "#38bdf8" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {contactWhatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {contactQrImage && (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid rgba(148,163,184,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 13, opacity: 0.9 }}>
                    {lang === "es"
                      ? "Escaneá el código para guardar nuestros datos."
                      : "Scan the code to save our contact details."}
                  </span>
                  <img
                    src={contactQrImage}
                    alt="QR contacto"
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "contain",
                      background: "#020617",
                      borderRadius: 12,
                      padding: 6,
                    }}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 280,
                height: 360,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(15,23,42,0.16)",
              }}
            >
              <iframe
                title={lang === "es" ? "Ubicación" : "Location"}
                src={contactMapUrl}
                style={{
                  border: 0,
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="section-landing">
        <div className="section-inner">
          <h2 className="section-title" data-animate="left">
            {contactTitle}
          </h2>
          <p className="section-subtitle" data-animate="right">
            {contactSubtitle}
          </p>

          <div
            className="contact-layout"
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginTop: 16,
            }}
          >
            {/* TEXTO IZQUIERDA – mismo estilo que cuadro de "Dónde estamos" */}
            <div
              data-animate="left"
              style={{
                flex: 1,
                minWidth: 260,
                maxWidth: 480,
                borderRadius: 16,
                padding: "20px 22px",
                background: "#0f172a",
                color: "#e5e7eb",
                boxShadow: "0 18px 40px rgba(15,23,42,0.28)",
                fontSize: 14,
                lineHeight: 1.7,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <p>{contactInfo1}</p>
              <p>{contactInfo2}</p>
              <p>{contactInfo3}</p>
            </div>

            {/* Formulario a la derecha */}
            <div
              data-animate="right"
              style={{ flex: 1, minWidth: 280, maxWidth: 520 }}
            >
              {contactOk && (
                <div
                  className="card"
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 8,
                    background: "#ecfdf3",
                    border: "1px solid #22c55e33",
                    fontSize: 14,
                  }}
                >
                  {texts?.contact_success?.[lang] ||
                    (lang === "es"
                      ? "Mensaje enviado. Gracias, te contactaremos a la brevedad."
                      : "Message sent. Thank you, we will get back to you soon.")}
                </div>
              )}

              <form onSubmit={submitContact}>
                <input
                  placeholder={
                    texts?.contact_name?.[lang] ||
                    (lang === "es" ? "Nombre" : "Name")
                  }
                  value={contactForm.name}
                  onChange={(e) =>
                    handleContactChange("name", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                  }}
                  required
                />

                <input
                  type="email"
                  placeholder={
                    texts?.contact_email?.[lang] ||
                    (lang === "es" ? "Email" : "Email")
                  }
                  value={contactForm.email}
                  onChange={(e) =>
                    handleContactChange("email", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                  }}
                  required
                />

                <input
                  placeholder={
                    texts?.contact_phone?.[lang] ||
                    (lang === "es" ? "Teléfono" : "Phone")
                  }
                  value={contactForm.phone}
                  onChange={(e) =>
                    handleContactChange("phone", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                  }}
                />

                <textarea
                  placeholder={
                    texts?.contact_message?.[lang] ||
                    (lang === "es" ? "Mensaje" : "Message")
                  }
                  value={contactForm.message}
                  onChange={(e) =>
                    handleContactChange("message", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginBottom: 8,
                    minHeight: 120,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    resize: "vertical",
                  }}
                  required
                />

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={contactSending}
                >
                  {contactSending
                    ? lang === "es"
                      ? "Enviando..."
                      : "Sending..."
                    : texts?.contact_send?.[lang] ||
                      (lang === "es" ? "Enviar" : "Send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
