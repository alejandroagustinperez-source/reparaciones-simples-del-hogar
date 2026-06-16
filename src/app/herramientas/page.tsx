import Link from "next/link";
import styles from "./herramientas.module.css";
import { Wrench, Zap, Hammer, Paintbrush, Droplets, Monitor } from "lucide-react";

function IconoCategoria({ nombre, color }: { nombre: string; color: string }) {
  const props = { size: 28, color, strokeWidth: 1.8 };
  if (nombre === "plomeria") return <Wrench {...props} />;
  if (nombre === "electricidad") return <Zap {...props} />;
  if (nombre === "carpinteria") return <Hammer {...props} />;
  if (nombre === "pintura") return <Paintbrush {...props} />;
  if (nombre === "humedad") return <Droplets {...props} />;
  if (nombre === "electrodomesticos") return <Monitor {...props} />;
  return null;
}

const categorias = [
  { slug: "plomeria", nombre: "Plomería", descripcion: "Cañerías, canillas e inodoros", productos: 8, bg: "#EFF6FF", color: "#1E3A5F" },
  { slug: "electricidad", nombre: "Electricidad", descripcion: "Llaves, tomacorrientes y cables", productos: 8, bg: "#FFFBEB", color: "#92400E" },
  { slug: "carpinteria", nombre: "Carpintería", descripcion: "Bisagras, lijas y selladores", productos: 9, bg: "#ECFDF5", color: "#065F46" },
  { slug: "pintura", nombre: "Pintura", descripcion: "Rodillos, pinceles y masilla", productos: 8, bg: "#F5F3FF", color: "#7C3AED" },
  { slug: "humedad", nombre: "Humedad", descripcion: "Impermeabilizantes y membranas", productos: 0, bg: "#F0F9FF", color: "#0369A1" },
  { slug: "electrodomesticos", nombre: "Electrodomésticos", descripcion: "Repuestos y accesorios", productos: 0, bg: "#FFF1F2", color: "#9F1239" },
];

const stats = [
  { valor: "+8", label: "Productos" },
  { valor: "6", label: "Categorías" },
  { valor: "★ 4.0", label: "Calificación" },
];

export default function HerramientasPage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <span className={styles.heroBadge}>Tienda de herramientas</span>
        <h1 className={styles.heroTitle}>Todo lo que necesitás para<br />reparar tu hogar</h1>
        <p className={styles.heroSubtitle}>Productos seleccionados con los mejores precios en MercadoLibre</p>
        <div className={styles.heroStats}>
          {stats.map((s) => (
            <div key={s.label}>
              <p className={styles.statValor}>{s.valor}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Explorá por categoría</h2>
        <p className={styles.sectionSubtitle}>Seleccioná la categoría que necesitás y encontrá el producto ideal</p>

        <div className={styles.grid}>
          {categorias.map((cat) => (
            <Link key={cat.slug} href={`/herramientas/${cat.slug}`} className={styles.card}>
              <div className={styles.cardIcon} style={{ backgroundColor: cat.bg }}>
                <IconoCategoria nombre={cat.slug} color={cat.color} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{cat.nombre}</h3>
                  <span className={styles.cardArrow}>→</span>
                </div>
                <p className={styles.cardDesc}>{cat.descripcion}</p>
                {cat.productos > 0 ? (
                  <div className={styles.badgeDisponible}>
                    <span className={styles.badgeNaranja}>{cat.productos} productos</span>
                    <span className={styles.badgeVerde}>✓ Disponible</span>
                  </div>
                ) : (
                  <span className={styles.badgeGris}>Próximamente</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.bannerEbook}>
          <div>
            <p className={styles.bannerLabel}>Guía completa</p>
            <h3 className={styles.bannerTitle}>Aprendé a reparar tu casa<br />sin llamar a nadie</h3>
            <p className={styles.bannerDesc}>Más de 50 reparaciones explicadas paso a paso. Ahorrá miles de pesos al año.</p>
            <Link href="/ebook" className={styles.bannerBtn}>Descargar Ebook →</Link>
          </div>
          <img src="/banner-ebook.png" alt="Ebook" className={styles.bannerImg} />
        </div>
      </div>
    </main>
  );
}
