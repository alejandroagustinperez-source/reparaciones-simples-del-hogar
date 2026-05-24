'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Clock, AlertTriangle, Wrench, BookOpen, MapPin, Bell, Check, Info, ExternalLink } from 'lucide-react';
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

const categorias = [
  { id: 'electricidad', label: 'Electricidad', icon: '⚡', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=electricidad', desc: 'Luces, tomas y llaves térmicas', color: '#fee2e2' },
  { id: 'plomeria', label: 'Plomería', icon: '🔧', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=plomeria', desc: 'Canillas, tanques y desagües', color: '#dbeafe' },
  { id: 'gas', label: 'Gas', icon: '🔥', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=gas', desc: 'Cocina, calefón y estufas', color: '#ffedd5' },
  { id: 'humedad', label: 'Humedad', icon: '💧', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=humedad', desc: 'Filtraciones, moho y paredes', color: '#e0f2fe' },
  { id: 'pintura', label: 'Pintura', icon: '🎨', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=pintura', desc: 'Paredes, techos y exteriores', color: '#f3e8ff' },
  { id: 'carpinteria', label: 'Carpintería', icon: '🪚', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=carpinteria', desc: 'Muebles, puertas y ventanas', color: '#fef3c7' },
  { id: 'jardineria', label: 'Jardinería', icon: '🌿', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=jardineria', desc: 'Plantas, riego y césped', color: '#dcfce7' },
  { id: 'cerrajeria', label: 'Cerrajería', icon: '🔑', href: 'https://blog.reparacionessimplesdelhogar.com.ar?categoria=cerrajeria', desc: 'Cerraduras, llaves y candados', color: '#f3f4f6' },
];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [disabledChips, setDisabledChips] = useState<Set<number>>(new Set());
  const [location, setLocation] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [notifEmail, setNotifEmail] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [notifSuccess, setNotifSuccess] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const responseTopRef = useRef<HTMLParagraphElement>(null);
  const problemasRef = useRef<HTMLDivElement>(null);
  const categoriasRef = useRef<HTMLDivElement>(null);

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
    const userMessage = prompt.trim();
    setPrompt('');
    setLastQuery(userMessage);
    setLoading(true);
    setAiResponse(null);
    setAnswer(null);
    
    const updatedHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    setConversationHistory(updatedHistory);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory }),
      });
      const data = await res.json();
      const raw = data.response || '';
      try {
        const parsed = JSON.parse(raw);
        setAiResponse(parsed);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: raw }]);
      } catch {
        setAnswer(raw);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: raw }]);
      }
    } catch {
      setAnswer('Error al conectar con el asistente. Intentá de nuevo.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (responseTopRef.current) {
          const top = responseTopRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const followUpSubmit = async (text: string, chipIndex: number) => {
    setPrompt(text);
    setDisabledChips(prev => new Set(prev).add(chipIndex));
    const userMessage = text;
    setPrompt('');
    setLastQuery(userMessage);
    setLoading(true);
    
    const updatedHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    setConversationHistory(updatedHistory);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory }),
      });
      const data = await res.json();
      const raw = data.response || '';
      try {
        const parsed = JSON.parse(raw);
        setAiResponse(parsed);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: raw }]);
      } catch {
        setAnswer(raw);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: raw }]);
      }
    } catch {
      setAnswer('Error al conectar con el asistente. Intentá de nuevo.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (responseTopRef.current) {
          const top = responseTopRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleNotifSubmit = async () => {
    const email = notifEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotifError('Ingresá un email válido');
      return;
    }
    setNotifLoading(true);
    setNotifError('');
    try {
      const res = await fetch('/api/notify-professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city: location || 'San Luis', province: 'San Luis' }),
      });
      if (!res.ok) throw new Error();
      localStorage.setItem('notif_sent', 'true');
      setNotifSuccess(true);
    } catch {
      setNotifError('Hubo un error, intentá de nuevo');
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('notif_sent') === 'true') {
      setNotifSuccess(true);
    }
  }, []);

  const handleProblemaClick = (label: string) => {
    setPrompt(label);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <span className={styles.step}>🔍 La IA analiza</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.step}>✅ Recibís la solución</span>
          </div>

          <div className={styles.searchBox}>
            <span className={styles.searchLabel}>⚡ ASISTENTE IA · GRATIS</span>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Describí tu problema (ej: el lavarropas no desagota)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.searchBottomRow}>
              <div className={styles.suggestionChips}>
                {problemas.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    className={styles.suggestionChip}
                    onClick={() => handleProblemaClick(p.label)}
                    type="button"
                  >
                    {p.label}
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
            </div>
            <p className={styles.footnote}>
              ⚠️ Orientación general. Ante riesgo de gas o eléctrico, llamá a un
              matriculado.
            </p>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.proofPill}>
              <span className={styles.liveDot} />
              +{displayCount.toLocaleString()} problemas resueltos esta semana
            </div>
            <div className={styles.proofPill}>
              ⭐ 4.8 · 342 reseñas
            </div>
          </div>

          <div className={styles.heroActions}>
            <button
              className={styles.heroActionBtn}
              onClick={() => problemasRef.current?.scrollIntoView({ behavior: 'smooth' })}
              type="button"
            >
              🔍 Problemas más buscados
            </button>
            <button
              className={styles.heroActionBtn}
              onClick={() => categoriasRef.current?.scrollIntoView({ behavior: 'smooth' })}
              type="button"
            >
              📂 Categorías
            </button>
          </div>
        </div>
      </section>

      <section className={styles.problemasSection} ref={problemasRef}>
        <div className={styles.sectionInner}>
          <div className={styles.problemasHeader}>
            <div>
              <span className={styles.trendBadge}>🔥 En tendencia</span>
              <h2 className={styles.sectionTitleLeft}>Problemas más consultados</h2>
            </div>
            <a
              href="https://blog.reparacionessimplesdelhogar.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.verTodos}
            >
              Ver todos →
            </a>
          </div>
          <p className={styles.sectionSubtitleLeft}>
            Elegí el problema que tengas y te guiamos paso a paso
          </p>
          <div className={styles.problemaSearchRow}>
            <div className={styles.searchInputWrap}>
              <span>🔍</span>
              <input type="text" placeholder="Buscar problema..." />
            </div>
            <button className={styles.problemaSearchBtn} type="button">Buscar</button>
          </div>
          <div className={styles.problemaGridScroll}>
            <div className={styles.problemasGrid}>
              {problemas.map((p, i) => (
                <button
                  key={p.id}
                  className={styles.problemaCard}
                  onClick={() => handleProblemaClick(p.label)}
                  type="button"
                >
                  <span className={styles.problemaNumber}>{i + 1}</span>
                  <span className={styles.problemaIcon}>{p.icon}</span>
                  <h3 className={styles.problemaLabel}>{p.label}</h3>
                  <p className={styles.problemaDesc}>{p.desc}</p>
                  <span className={styles.problemaLink}>Ver solución →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(aiResponse || loading) && (
        <section className={styles.answerSection} ref={answerRef}>
          <div className={styles.answerContainer}>
            <p className={styles.queryHeader} ref={responseTopRef}>Tu consulta: {lastQuery}</p>

            {aiResponse && (<>
            {aiResponse.needsMoreInfo && aiResponse.followUpQuestion && (
              <div className={styles.followUpCard}>
                <div className={styles.followUpHeader}>
                  <span className={styles.followUpIcon}>?</span>
                  <div>
                    <span className={styles.followUpLabel}>UNA PREGUNTA MÁS</span>
                    <p className={styles.followUpQuestion}>{aiResponse.followUpQuestion.question}</p>
                    <p className={styles.followUpSub}>Tu respuesta nos ayuda a darte una solución más precisa.</p>
                  </div>
                </div>
                <div className={styles.followUpChips}>
                  {aiResponse.followUpQuestion.quickOptions?.map((opt: string, i: number) => (
                    <button
                      key={i}
                      className={styles.followUpChip}
                      onClick={() => followUpSubmit(opt, i)}
                      disabled={disabledChips.has(i)}
                      type="button"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className={styles.followUpFooter}>O escribí tu respuesta abajo con tus palabras.</p>
              </div>
            )}

            {aiResponse.warnings?.map((w: any, i: number) => (
              <div key={i} className={`${styles.warningCard} ${w.type === 'danger' ? styles.warningDanger : styles.warningUrgent}`}>
                {w.type === 'danger' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                <div>
                  <p className={styles.warningTitle}>{w.title}</p>
                  <p className={styles.warningDesc}>{w.description}</p>
                </div>
              </div>
            ))}

            <div className={styles.badgesRow}>
              {aiResponse.difficulty && (
                <span className={`${styles.diffBadge} ${styles[`diff${aiResponse.difficulty}`]}`}>
                  Dificultad: {aiResponse.difficulty}
                </span>
              )}
              {aiResponse.requiresProfessional && (
                <span className={styles.proBadge}>
                  <Wrench size={14} /> Técnico Sugerido
                </span>
              )}
            </div>

            {aiResponse.mainExplanation && (
              <p className={styles.mainExplanation}>{aiResponse.mainExplanation}</p>
            )}

            {aiResponse.diagnosis?.length > 0 && (
              <div className={styles.diagnosisSection}>
                <h3 className={styles.diagnosisTitle}><Wrench size={20} /> Diagnóstico paso a paso</h3>
                <p className={styles.diagnosisSub}>Como lo haría un técnico: revisamos las causas más probables primero.</p>
                {aiResponse.diagnosis.map((d: any, i: number) => (
                  <div key={i} className={styles.diagnosisCard}>
                    <div className={styles.diagnosisHeader}>
                      <div className={styles.diagnosisNum}>{d.number}</div>
                      <div className={styles.diagnosisInfo}>
                        <p className={styles.diagnosisCause}>{d.cause}</p>
                        <span className={`${styles.probBadge} ${styles[`prob${d.probability}`]}`}>
                          Probabilidad {d.probability}
                        </span>
                        {d.requiresMatriculado && (
                          <span className={styles.matriculadoBadge}>Requiere matriculado</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.diagnosisCols}>
                      <div className={styles.diagnosisCol}>
                        <span className={styles.colLabel}>CÓMO VERIFICARLO</span>
                        <p className={styles.colText}>{d.howToCheck}</p>
                      </div>
                      <div className={styles.diagnosisCol}>
                        <span className={styles.colLabel}>SOLUCIÓN</span>
                        <p className={styles.colText}>{d.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiResponse.stepsToFollow?.length > 0 && (
              <div className={styles.stepsCard}>
                <h3 className={styles.stepsTitle}>Pasos a seguir</h3>
                <div className={styles.stepsList}>
                  {aiResponse.stepsToFollow.map((step: any, i: number) => (
                    <div key={i} className={styles.stepBlock}>
                      <div className={styles.stepHeader}>
                        <span className={styles.stepNum}>{i + 1}</span>
                        <p className={styles.stepTitle}>{step.title}</p>
                      </div>
                      <p className={styles.stepDesc}>{step.description}</p>
                      {step.subSteps?.map((sub: any, j: number) => (
                        <div key={j} className={styles.subStep}>
                          <span className={styles.subStepBullet}>→</span>
                          <div>
                            <p className={styles.subStepText}>{sub.text}</p>
                            {sub.tip && <p className={styles.subStepTip}>💡 {sub.tip}</p>}
                          </div>
                        </div>
                      ))}
                      {step.warning && (
                        <p className={styles.stepWarning}>
                          ⚠️ {step.warning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiResponse.productManualUrl && (
              <div className={styles.manualCard}>
                <span className={styles.manualIcon}><BookOpen size={20} /></span>
                <div className={styles.manualContent}>
                  <p className={styles.manualTitle}>Manual del producto</p>
                  <p className={styles.manualDesc}>Consultá el soporte oficial del fabricante para más detalles del modelo.</p>
                  <a href={aiResponse.productManualUrl} target="_blank" rel="noopener noreferrer" className={styles.manualBtn}>
                    Ver manual oficial <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}

            {aiResponse.relatedGuides?.length > 0 && (
              <div className={styles.guidesCard}>
                <p className={styles.guidesTitle}>Guías relacionadas en el sitio</p>
                {aiResponse.relatedGuides.map((g: any, i: number) => {
                  if (!g.slug) return null;
                  return (
                    <a key={i} href={`https://blog.reparacionessimplesdelhogar.com.ar/${g.slug}`} target="_blank" rel="noopener noreferrer" className={styles.guideItem}>
                      <div>
                        <p className={styles.guideName}>{g.title}</p>
                        <p className={styles.guideDesc}>{g.description}</p>
                      </div>
                      <span className={styles.guideArrow}>→</span>
                    </a>
                  );
                })}
              </div>
            )}
            </>)}

            <Link href="/planes-para-profesionales#planes" className={styles.comingLink}>
              <div className={styles.comingCard}>
                <span className={styles.comingIcon}><MapPin size={18} /></span>
                <div className={styles.comingContent}>
                  <span className={styles.comingBadge}>MUY PRONTO</span>
                  <p className={styles.comingTitle}>Encontrá profesionales de confianza cerca tuyo</p>
                  <p className={styles.comingDesc}>Estamos armando un directorio de profesionales matriculados por zona.</p>
                  <p className={styles.comingNote}>¿Sos profesional y querés aparecer? Dejanos tus datos.</p>
                  <span className={styles.comingBtn}>Quiero ofrecer mis servicios</span>
                </div>
              </div>
            </Link>

            <div className={styles.notifCard}>
              <span className={styles.notifIcon}>{notifSuccess ? <Check size={18} /> : <Bell size={18} />}</span>
              <div className={styles.notifContent}>
                {notifSuccess ? (
                  <>
                    <p className={styles.notifSuccessTitle}>¡Listo! Te avisamos cuando haya profesionales en {location || 'tu zona'}</p>
                    <p className={styles.notifNote}>No te vamos a llenar de mails. Un solo aviso cuando esté activo.</p>
                  </>
                ) : (
                  <>
                    <p className={styles.notifTitle}>Recibí alertas cuando tengamos profesionales en tu zona</p>
                    <p className={styles.notifDesc}>Vas a recibir un solo aviso cuando el directorio esté activo.</p>
                    <div className={styles.notifLocation}><MapPin size={14} /> {location || 'Argentina'}</div>
                    <div className={styles.notifRow}>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className={styles.notifInput}
                        value={notifEmail}
                        onChange={(e) => { setNotifEmail(e.target.value); setNotifError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleNotifSubmit()}
                      />
                      <button className={styles.notifBtn} type="button" onClick={handleNotifSubmit} disabled={notifLoading}>
                        {notifLoading ? 'Enviando...' : <><Bell size={16} /> Quiero que me avisen</>}
                      </button>
                    </div>
                    {notifError && <p className={styles.notifError}>{notifError}</p>}
                    <p className={styles.notifNote}>Solo te escribiremos cuando haya novedades para tu ciudad. Sin spam.</p>
                  </>
                )}
              </div>
            </div>

            <div className={styles.disclaimer}>
              <Info size={16} />
              <span>Esta información es orientativa. Ante dudas o situaciones peligrosas, consultá con un profesional matriculado.</span>
            </div>

            {loading && (
              <div className={styles.chatLoading}>
                <div className={styles.spinnerIcon} />
                Analizando...
              </div>
            )}

            <div className={styles.chatInputRow}>
              <input
                type="text"
                className={styles.chatInput}
                placeholder="Respondé acá..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                className={styles.chatSendBtn}
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                type="button"
              >
                {loading ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        </section>
      )}

      {answer && !aiResponse && (
        <section className={styles.answerSection} ref={answerRef}>
          <div className={styles.answerCard}>
            {formatAnswer(answer)}
          </div>
        </section>
      )}

      <section className={styles.categoriasSection} ref={categoriasRef}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitleLeft}>Categorías</h2>
          <p className={styles.sectionSubtitleLeft}>Explorá por tipo de reparación</p>
          <div className={styles.categoriasGrid}>
            {categorias.map((cat) => (
              <a
                key={cat.id}
                href={cat.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.categoriaCard}
              >
                <div className={styles.categoriaIconBg} style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <span className={styles.categoriaLabel}>{cat.label}</span>
                <span className={styles.categoriaDesc}>{cat.desc}</span>
              </a>
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
              width={480}
              height={580}
              loading="lazy"
              className={styles.ebookImage}
              style={{ objectFit: 'contain', mixBlendMode: 'normal', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.6))', transform: 'rotate(2deg)', maxWidth: '100%' }}
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.815 11.815 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
