import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e3a5f',
};

export const metadata: Metadata = {
  title: {
    default: 'Reparaciones Simples del Hogar',
    template: '%s | Reparaciones Simples del Hogar',
  },
  description:
    'Asistente con IA para reparaciones del hogar. Resolvé problemas de plomería, electricidad, gas y humedad paso a paso.',
  openGraph: {
    title: 'Reparaciones Simples del Hogar',
    description:
      'Asistente con IA para reparaciones del hogar. Resolvé problemas de plomería, electricidad, gas y humedad paso a paso.',
    siteName: 'Reparaciones Simples del Hogar',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3023638239005262"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
