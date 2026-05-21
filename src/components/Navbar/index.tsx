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

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="currentColor"/>
      <path d="M12.5 5.5H11.25C10.0074 5.5 9 6.50736 9 7.75V9H7V11H9V16H11.5V11H13L13.5 9H11.5V7.75C11.5 7.33579 11.8358 7 12.25 7H13V5.5H12.5Z" fill="white"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="currentColor"/>
      <rect x="4.5" y="4.5" width="11" height="11" rx="3" stroke="white" strokeWidth="1.2"/>
      <circle cx="10" cy="10" r="3" stroke="white" strokeWidth="1.2"/>
      <circle cx="14.5" cy="5.5" r="1.2" fill="white"/>
    </svg>
  );
}

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
            <FacebookIcon />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Instagram"
          >
            <InstagramIcon />
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
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><FacebookIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}><InstagramIcon /></a>
          </div>
          <Link href="/" className={styles.mobileCta} onClick={closeMenu}>
            ✨ Probar asistente IA
          </Link>
        </div>
      )}
    </nav>
  );
}
