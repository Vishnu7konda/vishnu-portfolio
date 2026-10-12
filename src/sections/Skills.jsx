import { useEffect, useRef, useState } from 'react';
import { fetchPortfolio } from '../lib/data';
import { useReveal, pad } from '../lib/motion';

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
    fetchPortfolio()
      .then((data) => setSkills(data.skills?.length ? data.skills : DEFAULT_SKILLS))
      .catch(() => setSkills(DEFAULT_SKILLS));
  }, []);

  useReveal(sectionRef, [skills]);

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container section-grid">
        <p className="section-label mono reveal"><b>03</b>Capabilities</p>
        <div className="section-body">
          <h2 className="section-title reveal">
            What I work with. <span className="muted">The disciplines and tools I use to ship products.</span>
          </h2>

          <div className="cap-grid reveal">
            {skills.map((s, i) => (
              <article key={s.id} className="cap">
                <div className="cap-top">
                  <span className="cap-icon" aria-hidden="true"><i className={s.icon}></i></span>
                  <span className="mono">{pad(i + 1)}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
