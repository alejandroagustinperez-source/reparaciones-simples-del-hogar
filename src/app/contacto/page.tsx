'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const loc = [data.city, data.region].filter(Boolean).join(' · ');
        setLocation(loc || 'Argentina');
      })
      .catch(() => setLocation('Argentina'));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className={styles.page}>
      <div className={styles.locationBanner}>
        📍 Estás en {location || 'cargando...'}
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Contáctenos</h1>
        <p className={styles.subtitle}>
          ¿Tenés una consulta? Estamos acá para ayudarte
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.info}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>⏱️</div>
            <h2 className={styles.infoTitle}>Tiempo de respuesta</h2>
            <p className={styles.infoText}>
              Respondemos en un plazo de 24 a 48 horas hábiles.
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📍</div>
            <h2 className={styles.infoTitle}>Ubicación</h2>
            <p className={styles.infoText}>
              Argentina · 100% online
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📱</div>
            <h2 className={styles.infoTitle}>Redes sociales</h2>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Ig</a>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Nombre</label>
            <input className={styles.input} id="name" type="text" required placeholder="Tu nombre" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} id="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="subject">Asunto</label>
            <input className={styles.input} id="subject" type="text" required placeholder="¿Sobre qué querés hablarnos?" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">Mensaje</label>
            <textarea className={styles.textarea} id="message" required placeholder="Escribí tu mensaje..." />
          </div>
          <button className={styles.submitButton} type="submit">
            Enviar mensaje 📨
          </button>
          {submitted && (
            <div className={styles.alert}>
              ✓ Mensaje enviado con éxito. Te responderemos a la brevedad.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
