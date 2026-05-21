'use client';

import { useState, useRef } from 'react';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const chips = [
  'El lavarropas no desagota',
  'Goteo en la canilla del baño',
  'Saltó la térmica',
  'El inodoro se tapa seguido',
  'Olor a gas en la cocina',
  'Humedad en la pared',
];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

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
        </div>
      </section>

      <div className={styles.locationBar}>
        <span>📍 Detectamos que estás en San Luis</span>
        <a href="#" className={styles.locationLink}>
          Cambiar ubicación
        </a>
      </div>

      <section className={styles.searchSection}>
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
      </section>

      <div className={styles.socialProof}>
        <span className={styles.proofBadge}>
          👥 +1.989 problemas resueltos esta semana
        </span>
        <span className={styles.proofBadge}>
          ★★★★★ 4.8 · 342 reseñas
        </span>
      </div>

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
