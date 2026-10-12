import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { ArrowUpRight } from './Icons';
import { EASE } from '../lib/hooks';

export default function CursorFollower() {
  const [label, setLabel] = useState(null);
  const lastLabel = useRef('');
  const spring = { stiffness: 450, damping: 38, mass: 0.6 };
  const x = useSpring(-200, spring);
  const y = useSpring(-200, spring);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor]');
      if (el) lastLabel.current = el.dataset.cursor;
      setLabel(el ? el.dataset.cursor : null);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
    };
  }, [x, y]);

  return (
    <motion.div className="cursor-follow" style={{ x, y }} aria-hidden="true">
      <motion.span
        className="cursor-bubble"
        initial={false}
        animate={{ scale: label ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {label || lastLabel.current} <ArrowUpRight />
      </motion.span>
    </motion.div>
  );
}
