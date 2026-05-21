import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Ebook - Reparaciones del Hogar',
  description:
    'Dejá de gastar miles en técnicos. La guía simple para resolver problemas de plomería, electricidad, gas y humedad sin experiencia previa. 50% OFF hoy.',
  openGraph: {
    title: 'Ebook - Reparaciones del Hogar | Reparaciones Simples del Hogar',
    description:
      'Dejá de gastar miles en técnicos. La guía simple para resolver problemas de plomería, electricidad, gas y humedad sin experiencia previa.',
  },
};

export default function EbookPage() {
  return (
    <>
      <div className={styles.topBar}>
        🔥 OFERTA POR HOY: 50% OFF + Acceso inmediato · Precio promocional por
        tiempo limitado
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Dejá de gastar miles en técnicos: arreglalo vos en minutos
            </h1>
            <p className={styles.subtitle}>
              La guía simple y directa para resolver problemas de plomería,
              electricidad, gas y humedad sin experiencia previa.
            </p>
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.9/5 · +1.200 personas ya lo descargaron</span>
            </div>
            <div className={styles.price}>
              <span className={styles.priceOriginal}>$5.999</span>
              <span className={styles.priceCurrent}>$2.999</span>
              <span className={styles.discountBadge}>-50% HOY</span>
            </div>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeRed}`}>
                50% OFF SOLO POR HOY
              </span>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>
                ⚡ Acceso inmediato
              </span>
              <span className={`${styles.badge} ${styles.badgeYellow}`}>
                ⚠️ Oferta por tiempo limitado
              </span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_HOTMART_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              QUIERO EL EBOOK AHORA
            </a>
            <div className={styles.trustFooter}>
              <span>🔒 Pago 100% seguro</span>
              <span>⬇️ Acceso inmediato</span>
              <span>🔄 Garantía 7 días</span>
            </div>
          </div>
          <div className={styles.imagePlaceholder}>📘</div>
        </div>
      </section>
    </>
  );
}
