import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal, { Counter } from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { usePortfolio } from '../lib/data';
import { TECH } from '../data/defaults';

const techCount = (projects) =>
  new Set(projects.flatMap((p) => p.tech || []).map((t) => t.toLowerCase().replace(/[\s.]/g, ''))).size;

function FloatingStat({ stat, index, progress, still }) {
  const y = useTransform(progress, [0, 1], [50 + index * 45, 0]);
  return (
    <motion.div style={still ? undefined : { y }}>
      <Reveal className="stat" delay={index * 0.1} lift>
        <p className="stat-value"><Counter value={stat.value} suffix={stat.suffix} /></p>
        <p className="stat-label">{stat.label}</p>
      </Reveal>
    </motion.div>
  );
}

export default function About() {
  const data = usePortfolio();
  const projects = data?.projects ?? [];
  const statsRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ['start end', 'start 0.45'] });

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
          scrub
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
            <div className="stats" ref={statsRef}>
              {data && stats.map((s, i) => (
                <FloatingStat key={s.label} stat={s} index={i} progress={scrollYProgress} still={still} />
              ))}
            </div>

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
