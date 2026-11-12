'use client';

import { useEffect } from 'react';

/**
 * Efectos de movimiento globales (sin librerías):
 * - barra de progreso de scroll y marca de "scrolled" en <html>
 * - aparición escalonada de los elementos con data-reveal al hacer scroll
 * - contadores animados para los elementos con data-count
 * Todo se desactiva con prefers-reduced-motion.
 */
export default function MotionEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const bar = document.getElementById('scroll-progress');

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      const h = root.scrollHeight - window.innerHeight;
      if (y > 24) root.setAttribute('data-scrolled', ''); else root.removeAttribute('data-scrolled');
      if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(y / h, 1) : 0})`;
      ticking = false;
    };
    const onScrollRaf = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    };
    window.addEventListener('scroll', onScrollRaf, { passive: true });
    onScroll();

    const cleanups: Array<() => void> = [() => window.removeEventListener('scroll', onScrollRaf)];

    if (!reduce && 'IntersectionObserver' in window) {
      // Reveal: sólo se ocultan los elementos que están debajo de la pantalla; el resto queda visible.
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
            const idx = Math.min(siblings.indexOf(el), 6);
            el.style.transition = 'opacity .7s cubic-bezier(.22,.8,.24,1), transform .7s cubic-bezier(.22,.8,.24,1)';
            el.style.transitionDelay = `${idx * 70}ms`;
            el.classList.remove('reveal-pre');
            io.unobserve(el);
            // devolver las transiciones propias (hover) del elemento
            window.setTimeout(() => {
              el.style.transition = '';
              el.style.transitionDelay = '';
            }, 1300);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > window.innerHeight && r.left < window.innerWidth) {
          el.classList.add('reveal-pre');
          io.observe(el);
        }
      });
      cleanups.push(() => io.disconnect());
    }

    // Contadores
    const fmt = (n: number, prefix: string) => prefix + n.toLocaleString('es-AR');
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            cio.unobserve(el);
            if (reduce) return;
            const to = Number(el.dataset.count);
            const prefix = el.dataset.prefix || '';
            const t0 = performance.now();
            const step = (now: number) => {
              const t = Math.min((now - t0) / 1800, 1);
              el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - t, 3))), prefix);
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
      cleanups.push(() => cio.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div id="scroll-progress" aria-hidden="true" />;
}
