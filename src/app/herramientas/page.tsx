import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Herramientas básicas para el hogar',
  description:
    'Guía de herramientas esenciales para reparaciones del hogar con precios estimados en Argentina. Destornilladores, pinza, martillo y más.',
  openGraph: {
    title: 'Herramientas básicas para el hogar | Reparaciones Simples del Hogar',
    description:
      'Guía de herramientas esenciales para reparaciones del hogar con precios estimados en Argentina.',
  },
};

const tools = [
  {
    name: 'Destornillador Phillips y plano',
    emoji: '🪛',
    desc: 'Juego básico de destornilladores de punta plana y cruz (Phillips). Indispensables para electrodomésticos, enchufes y muebles.',
    use: 'Ajustar manijas, reparar electrodomésticos, cambiar enchufes, armar muebles.',
    prices: { sl: '$1.500–$3.000', cm: '$2.000–$4.000', ba: '$2.500–$5.000' },
  },
  {
    name: 'Pinza universal',
    emoji: '🔧',
    desc: 'Pinza multiuso con mordaza ajustable y cortador lateral. Sirve para sujetar, doblar y cortar cables.',
    use: 'Cortar cables, sujetar tuercas, doblar alambres, sacar clavos.',
    prices: { sl: '$2.000–$3.500', cm: '$2.500–$4.500', ba: '$3.000–$6.000' },
  },
  {
    name: 'Martillo',
    emoji: '🔨',
    desc: 'Martillo de uña de 450g aprox. Para clavar y extraer clavos en carpintería liviana y reparaciones generales.',
    use: 'Clavar cuadros, reparar cercas, carpintería básica, demoliciones menores.',
    prices: { sl: '$1.800–$3.000', cm: '$2.200–$4.000', ba: '$2.500–$5.000' },
  },
  {
    name: 'Cinta métrica',
    emoji: '📏',
    desc: 'Flexómetro de 5 metros con freno. Para medir espacios, muebles y materiales con precisión.',
    use: 'Medir ambientes, calcular materiales, verificar dimensiones de muebles.',
    prices: { sl: '$800–$1.500', cm: '$1.000–$2.000', ba: '$1.200–$2.500' },
  },
  {
    name: 'Llave inglesa ajustable',
    emoji: '🔧',
    desc: 'Llave de boca ajustable de 10 pulgadas. Aprieta y afloja tuercas de diferentes tamaños.',
    use: 'Reparar canillas, ajustar conexiones de plomería, trabajar con muebles metálicos.',
    prices: { sl: '$2.500–$4.000', cm: '$3.000–$5.000', ba: '$3.500–$6.500' },
  },
  {
    name: 'Nivel de burbuja',
    emoji: '📐',
    desc: 'Nivel de burbuja de 60cm con imán. Para asegurar instalaciones perfectamente niveladas.',
    use: 'Colgar estantes, instalar muebles de cocina, nivelar electrodomésticos.',
    prices: { sl: '$1.500–$2.500', cm: '$1.800–$3.500', ba: '$2.000–$4.000' },
  },
  {
    name: 'Taladro eléctrico',
    emoji: '🛠️',
    desc: 'Taladro eléctrico o inalámbrico de 12V con juego de mechas. Para perforar paredes y materiales.',
    use: 'Colgar estantes, instalar cortinas, perforar paredes para bachas o muebles.',
    prices: { sl: '$8.000–$15.000', cm: '$10.000–$20.000', ba: '$12.000–$25.000' },
  },
  {
    name: 'Sellador/silicona',
    emoji: '🧴',
    desc: 'Pistola aplicadora de silicona y tubos selladores. Para sellar juntas y fisuras.',
    use: 'Sellar grietas en paredes, juntas de baño y cocina, filtrar ventanas.',
    prices: { sl: '$2.000–$4.000', cm: '$2.500–$5.000', ba: '$3.000–$6.000' },
  },
  {
    name: 'Multímetro digital',
    emoji: '⚡',
    desc: 'Multímetro digital básico para medir voltaje, corriente y continuidad. Esencial para diagnóstico eléctrico.',
    use: 'Verificar tensión en enchufes, probar continuidad de cables, diagnosticar electrodomésticos.',
    prices: { sl: '$4.000–$7.000', cm: '$5.000–$9.000', ba: '$6.000–$12.000' },
  },
  {
    name: 'Sopapa/destapador',
    emoji: '🚽',
    desc: 'Sopapa de goma clásica para destapar inodoros y bachas.',
    use: 'Destapar inodoros, bachas de cocina, lavatorios y desagües de ducha.',
    prices: { sl: '$800–$1.500', cm: '$1.000–$2.000', ba: '$1.200–$2.500' },
  },
];

export default function HerramientasPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Herramientas básicas para el hogar</h1>
        <p className={styles.subtitle}>
          Las herramientas esenciales para resolver lo más común sin llamar a un
          profesional.
        </p>
        <span className={styles.locationBadge}>
          📍 Precios estimados en tu zona (San Luis)
        </span>
      </div>

      <div className={styles.grid}>
        {tools.map((tool) => (
          <div className={styles.card} key={tool.name}>
            <div className={styles.imagePlaceholder}>{tool.emoji}</div>
            <h2 className={styles.toolName}>{tool.name}</h2>
            <p className={styles.toolDesc}>{tool.desc}</p>
            <div className={styles.sectionTitle}>Cuándo usarla</div>
            <p className={styles.useCase}>{tool.use}</p>
            <div className={styles.sectionTitle}>Precios estimados</div>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>San Luis / Interior</th>
                  <th>Córdoba / Mendoza</th>
                  <th>Buenos Aires</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{tool.prices.sl}</td>
                  <td>{tool.prices.cm}</td>
                  <td>{tool.prices.ba}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <AdBanner />
    </section>
  );
}
