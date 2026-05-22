'use client';

import { useState, useRef, useEffect } from 'react';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const UMBRAL = 1989;

const chips = [
  'El lavarropas no desagota',
  'Goteo en la canilla del baño',
  'Saltó la térmica',
  'El inodoro se tapa seguido',
  'Olor a gas en la cocina',
  'Humedad en la pared',
];

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="#1877F2"/>
      <path d="M12.5 5.5H11.25C10.0074 5.5 9 6.50736 9 7.75V9H7V11H9V16H11.5V11H13L13.5 9H11.5V7.75C11.5 7.33579 11.8358 7 12.25 7H13V5.5H12.5Z" fill="white"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="url(#ig"/>
      <rect x="4.5" y="4.5" width="11" height="11" rx="3" stroke="white" strokeWidth="1.2"/>
      <circle cx="10" cy="10" r="3" stroke="white" strokeWidth="1.2"/>
      <circle cx="14.5" cy="5.5" r="1.2" fill="white"/>
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD600"/>
          <stop offset="0.25" stopColor="#FF7A00"/>
          <stop offset="0.5" stopColor="#FF0069"/>
          <stop offset="0.75" stopColor="#D300C5"/>
          <stop offset="1" stopColor="#7638FA"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const loc = [data.city, data.region].filter(Boolean).join(' · ');
        setLocation(loc || 'Argentina');
      })
      .catch(() => setLocation('Argentina'));
  }, []);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    sb.from('visitas').insert({}).then(() => {
      sb.from('visitas').select('*', { count: 'exact', head: true }).then(({ count }) => {
        if (count !== null) setVisitCount(count);
      });
    });
  }, []);

  const targetCount = visitCount !== null ? Math.max(UMBRAL, visitCount) : UMBRAL;

  useEffect(() => {
    if (displayCount >= targetCount) return;
    const duration = 2000;
    const start = performance.now();
    const from = 0;
    const diff = targetCount - from;
    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - t, 3);
      setDisplayCount(Math.round(from + diff * easeOut));
      if (t < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetCount]);

  useEffect(() => {
    if (!showLocationDropdown) return;
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLocationDropdown]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      setAnswer(data.response || 'Error al obtener respuesta.');
    } catch {
      setAnswer('Error al conectar con el asistente. Intentá de nuevo.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatAnswer = (text: string) => {
    const lines = text.split('\n').filter(Boolean);
    return (
      <div>
        {lines.map((line, i) => {
          if (/^\d+[\.\)]/.test(line)) {
            return <li key={i}>{line.replace(/^\d+[\.\)]\s*/, '')}</li>;
          }
          if (/^(diagnóstico|diagnóstico)/i.test(line)) {
            return (
              <h3 key={i}>
                <strong>{line}</strong>
              </h3>
            );
          }
          if (/profesional|matriculado|riesgo|gas|eléctric/i.test(line)) {
            return (
              <div key={i} className={styles.proAlert}>
                ⚠️ {line}
              </div>
            );
          }
          return (
            <p key={i} style={{ marginBottom: '0.5rem' }}>
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={styles.locationBar} ref={locationRef}>
        <span>📍 Detectamos que estás en {location || 'Detectando tu ubicación...'}</span>
        <button
          className={styles.locationLink}
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          type="button"
        >
          Cambiar ubicación
        </button>
        {showLocationDropdown && (
          <div className={styles.locationDropdown}>
            <p>El directorio de profesionales por zona estará disponible próximamente.</p>
            <button
              className={styles.locationDropdownClose}
              onClick={() => setShowLocationDropdown(false)}
              type="button"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>✨ Asistente con IA · gratis</div>
          <h1 className={styles.title}>
            ¿Qué problema tenés en{' '}
            <span className={styles.highlight}>tu casa</span>?
          </h1>
          <p className={styles.subtitle}>
            Contanos qué pasa y la IA te dice cómo arreglarlo paso a paso.
          </p>
          <div className={styles.howItWorks}>
            <span className={styles.step}>💬 Describís el problema</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.step}>🤖 La IA analiza</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.step}>✅ Recibís la solución</span>
          </div>

          <div className={styles.searchBox}>
            <span className={styles.searchLabel}>ASISTENTE IA · GRATIS</span>
            <textarea
              className={styles.textarea}
              placeholder="Describí tu problema (ej: el lavarropas no desagota)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.chips}>
              {chips.map((chip) => (
                <button
                  key={chip}
                  className={styles.chip}
                  onClick={() => handleChipClick(chip)}
                  type="button"
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              type="button"
            >
              {loading ? 'Analizando...' : 'Obtener solución →'}
            </button>
            <p className={styles.footnote}>
              ⚠️ Orientación general. Ante riesgo de gas o eléctrico, llamá a un
              matriculado.
            </p>
          </div>

          <div className={styles.socialProof}>
            <div className={`${styles.proofMetric} ${styles.proofMetricLeft}`}>
              <span className={styles.liveDot} />
              <span className={styles.proofNumber}>{displayCount.toLocaleString()}</span>
              <span className={styles.proofLabel}>problemas resueltos esta semana</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.proofMetric}>
              <span className={styles.proofStars}>★★★★★</span>
              <span className={styles.proofNumber}>4.8</span>
              <span className={styles.proofLabel}>de 342 reseñas verificadas</span>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <section className={styles.answerSection} ref={answerRef}>
          <div className={styles.answerCard}>
            <div className={styles.spinner}>
              <div className={styles.spinnerIcon} />
              Analizando tu problema...
            </div>
          </div>
        </section>
      )}

      {answer && (
        <section className={styles.answerSection} ref={answerRef}>
          <div className={styles.answerCard}>
            {formatAnswer(answer)}
          </div>
        </section>
      )}

      <AdBanner />

      <section className={styles.ebookSection}>
        <div className={styles.ebookBanner}>
          <div className={styles.ebookContent}>
            <h2 className={styles.ebookTitle}>
              📘 Dejá de gastar miles en técnicos — Arreglalo vos en minutos
            </h2>
            <p className={styles.ebookSubtext}>
              Electricidad, plomería, gas y humedad. Sin experiencia previa.
            </p>
            <div className={styles.ebookPrice}>
              <span className={styles.priceOriginal}>$5.999</span>
              <span className={styles.priceCurrent}>$2.999</span>
              <span className={styles.discountBadge}>-50% HOY</span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_HOTMART_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ebookButton}
            >
              Quiero el Ebook →
            </a>
          </div>
          <div className={styles.ebookImage}>📘</div>
        </div>
      </section>
    </>
  );
}
