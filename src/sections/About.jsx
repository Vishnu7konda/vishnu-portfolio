import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { FadeIn } from '../components/Anim';
import { usePortfolio } from '../lib/data';
import { EASE } from '../lib/hooks';

const STATEMENT =
  "I'm a *creative* developer and startup builder from Hyderabad. I turn *real-world* problems into clean, fast and practical web products — blending technical skill with creative thinking.";

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const em = word.startsWith('*') && word.endsWith('*');
  return (
    <>
      <motion.span className={em ? 'serif' : undefined} style={{ opacity }}>
        {em ? word.slice(1, -1) : word}
      </motion.span>{' '}
    </>
  );
}

function ScrollStatement({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="about-statement">
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setValue(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const techCount = (projects) =>
  new Set(projects.flatMap((p) => p.tech || []).map((t) => t.toLowerCase().replace(/[\s.]/g, ''))).size;

export default function About() {
  const data = usePortfolio();
  const projects = data?.projects ?? [];

  const stats = [
    { value: projects.length, label: 'Projects shipped' },
    { value: 1, suffix: '+', label: 'Year of experience' },
    { value: techCount(projects), label: 'Technologies used' },
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <FadeIn className="eyebrow-row">
          <span className="mono">( About )</span>
          <span className="mono">Who I am</span>
        </FadeIn>

        <ScrollStatement text={STATEMENT} />

        <div className="about-grid">
          <FadeIn className="about-copy">
            <p>
              With 1+ year of experience in web development and product design, I specialize in
              building clean, functional, and user-focused digital experiences. I'm passionate about
              writing scalable code, crafting smooth UI, and turning real-world problems into
              powerful web platforms.
            </p>
            <p>
              My approach ensures every project is not only visually appealing, but also fast,
              secure, and practical. I enjoy exploring emerging technologies and constantly
              improving my skills to stay ahead in the tech world.
            </p>
          </FadeIn>

          <dl className="stats">
            {data && stats.map((s, i) => (
              <FadeIn key={s.label} className="stat" delay={i * 0.1}>
                <dd className="stat-value"><Counter to={s.value} suffix={s.suffix} /></dd>
                <dt className="mono">{s.label}</dt>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
