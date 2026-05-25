'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, X } from 'lucide-react';
import styles from './page.module.css';

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export default function ContactoPage() {
  const [location, setLocation] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        console.log('ipapi response:', data);
        const parts = [data.city, data.region, data.country_name].filter(Boolean);
        const loc = parts.length > 0 ? parts.join(' · ') : 'Argentina';
        setLocation(loc);
      })
      .catch(() => setLocation('Argentina'));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al enviar el mensaje');
        setStatus('error');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.');
      setStatus('error');
    }
  };

  return (
    <section className={styles.page}>
      {bannerVisible && (
        <div className={styles.locationBanner}>
          <MapPin size={16} />
          <span>
            Detectamos que estás en <strong>{location || 'cargando...'}</strong>
            {' · '}
            <a href="#cambiar" className={styles.changeLink} onClick={(e) => { e.preventDefault(); }}>Cambiar ubicación</a>
          </span>
          <button className={styles.closeBtn} onClick={() => setBannerVisible(false)} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>Contáctenos</h1>
          <p className={styles.subtitle}>
            ¿Tenés una consulta? Estamos acá para ayudarte.
          </p>

          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.iconCircle}>
                <Clock size={18} />
              </span>
              <div>
                <p className={styles.infoLabel}>Tiempo de respuesta</p>
                <p className={styles.infoText}>Habitualmente en 24-48 hs hábiles</p>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.infoRow}>
              <span className={styles.iconCircle}>
                <MapPin size={18} />
              </span>
              <div>
                <p className={styles.infoLabel}>Ubicación</p>
                <p className={styles.infoText}>Argentina · 100% online</p>
              </div>
            </div>
          </div>

          <div className={styles.socialCard}>
            <h2 className={styles.socialTitle}>También podés encontrarnos en redes</h2>
            <p className={styles.socialSub}>Seguinos para más consejos del hogar</p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FacebookIcon />
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Nombre</label>
              <input className={styles.input} id="name" name="name" type="text" required placeholder="Tu nombre" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input className={styles.input} id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="subject">Asunto</label>
            <input className={styles.input} id="subject" name="subject" type="text" required placeholder="¿Sobre qué querés hablarnos?" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">Mensaje</label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              required
              placeholder="Escribí tu mensaje..."
              maxLength={5000}
            />
          </div>
          <p className={styles.legal}>
            Al enviar aceptás nuestra{' '}
            <a href="/politica-de-privacidad" target="_blank">política de privacidad</a>.
          </p>
          <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
          </button>
          {status === 'success' && (
            <div className={styles.alert}>
              Mensaje enviado con éxito. Te responderemos a la brevedad.
            </div>
          )}
          {status === 'error' && (
            <div className={styles.alertError}>
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
