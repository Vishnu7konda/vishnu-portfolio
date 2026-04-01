import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    const handleMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      dot.style.left = `${posX}px`;
      dot.style.top = `${posY}px`;
      outline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 300, fill: 'forwards' }
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-outline" ref={outlineRef}></div>
    </>
  );
}
