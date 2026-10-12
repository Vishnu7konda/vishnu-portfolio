import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from '../components/Icons';
import { FadeIn, RollText, SplitText } from '../components/Anim';
import { usePortfolio } from '../lib/data';
import { pad, useMediaQuery } from '../lib/hooks';

const hasUrl = (url) => url && url !== '#';

function StackCard({ project: p, index, total, progress, stacked }) {
  const ref = useRef(null);
  const targetScale = 1 - (total - index - 1) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const live = hasUrl(p.liveUrl);
  const Media = live ? 'a' : 'div';

  return (
    <div className="stack-slot" ref={ref}>
      <motion.article
        className="stack-card"
        style={stacked ? { scale, top: `calc(-3vh + ${index * 28}px)` } : { scale: 1, top: 0 }}
      >
        <div className="stack-info">
          <div className="stack-top">
            <span className="mono">{pad(index + 1)} / {pad(total)}</span>
            {live && <span className="live-pill"><span className="dot" aria-hidden="true" />Live</span>}
          </div>

          <div>
            <h3 className="stack-title">{p.title}</h3>
            <p className="stack-desc">{p.desc}</p>
          </div>

          <div>
            {p.tech?.length > 0 && (
              <ul className="tags">
                {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
              </ul>
            )}
            <div className="stack-links">
              {live && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <RollText text="Visit live site" />
                  <ArrowUpRight />
                </a>
              )}
              {hasUrl(p.githubUrl) && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <RollText text="Source code" />
                </a>
              )}
            </div>
          </div>
        </div>

        <Media
          className="stack-media"
          data-cursor={live ? 'Visit' : undefined}
          {...(live && { href: p.liveUrl, target: '_blank', rel: 'noopener noreferrer', tabIndex: -1, 'aria-hidden': true })}
        >
          <motion.img src={p.image} alt={p.alt || p.title} loading="lazy" style={{ scale: imageScale }} />
        </Media>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const data = usePortfolio();
  const projects = data?.projects ?? [];
  const stackRef = useRef(null);
  const stacked = useMediaQuery('(min-width: 901px)');
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="projects" className="work">
      <div className="container">
        <FadeIn className="eyebrow-row">
          <span className="mono">( Work )</span>
          <span className="mono">{pad(projects.length)} Projects</span>
        </FadeIn>

        <div className="section-head">
          <h2 className="display">
            <SplitText text="Selected *work*" />
          </h2>
          <FadeIn as="p" className="section-intro" delay={0.2}>
            A few recent products I've designed, built and shipped to the web.
          </FadeIn>
        </div>

        <div className="stack" ref={stackRef}>
          {projects.map((p, i) => (
            <StackCard
              key={p.id}
              project={p}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
