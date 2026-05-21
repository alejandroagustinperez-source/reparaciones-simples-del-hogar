import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>🔧 Reparaciones Simples del Hogar</div>
          <p className={styles.description}>
            Asistente con inteligencia artificial para ayudarte a resolver problemas comunes
            del hogar. Electricidad, plomería, gas y humedad, explicado paso a paso.
          </p>
          <div className={styles.social}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">Ig</a>
          </div>
        </div>

        <div>
          <ul className={styles.links}>
            <li className={styles.linkTitle}>Páginas</li>
            <li><Link href="/" className={styles.link}>Inicio</Link></li>
            <li><a href="https://blog.reparacionessimplesdelhogar.com.ar" className={styles.link} target="_self">Blog</a></li>
            <li><Link href="/herramientas" className={styles.link}>Herramientas</Link></li>
            <li><Link href="/ebook" className={styles.link}>Ebook</Link></li>
            <li><Link href="/contacto" className={styles.link}>Contacto</Link></li>
            <li><Link href="/profesionales" className={styles.link}>Planes para Profesionales</Link></li>
          </ul>
        </div>

        <div>
          <ul className={styles.links}>
            <li className={styles.linkTitle}>Información</li>
            <li><Link href="/politica-de-privacidad" className={styles.link}>Política de Privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        © 2025 Reparaciones Simples del Hogar. Todos los derechos reservados.
      </div>
    </footer>
  );
}
