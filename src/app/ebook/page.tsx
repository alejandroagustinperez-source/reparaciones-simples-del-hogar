'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, X, Download, Shield, RefreshCw } from 'lucide-react';
import styles from './page.module.css';

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className={`${styles.faqArrow} ${open ? styles.faqArrowOpen : ''}`}>▾</span>
      </button>
      {open && <p className={styles.faqAnswer}>{answer}</p>}
    </div>
  );
}

export default function EbookPage() {
  const hotmartUrl = process.env.NEXT_PUBLIC_HOTMART_URL || '#';
  const [location, setLocation] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const loc = [data.city, data.region].filter(Boolean).join(' · ');
        setLocation(loc || 'Argentina');
      })
      .catch(() => setLocation('Argentina'));
  }, []);

  const testimonials = [
    { name: 'Mariana G.', location: 'Mendoza', text: 'Lo compré por curiosidad y terminé arreglando una pérdida en la cocina el mismo día. Increíble lo claro que está todo.', initial: 'M' },
    { name: 'Juan P.', location: 'San Luis', text: 'Súper claro y bien explicado. Lo bueno es que también te dice cuándo NO meterte. Eso me dio mucha confianza.', initial: 'J' },
    { name: 'Carla R.', location: 'Buenos Aires', text: 'Lo tengo en el celu y lo consulto seguido. La parte de electricidad me sacó muchas dudas que tenía desde hace años.', initial: 'C' },
    { name: 'Diego M.', location: 'Córdoba', text: 'Vale 10 veces lo que cuesta. Con un solo arreglo ya lo recuperé. Se lo recomiendo a cualquiera que viva solo.', initial: 'D' },
  ];

  const faqs = [
    { q: '¿Cómo recibo el ebook después de pagar?', a: 'Una vez realizado el pago, recibís un link de descarga directa en tu correo electrónico. También podés acceder desde la plataforma de Hotmart.' },
    { q: '¿En qué formato está?', a: 'El ebook está en formato PDF, compatible con celulares, tablets, computadoras y lectores electrónicos. Lo podés leer en cualquier dispositivo.' },
    { q: '¿Necesito conocimientos previos?', a: 'No. La guía está pensada para principiantes absolutos. Cada paso está explicado en lenguaje simple, con fotos e ilustraciones.' },
    { q: '¿Sirve si vivo en departamento?', a: 'Sí, la mayoría de los arreglos aplican a cualquier tipo de vivienda. Hay secciones específicas para problemas comunes en departamentos.' },
    { q: '¿Tiene garantía?', a: 'Sí, ofrecemos 7 días de garantía incondicional. Si no te sirve, te devolvemos el 100% de tu dinero, sin preguntas.' },
    { q: '¿Las actualizaciones son gratis?', a: 'Sí. Cuando comprás el ebook, recibís todas las actualizaciones futuras de por vida, sin costo adicional.' },
  ];

  return (
    <>
      {bannerVisible && (
        <div className={styles.locationBanner}>
          <MapPin size={14} />
          <span>
            Detectamos que estás en <strong>{location || 'cargando...'}</strong>
            {' · '}
            <a href="#cambiar" className={styles.changeLink} onClick={(e) => { e.preventDefault(); }}>Cambiar ubicación</a>
          </span>
          <button className={styles.closeBtn} onClick={() => setBannerVisible(false)} aria-label="Cerrar">
            <X size={14} />
          </button>
        </div>
      )}

      <div className={styles.topBar}>
        🔥 OFERTA POR HOY: 50% OFF + Acceso inmediato · Precio promocional por tiempo limitado
      </div>

      {/* SECCIÓN 1 — HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>📘 Ebook digital · Edición 2025</span>
            <h1 className={styles.heroTitle}>
              Dejá de gastar miles en técnicos
              <span className={styles.heroTitleBreak}>
                <span className={styles.orangeText}>arreglalo vos</span> en minutos
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              La guía simple y directa para resolver problemas de plomería,
              electricidad, gas y humedad{' '}
              <strong>sin experiencia previa</strong>.
            </p>
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.9/5 · +1.200 personas ya lo descargaron</span>
            </div>
            <div className={styles.heroPrice}>
              <span className={styles.heroPriceOriginal}>$5.999</span>
              <span className={styles.heroPriceCurrent}>$2.999</span>
              <span className={styles.discountBadge}>-50% HOY</span>
            </div>
            <div className={styles.badgesRow}>
              <span className={styles.badgeSolid}>🔥 50% OFF SOLO POR HOY</span>
              <span className={styles.badgeOutline}>⏱ Acceso inmediato</span>
              <span className={styles.badgeOutline}>⚠️ Oferta por tiempo limitado</span>
            </div>
            <a href={hotmartUrl} target="_blank" rel="noopener noreferrer" className={styles.heroCtaButton}>
              <Download size={20} />
              QUIERO EL EBOOK AHORA
            </a>
            <div className={styles.heroTrust}>
              <span><Shield size={14} /> Pago 100% seguro</span>
              <span className={styles.trustSep}>·</span>
              <span><Download size={14} /> Acceso inmediato</span>
              <span className={styles.trustSep}>·</span>
              <span><RefreshCw size={14} /> Garantía 7 días</span>
            </div>
          </div>
          <div className={styles.heroImage}>
            <span className={styles.imageBadge}>PDF + Mobile</span>
            <Image
              src="/ebook.png"
              alt="Ebook Reparaciones Simples del Hogar"
              width={600}
              height={700}
              className={styles.ebookImg}
              priority
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 — STATS */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+1.200</span>
            <span className={styles.statLabel}>Lectores activos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+30</span>
            <span className={styles.statLabel}>Páginas de contenido</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>6</span>
            <span className={styles.statLabel}>Áreas del hogar</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4.9</span>
            <span className={styles.statLabel}>Valoración promedio</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3 — PROBLEMA */}
      <section className={styles.problemSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionTag}>¿TE SUENA FAMILIAR?</span>
          <h2 className={styles.sectionTitle}>
            Cada arreglo te cuesta una fortuna... y se rompe otra cosa
          </h2>
          <p className={styles.sectionSub}>
            Si vivís solo o alquilás, sabés lo frustrante que es tener que pagar
            cada vez que algo se rompe.
          </p>
          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <span className={`${styles.problemIcon} ${styles.problemIconRed}`}>$</span>
              <p className={styles.problemCardTitle}>Gastás fortunas cada mes en arreglos</p>
              <p className={styles.problemCardText}>Una canilla que gotea, un enchufe que saltó, una pérdida de gas menor. Cada visita del técnico te sale $5.000 o más.</p>
            </div>
            <div className={styles.problemCard}>
              <span className={`${styles.problemIcon} ${styles.problemIconRed}`}>⚠</span>
              <p className={styles.problemCardTitle}>Dependés de alguien para cada pavada</p>
              <p className={styles.problemCardText}>Cambiar un fusible, destapar una cañería, ajustar una puerta. Son pavadas que te gustaría hacer vos, pero no sabés cómo.</p>
            </div>
            <div className={styles.problemCard}>
              <span className={`${styles.problemIcon} ${styles.problemIconRed}`}>🕐</span>
              <p className={styles.problemCardTitle}>Perdés días esperando al técnico</p>
              <p className={styles.problemCardText}>Pedís turno, cancelan, te toman el día, y al final te cobran una fortuna por algo que podrías haber hecho en 10 minutos.</p>
            </div>
          </div>
          <a href={hotmartUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            DESCARGAR CON 50% DE DESCUENTO
          </a>
        </div>
      </section>

      {/* SECCIÓN 4 — CONTENIDO */}
      <section className={styles.contentSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionTag}>CONTENIDO</span>
          <h2 className={styles.sectionTitle}>Todo lo que vas a aprender adentro</h2>
          <div className={styles.contentGrid}>
            <div className={styles.contentCard}>
              <div className={styles.contentCardHeader}>
                <span className={`${styles.contentIcon} ${styles.contentIconOrange}`}>⚡</span>
                <h3 className={styles.contentCardTitle}>Electricidad</h3>
              </div>
              <ul className={styles.contentList}>
                <li>Cambiar enchufes y llaves</li>
                <li>Detectar cortocircuitos</li>
                <li>Instalar lámparas LED</li>
              </ul>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentCardHeader}>
                <span className={`${styles.contentIcon} ${styles.contentIconOrange}`}>🔧</span>
                <h3 className={styles.contentCardTitle}>Plomería</h3>
              </div>
              <ul className={styles.contentList}>
                <li>Destapar cañerías</li>
                <li>Reparar canillas que gotean</li>
                <li>Cambiar flotantes y mochilas</li>
              </ul>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentCardHeader}>
                <span className={`${styles.contentIcon} ${styles.contentIconOrange}`}>🔥</span>
                <h3 className={styles.contentCardTitle}>Gas</h3>
              </div>
              <ul className={styles.contentList}>
                <li>Detectar pérdidas</li>
                <li>Cuándo SÍ llamar al gasista</li>
                <li>Mantenimiento preventivo</li>
              </ul>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentCardHeader}>
                <span className={`${styles.contentIcon} ${styles.contentIconOrange}`}>🏠</span>
                <h3 className={styles.contentCardTitle}>Mantenimiento general</h3>
              </div>
              <ul className={styles.contentList}>
                <li>Pintura y humedad</li>
                <li>Puertas y cerraduras</li>
                <li>Pequeñas roturas</li>
              </ul>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentCardHeader}>
                <span className={`${styles.contentIcon} ${styles.contentIconOrange}`}>⚙</span>
                <h3 className={styles.contentCardTitle}>Electrodomésticos</h3>
              </div>
              <ul className={styles.contentList}>
                <li>Diagnóstico de fallas comunes</li>
                <li>Mantenimiento y limpieza</li>
                <li>Cuándo conviene reparar o cambiar</li>
              </ul>
            </div>
          </div>
          <a href={hotmartUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
            QUIERO EL EBOOK AHORA — $2.999
          </a>
        </div>
      </section>

      {/* SECCIÓN 5 — BENEFICIOS */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.benefitsLeft}>
            <span className={styles.sectionTag}>BENEFICIOS REALES</span>
            <h2 className={styles.sectionTitle}>
              Lo que cambia en tu vida desde el día 1
            </h2>
            <p className={styles.sectionSub}>
              Dejá de depender de terceros y empezá a resolver por vos mismo los
              problemas del hogar.
            </p>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                Resolvés vos mismo lo que antes te costaba miles de pesos
              </li>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                Paso a paso simple, sin tecnicismos ni vueltas
              </li>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                No necesitás experiencia previa ni herramientas raras
              </li>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                Sabés cuándo SÍ y cuándo NO llamar a un profesional
              </li>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                Lo tenés en el celular para usar en el momento exacto
              </li>
              <li className={styles.benefitsListItem}>
                <span className={styles.checkIcon}>✓</span>
                Recuperarás lo que pagaste con un solo arreglo
              </li>
            </ul>
          </div>
          <div className={styles.benefitsRight}>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <span className={styles.benefitIcon}>📱</span>
                <h3 className={styles.benefitCardTitle}>Listo para celular</h3>
                <p className={styles.benefitCardText}>Lo abrís donde estés, en el momento exacto.</p>
              </div>
              <div className={styles.benefitCard}>
                <span className={styles.benefitIcon}>🔄</span>
                <h3 className={styles.benefitCardTitle}>Actualizaciones gratis</h3>
                <p className={styles.benefitCardText}>Recibís todas las actualizaciones de por vida.</p>
              </div>
              <div className={styles.benefitCard}>
                <span className={styles.benefitIcon}>🛡</span>
                <h3 className={styles.benefitCardTitle}>Tips de seguridad</h3>
                <p className={styles.benefitCardText}>En cada capítulo, priorizamos tu seguridad.</p>
              </div>
              <div className={styles.benefitCard}>
                <span className={styles.benefitIcon}>🏆</span>
                <h3 className={styles.benefitCardTitle}>Calidad profesional</h3>
                <p className={styles.benefitCardText}>Hecho por expertos con años de experiencia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6 — TESTIMONIOS */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionTagLight}>+1.200 PERSONAS YA LO DESCARGARON</span>
          <h2 className={styles.sectionTitleLight}>Lo que dicen quienes ya están ahorrando</h2>
          <p className={styles.sectionSubLight}>
            Personas como vos que dejaron de pagar técnicos innecesarios.
          </p>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>★★★★★</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialAvatar}>{t.initial}</span>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialLoc}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 7 — GARANTÍA */}
      <section className={styles.guaranteeSection}>
        <div className={styles.sectionInner}>
          <div className={styles.guaranteeCard}>
            <span className={styles.guaranteeIcon}>🛡</span>
            <h2 className={styles.guaranteeTitle}>Garantía de 7 días o te devolvemos el 100%</h2>
            <p className={styles.guaranteeText}>
              Comprás con total confianza. Si dentro de los primeros 7 días considerás
              que el ebook no es para vos, te devolvemos cada peso sin hacer preguntas.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 8 — FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionTag}>PREGUNTAS FRECUENTES</span>
          <h2 className={styles.sectionTitle}>Todo lo que querés saber</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 9 — WHATSAPP */}
      <section className={styles.whatsappSection}>
        <div className={styles.sectionInner}>
          <div className={styles.whatsappCard}>
            <span className={styles.whatsappIcon}>💬</span>
            <div>
              <h2 className={styles.whatsappTitle}>¿Tenés dudas antes de comprar?</h2>
              <p className={styles.whatsappText}>Respondemos todas tus consultas en WhatsApp</p>
            </div>
            <a href="https://wa.me/5492601234567" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
              Escribime por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN 10 — CTA FINAL */}
      <section className={styles.ctaFinalSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaFinalCard}>
            <span className={styles.ctaFinalBadge}>ÚLTIMA OPORTUNIDAD AL 50% OFF</span>
            <h2 className={styles.ctaFinalTitle}>
              Llevátelo hoy y empezá a ahorrar mañana
            </h2>
            <p className={styles.ctaFinalSub}>
              No dejes pasar esta oferta. Más de 1.200 personas ya están ahorrando
              con esta guía.
            </p>
            <div className={styles.ctaFinalPrice}>
              <span className={styles.priceCurrent}>$2.999</span>
              <span className={styles.priceOriginal}>$5.999</span>
              <span className={styles.discountBadge}>-50%</span>
            </div>
            <a href={hotmartUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              QUIERO EL EBOOK AHORA — $2.999
            </a>
            <div className={styles.heroTrust}>
              <span>Pago seguro</span>
              <span>Acceso inmediato</span>
              <span>Garantía 7 días</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
