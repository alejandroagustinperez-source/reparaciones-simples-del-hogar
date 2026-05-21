import styles from './AdBanner.module.css';

export default function AdBanner() {
  return (
    <div className={styles.banner}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3023638239005262"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span className={styles.text}>Publicidad</span>
    </div>
  );
}
