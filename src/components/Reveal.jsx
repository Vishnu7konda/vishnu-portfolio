import { Fragment, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/hooks';

const HOVER_LIFT = { y: -6, transition: { duration: 0.35, ease: EASE } };

export default function Reveal({
  as = 'div', delay = 0, y = 24, blur = true, onLoad = false, amount = 0.2, lift = false, children, ...rest
}) {
  const M = motion[as];
  const hidden = { opacity: 0, y, filter: blur ? 'blur(8px)' : 'blur(0px)' };
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };
  return (
    <M
      initial={hidden}
      {...(onLoad ? { animate: shown } : { whileInView: shown, viewport: { once: true, amount } })}
      {...(lift && { whileHover: HOVER_LIFT })}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function SplitWords({ segments, as: Tag = 'span', className, delay = 0, stagger = 0.05, onLoad = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const show = onLoad || inView;
  const parts = typeof segments === 'string' ? [{ text: segments }] : segments;
  let index = 0;

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{parts.map((p) => p.text).join(' ')}</span>
      <span aria-hidden="true">
        {parts.map((part, pi) => (
          <Fragment key={pi}>
            {pi > 0 && ' '}
            <span className={part.className}>
              {part.text.split(' ').map((word, wi, arr) => {
                const d = delay + index++ * stagger;
                return (
                  <Fragment key={wi}>
                    <span className="word-mask">
                      <motion.span
                        initial={{ y: '110%' }}
                        animate={show ? { y: '0%' } : undefined}
                        transition={{ duration: 0.9, ease: EASE, delay: d }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {wi < arr.length - 1 && ' '}
                  </Fragment>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

export function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || typeof value !== 'number') return;
    if (reduce) { setShown(value); return; }
    const controls = animate(0, value, { duration: 1.6, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref}>{typeof value === 'number' ? shown : value}{suffix}</span>;
}
