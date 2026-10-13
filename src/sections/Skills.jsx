import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { usePortfolio } from '../lib/data';

function ServiceCard({ skill, index, progress, still }) {
  const fromLeft = index % 2 === 0;
  const distance = window.innerWidth < 640 ? 36 : 90;
  const x = useTransform(progress, [0, 1], [fromLeft ? -distance : distance, 0]);
  const rotate = useTransform(progress, [0, 1], [fromLeft ? -3 : 3, 0]);

  return (
    <motion.div className="service-slot" style={still ? undefined : { x, rotate }}>
      <Reveal as="article" className="service" delay={(index % 2) * 0.08} lift>
        <span className="service-icon" aria-hidden="true"><i className={skill.icon}></i></span>
        <h3>{skill.title}</h3>
        <p>{skill.desc}</p>
      </Reveal>
    </motion.div>
  );
}

export default function Skills() {
  const data = usePortfolio();
  const skills = data?.skills ?? [];
  const gridRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.45'] });

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead
          eyebrow="Services"
          title="What I can help you with."
          intro="The disciplines and tools I use to take a product from idea to launch."
        />

        <div className="service-grid" ref={gridRef}>
          {skills.map((s, i) => (
            <ServiceCard key={s.id} skill={s} index={i} progress={scrollYProgress} still={still} />
          ))}
        </div>
      </div>
    </section>
  );
}
