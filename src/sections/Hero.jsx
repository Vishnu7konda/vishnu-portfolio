import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal, { SplitWords } from '../components/Reveal';
import { ArrowRight } from '../components/Icons';
import { SOCIALS } from '../data/socials';
import { EASE } from '../lib/hooks';

export default function Hero() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const photoOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0.2]);

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="container hero-grid">
        <motion.div className="hero-copy" style={still ? undefined : { y: copyY, opacity: copyOpacity }}>
          <Reveal onLoad delay={0.05} className="status" blur={false}>
            <span className="dot" aria-hidden="true" />
            Based in Hyderabad, India
          </Reveal>

          <SplitWords
            as="h1"
            className="hero-title"
            onLoad
            delay={0.15}
            segments={[
              { text: "Hi, I'm Vishnu Konda.", className: 'nowrap' },
              { text: 'Creative developer & startup builder.', className: 'muted' },
            ]}
          />

          <Reveal onLoad as="p" delay={0.55} className="hero-lead">
            I design and build clean, functional web products that solve real problems —
            from the interface down to the code behind it.
          </Reveal>

          <Reveal onLoad delay={0.65} className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View my work <ArrowRight />
            </a>
            <a href="#contact" className="btn btn-secondary">Contact me</a>
          </Reveal>

          <div className="hero-socials">
            {SOCIALS.map((s, i) => (
              <Reveal
                as="a"
                onLoad
                blur={false}
                y={12}
                delay={0.8 + i * 0.06}
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social"
                aria-label={s.label}
              >
                <i className={s.icon} aria-hidden="true"></i>
              </Reveal>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={still ? undefined : { y: photoY, scale: photoScale, rotate: photoRotate, opacity: photoOpacity }}
        >
          <motion.figure
            className="hero-photo"
            initial={{ clipPath: 'inset(120% -20% -20% -20%)' }}
            animate={{ clipPath: 'inset(-20% -20% -20% -20%)' }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
          >
            <motion.img
              src="/vishnu-konda.webp"
              alt="Portrait of Vishnu Konda"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.25 }}
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
