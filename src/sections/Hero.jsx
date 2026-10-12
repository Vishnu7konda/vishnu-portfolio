import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from '../components/Icons';
import { Magnetic, RollText } from '../components/Anim';
import { useContact } from '../components/ContactDrawer';
import { EASE, useLocalTime } from '../lib/hooks';

const ROLES = ['Developer', 'Designer', 'Builder'];

function Letters({ text, play, delay }) {
  return (
    <span className="name-word" aria-hidden="true">
      {[...text].map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: '102%' }}
          animate={play ? { y: '0%' } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.05 }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

function RoleRotator({ play }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, [play]);

  return (
    <span className="role-window">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ROLES[i]}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ ready, delay }) {
  const ref = useRef(null);
  const openContact = useContact();
  const time = useLocalTime();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  const rise = (d) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay: delay + d },
  });

  return (
    <section id="home" className="hero" ref={ref}>
      <motion.div className="container hero-inner" style={{ opacity: fade }}>
        <motion.div className="hero-meta mono" {...rise(0.7)}>
          <span><span className="dot" aria-hidden="true" /> Creative developer &amp; startup builder</span>
          <span>Hyderabad, IN — {time} IST</span>
        </motion.div>

        <motion.h1 className="hero-name" style={{ y: nameY }}>
          <span className="sr-only">Vishnu Konda</span>
          <span className="name-line">
            <Letters text="Vishnu" play={ready} delay={delay} />
            <motion.span className="hero-role" aria-hidden="true" {...rise(0.9)}>
              <span className="serif">Creative</span>
              <RoleRotator play={ready} />
            </motion.span>
          </span>
          <span className="name-line">
            <motion.span
              className="hero-photo"
              aria-hidden="true"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
              transition={{ duration: 1.3, ease: EASE, delay: delay + 0.35 }}
            >
              <motion.img
                src="/WhatsApp Image 2026-01-13 at 11.03.18 AM.jpeg"
                alt=""
                style={{ scale: photoScale }}
              />
            </motion.span>
            <Letters text="Konda" play={ready} delay={delay + 0.2} />
          </span>
        </motion.h1>

        <motion.div className="hero-bottom" {...rise(1)}>
          <p className="hero-intro">
            I design and build clean, functional web products that solve real problems —
            with an eye for detail and a focus on what actually works.
          </p>
          <a href="#about" className="scroll-cue" aria-label="Scroll to About">
            <span className="scroll-line" />
            <span className="mono">Scroll</span>
          </a>
          <div className="hero-ctas">
            <a href="#projects" className="link-arrow">
              <RollText text="See my work" />
              <ArrowDown />
            </a>
            <Magnetic>
              <button className="btn btn-primary btn-lg" onClick={openContact}>
                <RollText text="Let's talk" />
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
