import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Página no encontrada</h2>
      <p className={styles.text}>
        Lo que buscás no existe o fue movido. Pero podemos ayudarte con tu problema del hogar.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.btnOutline}>
          Volver al inicio
        </Link>
        <Link href="/" className={styles.btnOrange}>
          Probar el asistente IA
        </Link>
      </div>
    </div>
  );
}
