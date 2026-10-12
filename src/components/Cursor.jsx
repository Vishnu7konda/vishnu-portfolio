import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]';

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    const body = document.body;
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf;

    const place = (el, x, y) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      place(dot, target.x, target.y);
      body.classList.add('cursor-ready');
    };

    const onOver = (e) => {
      body.classList.toggle('cursor-hover', !!e.target.closest?.(INTERACTIVE));
    };

    const onLeave = () => body.classList.remove('cursor-ready');

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      place(outline, ring.x, ring.y);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      body.classList.remove('cursor-ready', 'cursor-hover');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true"></div>
      <div className="cursor-outline" ref={outlineRef} aria-hidden="true"></div>
    </>
  );
}
