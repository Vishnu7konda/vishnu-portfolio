import { useEffect, useState } from 'react';
import { animate, motion } from 'motion/react';
import { EASE, EASE_IN_OUT } from '../lib/hooks';

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer;
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try { sessionStorage.setItem('intro-seen', '1'); } catch { /* ignore */ }
        timer = setTimeout(onDone, 200);
      },
    });
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      exit={{ y: '-100%' }}
      transition={{ duration: 1, ease: EASE_IN_OUT }}
      aria-hidden="true"
    >
      <motion.div
        className="preloader-top"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span>Vishnu Konda</span>
        <span className="mono">Portfolio ©{new Date().getFullYear()}</span>
      </motion.div>

      <motion.div className="preloader-bottom" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <span className="mono">Creative developer &amp; startup builder</span>
        <span className="preloader-count">{count}</span>
      </motion.div>

      <motion.span className="preloader-bar" style={{ scaleX: count / 100 }} />
    </motion.div>
  );
}
