import { useEffect } from 'react';

export function useReveal(ref, deps = []) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal:not(.visible)') || [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}

export const stagger = (i, step = 80) => ({ '--d': `${i * step}ms` });

export const pad = (n) => String(n).padStart(2, '0');
