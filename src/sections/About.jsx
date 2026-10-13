import Reveal, { Counter } from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { usePortfolio } from '../lib/data';
import { TECH } from '../data/defaults';

const techCount = (projects) =>
  new Set(projects.flatMap((p) => p.tech || []).map((t) => t.toLowerCase().replace(/[\s.]/g, ''))).size;

export default function About() {
  const data = usePortfolio();
  const projects = data?.projects ?? [];

  const stats = [
    { value: projects.length, label: 'Projects shipped' },
    { value: 2, suffix: '+', label: 'Years of experience' },
    { value: techCount(projects), label: 'Technologies used' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead
          eyebrow="About"
          title="Turning real-world problems into clean, practical products."
        />

        <div className="about-grid">
          <div className="about-copy">
            <Reveal as="p">
              With 2+ years of experience in web development and product design, I specialize in
              building clean, functional, and user-focused digital experiences. I'm passionate about
              writing scalable code, crafting smooth UI, and turning real-world problems into
              powerful web platforms.
            </Reveal>
            <Reveal as="p" delay={0.1}>
              My approach blends technical skills with creative thinking — ensuring every project is
              not only visually appealing, but also fast, secure, and practical. I enjoy exploring
              emerging technologies and constantly improving my skills to stay ahead in the tech world.
            </Reveal>
          </div>

          <div className="about-side">
            <dl className="stats">
              {data && stats.map((s, i) => (
                <Reveal key={s.label} className="stat" delay={i * 0.1} lift>
                  <dd><Counter value={s.value} suffix={s.suffix} /></dd>
                  <dt>{s.label}</dt>
                </Reveal>
              ))}
            </dl>

            <div>
              <Reveal as="p" className="label" blur={false} y={8}>Tech stack</Reveal>
              <ul className="chips">
                {TECH.map((t, i) => (
                  <Reveal as="li" key={t} className="chip" blur={false} y={10} delay={0.1 + i * 0.035}>
                    {t}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
