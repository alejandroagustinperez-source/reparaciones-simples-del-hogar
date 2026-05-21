import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de Reparaciones Simples del Hogar. Conocé cómo manejamos tus datos personales.',
  openGraph: {
    title: 'Política de Privacidad | Reparaciones Simples del Hogar',
    description:
      'Política de privacidad de Reparaciones Simples del Hogar.',
  },
};

export default function PrivacidadPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Política de Privacidad</h1>
      <p className={styles.updated}>Última actualización: enero 2025</p>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quiénes somos</h2>
          <p>
            Reparaciones Simples del Hogar es un sitio web argentino operado en{' '}
            <strong>reparacionessimplesdelhogar.com.ar</strong>. Brindamos
            asistencia gratuita mediante inteligencia artificial para problemas
            comunes del hogar.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Qué datos recopilamos</h2>
          <ul>
            <li>
              <strong>Datos del formulario de contacto:</strong> nombre,
              dirección de email y mensaje que nos enviés voluntariamente.
            </li>
            <li>
              <strong>Datos de navegación anónimos:</strong> a través de Google
              Analytics y Google AdSense, como páginas visitadas, tiempo de
              sesión y datos agregados de tráfico.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cómo usamos los datos</h2>
          <p>
            Utilizamos tus datos para responder tus consultas, mejorar nuestros
            servicios y mostrar publicidad relevante mediante Google AdSense
            (ca-pub-3023638239005262). No compartimos tu información personal
            con terceros no mencionados en esta política.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookies</h2>
          <p>
            Este sitio utiliza cookies de Google AdSense y Google Analytics para
            personalizar anuncios y analizar el tráfico. Podés desactivar las
            cookies desde la configuración de tu navegador en cualquier momento.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Terceros</h2>
          <p>
            Google AdSense puede mostrar anuncios basados en visitas anteriores
            a este sitio web. Más información en{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              policies.google.com/privacy
            </a>
            .
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Derechos del usuario</h2>
          <p>
            Podés solicitar la eliminación de tus datos personales en cualquier
            momento escribiéndonos a través de nuestro{' '}
            <a href="/contacto" className={styles.link}>
              formulario de contacto
            </a>
            .
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Ley aplicable</h2>
          <p>
            Esta política se rige por la legislación argentina. Si tenés
            preguntas sobre nuestra política de privacidad, contactanos a través
            de nuestro formulario.
          </p>
        </div>
      </div>
    </section>
  );
}
