import { useRef } from 'react';
import { useReveal, stagger, pad } from '../lib/motion';

const PRINCIPLES = [
  { title: 'Visually considered', desc: 'Interfaces that feel intentional, clear and easy to use.' },
  { title: 'Fast',                desc: 'Lean builds and quick load times on every device.' },
  { title: 'Secure',              desc: 'Sensible defaults and careful handling of user data.' },
  { title: 'Practical',           desc: 'Solutions shaped around how people actually work.' },
];

export default function About() {
  const sectionRef = useRef(null);
  useReveal(sectionRef);

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container section-grid">
        <p className="section-label mono reveal"><b>02</b>About</p>
        <div className="section-body">
          <h2 className="section-title reveal">
            Creative developer and startup builder.{' '}
            <span className="muted">Design-minded, engineering-driven.</span>
          </h2>

          <div className="about-grid">
            <figure className="about-photo reveal">
              <img src="/WhatsApp Image 2026-01-13 at 11.03.18 AM.jpeg" alt="Portrait of Vishnu Konda" loading="lazy" />
              <figcaption className="mono">
                <span>Vishnu Konda</span>
                <span>Hyderabad, IN</span>
              </figcaption>
            </figure>

            <div className="about-text reveal" style={stagger(1)}>
              <p className="lead">
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

              <ul className="principles">
                {PRINCIPLES.map((p, i) => (
                  <li key={p.title} className="principle">
                    <span className="mono">{pad(i + 1)}</span>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
