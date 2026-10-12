import { useRef } from 'react';
import {
  motion, useAnimationFrame, useMotionValue, useReducedMotion,
  useScroll, useSpring, useTransform, useVelocity,
} from 'motion/react';
import { Spark } from './Icons';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function Marquee({ items, speed = 3 }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) direction.current = 1;
    else if (f > 0) direction.current = -1;
    let move = direction.current * speed * (delta / 1000);
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const group = (key) => (
    <div className="marquee-group" key={key} aria-hidden={key > 0 || undefined}>
      {items.map((item, i) => (
        <span key={item} className={`marquee-item${i % 2 ? ' serif' : ''}`}>
          {item}
          <Spark className="marquee-spark" />
        </span>
      ))}
    </div>
  );

  return (
    <section className="marquee" aria-label="Technologies I work with">
      <motion.div className="marquee-track" style={{ x }}>
        {group(0)}
        {group(1)}
      </motion.div>
    </section>
  );
}
