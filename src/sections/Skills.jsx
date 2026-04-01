import { useEffect, useRef } from 'react';

// Fallback data if API fails
const DEFAULT_SKILLS = [
  { id: 'skill-1', icon: 'fab fa-html5', title: 'Frontend Development', desc: 'Modern HTML5, CSS3, and JavaScript with frameworks like React, Vue.js, and Angular' },
  { id: 'skill-2', icon: 'fas fa-server', title: 'Backend Development', desc: 'Node.js, Python, and database management with MongoDB, PostgreSQL' },
  { id: 'skill-3', icon: 'fas fa-mobile-alt', title: 'Mobile Development', desc: 'React Native and Flutter for cross-platform mobile applications' },
  { id: 'skill-4', icon: 'fas fa-palette', title: 'UI/UX Design', desc: 'User-centered design principles with Figma, Adobe Creative Suite, and prototyping' },
];

import { useState } from 'react';

export default function Skills() {
  const sectionRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((data) => setSkills(data.skills?.length ? data.skills : DEFAULT_SKILLS))
      .catch(() => setSkills(DEFAULT_SKILLS))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = sectionRef.current?.querySelectorAll('.skill-card') || [];
    cards.forEach((card, i) => {
      card.classList.add('fade-in');
      card.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [loaded, skills]);

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-12px) rotateX(5deg) rotateY(2deg)';
    e.currentTarget.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  };

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Skills &amp; Expertise</h2>
          <p className="section-subtitle">Technologies and tools I use to bring ideas to life</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="skill-card"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="skill-icon"><i className={skill.icon}></i></div>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
