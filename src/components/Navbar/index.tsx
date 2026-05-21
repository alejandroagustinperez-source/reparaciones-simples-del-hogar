'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Blog', href: 'https://blog.reparacionessimplesdelhogar.com.ar', external: true },
  { label: 'Herramientas', href: '/herramientas' },
  { label: 'Ebook', href: '/ebook' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Planes para Profesionales', href: '/profesionales' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLinkClick = () => {
    closeMenu();
  };

  const handleExternalLink = (href: string) => {
    window.open(href, '_self');
    closeMenu();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={handleLinkClick}>
          <span className={styles.logoIcon}>🔧</span>
          Reparaciones Simples del Hogar
        </Link>

        <ul className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  className={styles.link}
                  target="_self"
                >
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className={styles.socialIcons}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Facebook"
          >
            f
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Instagram"
          >
            Ig
          </a>
        </div>

        <Link href="/" className={styles.ctaButton}>
          ✨ Probar asistente IA
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {mounted && menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                target="_self"
                onClick={() => handleExternalLink(link.href)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileLink}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            )
          ))}
          <div className={styles.mobileSocial}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>Ig</a>
          </div>
          <Link href="/" className={styles.mobileCta} onClick={closeMenu}>
            ✨ Probar asistente IA
          </Link>
        </div>
      )}
    </nav>
  );
}
