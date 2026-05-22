'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const UMBRAL = 1989;

const problemas = [
  { id: 'El+lavarropas+no+desagota', label: 'El lavarropas no desagota', icon: '🧺', desc: 'El lavarropas se llena de agua pero no la expulsa al desagotar.' },
  { id: 'Goteo+en+la+canilla+del+baño', label: 'Goteo en la canilla del baño', icon: '🚿', desc: 'La canilla pierde agua constantemente por la salida o la manija.' },
  { id: 'Saltó+la+térmica', label: 'Saltó la térmica', icon: '⚡', desc: 'El disyuntor o térmica salta al encender algún electrodoméstico.' },
  { id: 'El+inodoro+se+tapa+seguido', label: 'El inodoro se tapa seguido', icon: '🚽', desc: 'El inodoro se obstruye con frecuencia incluso con poco uso.' },
  { id: 'Olor+a+gas+en+la+cocina', label: 'Olor a gas en la cocina', icon: '🔥', desc: 'Se siente olor a gas cerca de la cocina o del calefón.' },
  { id: 'Humedad+en+la+pared', label: 'Humedad en la pared', icon: '🧱', desc: 'Manchas de humedad, moho o ampollas en la pintura de paredes.' },
];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const problema = params.get('problema');
    if (problema) {
      setPrompt(problema.replace(/\+/g, ' '));
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, []);

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
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Describí tu problema (ej: el lavarropas no desagota)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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

      <section className={styles.problemasSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Problemas más consultados</h2>
          <p className={styles.sectionSubtitle}>
            Elegí el problema que tengas y te guiamos paso a paso
          </p>
          <div className={styles.problemasGrid}>
            {problemas.map((p, i) => (
              <Link
                key={p.id}
                href={`/?problema=${p.id}`}
                className={styles.problemaCard}
              >
                <span className={styles.problemaNumber}>{i + 1}</span>
                <span className={styles.problemaIcon}>{p.icon}</span>
                <h3 className={styles.problemaLabel}>{p.label}</h3>
                <p className={styles.problemaDesc}>{p.desc}</p>
                <span className={styles.problemaLink}>Ver solución →</span>
              </Link>
            ))}
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

      <section className={styles.categoriasSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Categorías</h2>
          <p className={styles.sectionSubtitle}>Explorá por tipo de reparación</p>
          <div className={styles.categoriasGrid}>
            {[
              { id: 'electricidad', label: 'Electricidad', icon: '⚡' },
              { id: 'plomeria', label: 'Plomería', icon: '🔧' },
              { id: 'gas', label: 'Gas', icon: '🔥' },
              { id: 'humedad', label: 'Humedad', icon: '💧' },
              { id: 'pintura', label: 'Pintura', icon: '🎨' },
              { id: 'carpinteria', label: 'Carpintería', icon: '🪚' },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/?problema=${cat.id}`}
                className={styles.categoriaCard}
              >
                <span className={styles.categoriaIcon}>{cat.icon}</span>
                <span className={styles.categoriaLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>¿Por qué confiar en nosotros?</h2>
          <p className={styles.sectionSubtitle}>Todo lo que necesitás para resolverlo vos mismo</p>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <span className={styles.trustIcon}>🛡️</span>
              <h3 className={styles.trustTitle}>Información verificada</h3>
              <p className={styles.trustDesc}>Todas las guías son revisadas por profesionales matriculados</p>
            </div>
            <div className={styles.trustCard}>
              <span className={styles.trustIcon}>⚡</span>
              <h3 className={styles.trustTitle}>Solución en minutos</h3>
              <p className={styles.trustDesc}>Sin esperar turnos ni pagar visitas innecesarias</p>
            </div>
            <div className={styles.trustCard}>
              <span className={styles.trustIcon}>📍</span>
              <h3 className={styles.trustTitle}>Profesionales cerca tuyo</h3>
              <p className={styles.trustDesc}>Conectamos con matriculados de tu zona cuando lo necesitás</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ebookSection}>
        <div className={styles.ebookBanner}>
          <div className={styles.ebookContent}>
            <span className={styles.ebookBadge}>🔥 OFERTA POR TIEMPO LIMITADO</span>
            <h2 className={styles.ebookTitle}>
              Dejá de gastar miles en técnicos
            </h2>
            <p className={styles.ebookSubtitle}>Arreglalo vos en minutos</p>
            <p className={styles.ebookDesc}>
              La guía completa de electricidad, plomería, gas y humedad. Sin experiencia previa. +1.200 personas ya la tienen.
            </p>
            <ul className={styles.ebookBenefits}>
              <li className={styles.ebookBenefit}><strong>✓</strong> Pasos simples explicados con fotos</li>
              <li className={styles.ebookBenefit}><strong>✓</strong> Ahorrás miles de pesos por reparación</li>
              <li className={styles.ebookBenefit}><strong>✓</strong> Acceso inmediato en PDF y mobile</li>
            </ul>
            <div className={styles.ebookPrice}>
              <span className={styles.priceOriginal}>$5.999</span>
              <span className={styles.priceCurrent}>$2.999</span>
              <span className={styles.discountBadge}>-50%</span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_HOTMART_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ebookButton}
            >
              📥 Quiero el Ebook ahora →
            </a>
            <p className={styles.ebookButtonFoot}>
              🔒 Pago seguro · ⚡ Acceso inmediato · 🔄 Garantía 7 días
            </p>
          </div>
          <div className={styles.ebookImageWrap}>
            <Image
              src="/ebook.png"
              alt="Ebook Reparaciones Simples del Hogar"
              width={400}
              height={500}
              style={{ objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/5492665066606"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
        aria-label="WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
