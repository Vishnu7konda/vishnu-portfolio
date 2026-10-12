import { Fragment, useRef } from 'react';
import { motion, useInView, useSpring } from 'motion/react';
import { EASE } from '../lib/hooks';

export function RollText({ text }) {
  const chars = [...text];
  const row = (cls) => (
    <span className={cls} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} style={{ '--i': i }}>{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  );
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {row('roll-row')}
      {row('roll-row roll-row-2')}
    </span>
  );
}

export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const spring = { stiffness: 180, damping: 14, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} className={`magnetic ${className}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

function parseLines(text) {
  return text.split('|').map((line) =>
    line.trim().split(/\s+/).map((w) => {
      const em = w.startsWith('*') && w.endsWith('*');
      return { text: em ? w.slice(1, -1) : w, em };
    })
  );
}

export function SplitText({ text, as: Tag = 'span', className, delay = 0, stagger = 0.07, play }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = play ?? inView;
  const lines = parseLines(text);
  const plain = lines.map((l) => l.map((w) => w.text).join(' ')).join(' ');
  let index = 0;

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {lines.map((words, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {words.map((w, wi) => {
              const d = delay + index++ * stagger;
              return (
                <Fragment key={wi}>
                  <span className="split-word">
                    <motion.span
                      className={w.em ? 'serif' : undefined}
                      initial={{ y: '115%' }}
                      animate={show ? { y: '0%' } : undefined}
                      transition={{ duration: 1.1, ease: EASE, delay: d }}
                    >
                      {w.text}
                    </motion.span>
                  </span>
                  {wi < words.length - 1 && ' '}
                </Fragment>
              );
            })}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

export function FadeIn({ as = 'div', children, delay = 0, y = 28, amount = 0.25, ...rest }) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}
