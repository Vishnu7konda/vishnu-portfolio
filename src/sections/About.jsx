import { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const els = sectionRef.current?.querySelectorAll('.fade-in') || [];
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            Driven to build digital products that solve real problems and create real impact
          </p>
        </div>
        <div className="about-content">
          <div className="about-image fade-in">
            <div className="image-frame">
              <img src="/WhatsApp Image 2026-01-13 at 11.03.18 AM.jpeg" alt="Vishnu Konda" />
              <div className="image-overlay"></div>
            </div>
          </div>
          <div className="about-text fade-in">
            <h3>Creative Developer &amp; Startup Builder</h3>
            <p>
              With 1+ year of experience in web development and product design, I specialize
              in building clean, functional, and user-focused digital experiences. I'm passionate
              about writing scalable code, crafting smooth UI, and turning real-world problems
              into powerful web platforms.
            </p>
            <p>
              My approach blends technical skills with creative thinking — ensuring every project
              is not only visually appealing, but also fast, secure, and practical. I enjoy
              exploring emerging technologies and constantly improving my skills to stay ahead
              in the tech world.
            </p>
            <div className="stats">
              <div className="stat-item fade-in">
                <span className="stat-number">3</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item fade-in">
                <span className="stat-number">1</span>
                <span className="stat-label">Year Exp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
