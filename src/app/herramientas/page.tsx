'use client';

import Link from 'next/link';

const categorias = [
  { emoji: '🔧', nombre: 'Plomería', slug: 'plomeria' },
  { emoji: '⚡', nombre: 'Electricidad', slug: 'electricidad' },
  { emoji: '🪚', nombre: 'Carpintería', slug: 'carpinteria' },
  { emoji: '🎨', nombre: 'Pintura', slug: 'pintura' },
  { emoji: '💧', nombre: 'Humedad', slug: 'humedad' },
  { emoji: '🏠', nombre: 'Electrodomésticos', slug: 'electrodomesticos' },
];

export default function HerramientasPage() {
  return (
    <section
      style={{
        padding: '40px 16px',
        maxWidth: 900,
        margin: '0 auto',
        background: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1
          style={{
            fontSize: '1.75rem',
            color: '#1E3A5F',
            margin: '0 0 8px',
          }}
        >
          Herramientas para el hogar
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
          Todo lo que necesitás para tus reparaciones, con los mejores precios
          en MercadoLibre
        </p>
      </div>

      <div
        className="herramientas-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {categorias.map((cat) => (
          <Link
            key={cat.slug}
            href={`/herramientas/${cat.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 32,
              background: '#fff',
              borderRadius: 16,
              textDecoration: 'none',
              border: '1px solid #e5e7eb',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#F97316';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <span style={{ fontSize: '2.5rem' }}>{cat.emoji}</span>
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1E3A5F',
              }}
            >
              {cat.nombre}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .herramientas-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
