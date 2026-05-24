'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';

const tools = [
  {
    name: 'Destornillador Phillips y plano',
    emoji: '🪛',
    image: '/herramientas/destornillador.png',
    desc: 'Juego básico de destornilladores de punta plana y cruz (Phillips). Indispensables para electrodomésticos, enchufes y muebles.',
    use: 'Ajustar manijas, reparar electrodomésticos, cambiar enchufes, armar muebles.',
    prices: { sl: '$1.500–$3.000', cm: '$2.000–$4.000', ba: '$2.500–$5.000' },
  },
  {
    name: 'Pinza universal',
    emoji: '🔧',
    image: '/herramientas/pinza.png',
    desc: 'Pinza multiuso con mordaza ajustable y cortador lateral. Sirve para sujetar, doblar y cortar cables.',
    use: 'Cortar cables, sujetar tuercas, doblar alambres, sacar clavos.',
    prices: { sl: '$2.000–$3.500', cm: '$2.500–$4.500', ba: '$3.000–$6.000' },
  },
  {
    name: 'Martillo',
    emoji: '🔨',
    image: '/herramientas/martillo.png',
    desc: 'Martillo de uña de 450g aprox. Para clavar y extraer clavos en carpintería liviana y reparaciones generales.',
    use: 'Clavar cuadros, reparar cercas, carpintería básica, demoliciones menores.',
    prices: { sl: '$1.800–$3.000', cm: '$2.200–$4.000', ba: '$2.500–$5.000' },
  },
  {
    name: 'Cinta métrica',
    emoji: '📏',
    image: '/herramientas/cinta.png',
    desc: 'Flexómetro de 5 metros con freno. Para medir espacios, muebles y materiales con precisión.',
    use: 'Medir ambientes, calcular materiales, verificar dimensiones de muebles.',
    prices: { sl: '$800–$1.500', cm: '$1.000–$2.000', ba: '$1.200–$2.500' },
  },
  {
    name: 'Llave inglesa ajustable',
    emoji: '🔧',
    image: '/herramientas/llave.png',
    desc: 'Llave de boca ajustable de 10 pulgadas. Aprieta y afloja tuercas de diferentes tamaños.',
    use: 'Reparar canillas, ajustar conexiones de plomería, trabajar con muebles metálicos.',
    prices: { sl: '$2.500–$4.000', cm: '$3.000–$5.000', ba: '$3.500–$6.500' },
  },
  {
    name: 'Multímetro digital',
    emoji: '⚡',
    image: '/herramientas/tester.png',
    desc: 'Multímetro digital básico para medir voltaje, corriente y continuidad. Esencial para diagnóstico eléctrico.',
    use: 'Verificar tensión en enchufes, probar continuidad de cables, diagnosticar electrodomésticos.',
    prices: { sl: '$4.000–$7.000', cm: '$5.000–$9.000', ba: '$6.000–$12.000' },
  },
  {
    name: 'Llave Stillson / para caño',
    emoji: '🔧',
    image: '/herramientas/stillson.png',
    desc: 'Llave Stillson ajustable para tubos y caños. Ideal para plomería y conexiones de gas.',
    use: 'Aflojar caños, desmontar conexiones de plomería, trabajar con tuberías.',
    prices: { sl: '$3.000–$5.000', cm: '$3.500–$6.000', ba: '$4.500–$8.000' },
  },
  {
    name: 'Cinta de teflón',
    emoji: '🧻',
    image: '/herramientas/teflon.png',
    desc: 'Cinta selladora de roscas para plomería y gas. Evita pérdidas en conexiones roscadas.',
    use: 'Sellar uniones de caños, conexiones de canillas, roscas de gas.',
    prices: { sl: '$300–$600', cm: '$400–$800', ba: '$500–$1.000' },
  },
  {
    name: 'Pelacables',
    emoji: '⚡',
    image: '/herramientas/pelacables.png',
    desc: 'Pinza pelacables automática con corte y crimpado. Para trabajos eléctricos seguros.',
    use: 'Pelar cables eléctricos, crimpar terminales, cortar cables finos.',
    prices: { sl: '$1.500–$3.000', cm: '$2.000–$4.000', ba: '$2.500–$5.000' },
  },
  {
    name: 'Nivel de burbuja',
    emoji: '📐',
    image: '/herramientas/nivel.png',
    desc: 'Nivel de burbuja de 60cm con imán. Para asegurar instalaciones perfectamente niveladas.',
    use: 'Colgar estantes, instalar muebles de cocina, nivelar electrodomésticos.',
    prices: { sl: '$1.500–$2.500', cm: '$1.800–$3.500', ba: '$2.000–$4.000' },
  },
  {
    name: 'Taladro eléctrico',
    emoji: '🛠️',
    image: '/herramientas/taladro.png',
    desc: 'Taladro eléctrico o inalámbrico de 12V con juego de mechas. Para perforar paredes y materiales.',
    use: 'Colgar estantes, instalar cortinas, perforar paredes para bachas o muebles.',
    prices: { sl: '$8.000–$15.000', cm: '$10.000–$20.000', ba: '$12.000–$25.000' },
  },
  {
    name: 'Sellador/silicona',
    emoji: '🔫',
    image: '/herramientas/sellador.png',
    desc: 'Pistola aplicadora de silicona y tubos selladores. Para sellar juntas y fisuras.',
    use: 'Sellar grietas en paredes, juntas de baño y cocina, filtrar ventanas.',
    prices: { sl: '$2.000–$4.000', cm: '$2.500–$5.000', ba: '$3.000–$6.000' },
  },
  {
    name: 'Sopapa/destapador',
    emoji: '🪠',
    image: '/herramientas/sopapa.png',
    desc: 'Sopapa de goma clásica para destapar inodoros y bachas.',
    use: 'Destapar inodoros, bachas de cocina, lavatorios y desagües de ducha.',
    prices: { sl: '$800–$1.500', cm: '$1.000–$2.000', ba: '$1.200–$2.500' },
  },
];

export default function HerramientasPage() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const loc = [data.city, data.region].filter(Boolean).join(' · ');
        setLocation(loc || 'Argentina');
      })
      .catch(() => setLocation('Argentina'));
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Herramientas básicas para el hogar</h1>
        <p className={styles.subtitle}>
          Las herramientas esenciales para resolver lo más común sin llamar a un
          profesional.
        </p>
        <span className={styles.locationBadge}>
          📍 Precios estimados en tu zona ({location || 'San Luis'})
        </span>
      </div>

      <div className={styles.grid}>
        {tools.map((tool) => (
          <div className={styles.card} key={tool.name}>
            <div className={styles.imageBox}>
              {tool.image ? (
                <Image
                  src={tool.image}
                  alt={tool.name}
                  width={300}
                  height={200}
                  loading="lazy"
                  className={styles.toolImage}
                />
              ) : (
                <span className={styles.toolEmoji}>{tool.emoji}</span>
              )}
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.toolName}>{tool.name}</h2>
              <p className={styles.toolDesc}>{tool.desc}</p>
              <span className={styles.useBadge}>CUÁNDO USARLA</span>
              <p className={styles.useCase}>{tool.use}</p>

              <div className={styles.divider} />

              <span className={styles.priceLabel}>PRECIO EN TU ZONA</span>
              <div className={styles.priceHighlight}>
                <span>📍 {location || 'Tu zona'}</span>
                <span className={styles.priceValue}>{tool.prices.sl}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Córdoba / Mendoza</span>
                <span>{tool.prices.cm}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Buenos Aires</span>
                <span>{tool.prices.ba}</span>
              </div>
              <p className={styles.priceFootnote}>
                Los precios pueden variar según la tienda
              </p>
            </div>
          </div>
        ))}
      </div>

      <AdBanner />
    </section>
  );
}
