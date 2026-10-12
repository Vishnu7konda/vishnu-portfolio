import { useRef } from 'react';
import { useReveal, stagger } from '../lib/motion';

const STATS = [
  { value: '3',  label: 'Projects' },
  { value: '1+', label: 'Year Exp' },
];

export default function About() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">About me</span>
          <h2 className="section-title">
            Building products that <span className="gradient-text">solve real problems</span>
          </h2>
        </div>

        <div className="about-content">
          <div className="about-image reveal">
            <div className="image-frame">
              <img src="/WhatsApp Image 2026-01-13 at 11.03.18 AM.jpeg" alt="Vishnu Konda" loading="lazy" />
              <div className="image-badge">
                <i className="fas fa-location-dot"></i>
                <span>
                  <small>Based in</small>
                  Hyderabad, India
                </span>
              </div>
            </div>
          </div>

          <div className="about-text reveal" style={stagger(1)}>
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
              {STATS.map((s, i) => (
                <div className="stat-item reveal" style={stagger(i + 2)} key={s.label}>
                  <span className="stat-number gradient-text">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
