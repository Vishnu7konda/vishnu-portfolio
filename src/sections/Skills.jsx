import { useEffect, useRef, useState } from 'react';
import { useReveal, trackSpotlight, stagger } from '../lib/motion';

const DEFAULT_SKILLS = [
  { id: 'skill-1', icon: 'fab fa-html5', title: 'Frontend Development', desc: 'Modern HTML5, CSS3, and JavaScript with frameworks like React, Vue.js, and Angular' },
  { id: 'skill-2', icon: 'fas fa-server', title: 'Backend Development', desc: 'Node.js, Python, and database management with MongoDB, PostgreSQL' },
  { id: 'skill-3', icon: 'fas fa-mobile-alt', title: 'Mobile Development', desc: 'React Native and Flutter for cross-platform mobile applications' },
  { id: 'skill-4', icon: 'fas fa-palette', title: 'UI/UX Design', desc: 'User-centered design principles with Figma, Adobe Creative Suite, and prototyping' },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((data) => setSkills(data.skills?.length ? data.skills : DEFAULT_SKILLS))
      .catch(() => setSkills(DEFAULT_SKILLS));
  }, []);

  useReveal(sectionRef, [skills]);

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header center reveal">
          <span className="eyebrow">Skills &amp; Expertise</span>
          <h2 className="section-title">
            What I <span className="gradient-text">bring to the table</span>
          </h2>
          <p className="section-subtitle">Technologies and tools I use to bring ideas to life</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill, i) => (
            <article
              key={skill.id}
              className="card spotlight skill-card reveal"
              style={stagger(i)}
              onMouseMove={trackSpotlight}
            >
              <span className="skill-index">{String(i + 1).padStart(2, '0')}</span>
              <div className="skill-icon"><i className={skill.icon}></i></div>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
