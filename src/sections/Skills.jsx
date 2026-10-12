import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { usePortfolio } from '../lib/data';

export default function Skills() {
  const data = usePortfolio();
  const skills = data?.skills ?? [];

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead
          eyebrow="Services"
          title="What I can help you with."
          intro="The disciplines and tools I use to take a product from idea to launch."
        />

        <div className="service-grid">
          {skills.map((s, i) => (
            <Reveal as="article" key={s.id} className="service" delay={i * 0.1} lift>
              <span className="service-icon" aria-hidden="true"><i className={s.icon}></i></span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
