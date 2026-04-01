import { useEffect, useRef } from 'react';

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  const heroContentRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    const t = setTimeout(() => {
      el.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // Parallax shapes on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      document.querySelectorAll('.floating-shape').forEach((shape, index) => {
        const speed = 0.3 + index * 0.1;
        const rotation = scrolled * 0.05;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-content" ref={heroContentRef}>
        <div className="floating-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <h1 className="hero-title">
          <span className="text-line">Hello, I'm</span>
          <span className="text-line main-name">Vishnu Konda</span>
          <span className="text-line">Creative Developer</span>
        </h1>
        <p className="hero-subtitle">
          Crafting exceptional digital experiences through innovative design and cutting-edge technology
        </p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => scrollTo('projects')}
          >
            <i className="fas fa-rocket"></i>
            View My Work
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollTo('contact')}
          >
            <i className="fas fa-paper-plane"></i>
            Get In Touch
          </button>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
