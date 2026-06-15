import Link from 'next/link';
import { productosPorCategoria } from '@/lib/productos-afiliados';

const nombresCategoria: Record<string, string> = {
  plomeria: 'Plomería',
  electricidad: 'Electricidad',
  carpinteria: 'Carpintería',
  pintura: 'Pintura',
  humedad: 'Humedad',
  electrodomesticos: 'Electrodomésticos',
};

export default function CategoriaPage({
  params,
}: {
  params: { categoria: string };
}) {
  const cat = params.categoria;
  const nombre = nombresCategoria[cat] || cat;
  const productos = productosPorCategoria[cat];

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
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/herramientas"
          style={{
            color: '#F97316',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          ← Volver a herramientas
        </Link>
        <h1
          style={{
            fontSize: '1.75rem',
            color: '#1E3A5F',
            margin: '12px 0 0',
          }}
        >
          {nombre}
        </h1>
      </div>

      <style>{`.ml-product-link:hover{background:#e8620f!important}`}</style>

      {productos && productos.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {productos.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-product-link"
              style={{
                display: 'block',
                padding: '14px 20px',
                background: '#F97316',
                color: '#fff',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center',
              }}
            >
              Ver en MercadoLibre &rarr;
              <span
                style={{
                  display: 'block',
                  fontWeight: 400,
                  fontSize: '0.8rem',
                  marginTop: 4,
                  opacity: 0.85,
                }}
              >
                {p.nombre}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af',
          }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>
            🛠️
          </span>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>Próximamente</p>
          <p style={{ fontSize: '0.9rem', margin: '8px 0 0' }}>
            Estamos agregando productos para esta categoría.
          </p>
        </div>
      )}
    </section>
  );
}
