import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Planes para Profesionales',
  description:
    'Sumate y recibí clientes reales. Planes destacado y PRO para profesionales de reparaciones del hogar. Sin permanencia.',
  openGraph: {
    title: 'Planes para Profesionales | Reparaciones Simples del Hogar',
    description:
      'Sumate y recibí clientes reales. Planes destacado y PRO para profesionales de reparaciones del hogar.',
  },
};

export default function ProfesionalesPage() {
  return (
    <section id="planes" className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>✨ Sos profesional</div>
        <h1 className={styles.title}>
          Sumate y recibí <span className={styles.orangeText}>clientes reales</span>
        </h1>
        <p className={styles.subtitle}>
          Elegí el plan que mejor se adapta a vos. Pago seguro con Mercado
          Pago, sin permanencia.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardFeatured}`}>
          <div>
            <span className={`${styles.planBadge} ${styles.planBadgeOrange}`}>
              MÁS ELEGIDO
            </span>
            <h2 className={styles.planName}>Plan Destacado</h2>
            <p className={styles.planPrice}>
              <span className={styles.priceAmount}>$2.500</span>/mes
            </p>
          </div>
          <ul className={styles.features}>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Perfil destacado en tu rubro y zona
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Badge &quot;Destacado&quot; visible
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Botón de WhatsApp directo
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Hasta 3 categorías de servicio
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Sin permanencia
            </li>
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_MP_DESTACADO_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.buttonOrange}`}
          >
            Comprar Plan Destacado →
          </a>
        </div>

        <div className={`${styles.card} ${styles.cardPro}`}>
          <div>
            <span className={`${styles.planBadge} ${styles.planBadgeNavy}`}>
              PRO
            </span>
            <h2 className={styles.planName}>Plan PRO</h2>
            <p className={styles.planPrice}>
              <span className={styles.priceAmount}>$5.000</span>/mes
            </p>
          </div>
          <ul className={styles.features}>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Todo lo del plan Destacado
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Posicionamiento prioritario
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Estadísticas mensuales de visitas y contactos
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Aparición en artículos del blog
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Badge &quot;PRO&quot; de máxima confianza
            </li>
            <li className={styles.featureItem}>
              <span className={styles.check}>✓</span>
              Soporte prioritario
            </li>
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_MP_PRO_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.buttonOrange}`}
          >
            Comprar Plan PRO →
          </a>
        </div>
      </div>

      <p className={styles.footerNote}>
        ¿Dudas? Escribinos al{' '}
        <a href="tel:+5492665066606" className={styles.footerLink}>
          +54 9 266 506-6606
        </a>
      </p>
    </section>
  );
}
