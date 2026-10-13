import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { ArrowUpRight } from '../components/Icons';
import { usePortfolio } from '../lib/data';
import { EASE } from '../lib/hooks';

const hasUrl = (url) => url && url !== '#';

function ProjectCard({ project: p, featured, delay }) {
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const { scrollYProgress: enter } = useScroll({ target: cardRef, offset: ['start end', 'start 0.55'] });
  const rotateX = useTransform(enter, [0, 1], [18, 0]);
  const scale = useTransform(enter, [0, 1], [0.86, 1]);
  const inView = useInView(mediaRef, { once: true, amount: 0.3 });
  const live = hasUrl(p.liveUrl);
  const Media = live ? 'a' : 'div';
  const linkProps = live ? { href: p.liveUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Reveal
      as="article"
      ref={cardRef}
      className={`project${featured ? ' featured' : ''}`}
      delay={delay}
      lift
      style={still ? undefined : { rotateX, scale, transformPerspective: 1400, transformOrigin: '50% 100%' }}
    >
      <Media
        ref={mediaRef}
        className="project-media"
        {...linkProps}
        {...(live && { tabIndex: -1, 'aria-hidden': true })}
      >
        <motion.div
          className="media-reveal"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: delay + 0.1 }}
        >
          <motion.img src={p.image} alt={p.alt || p.title} loading="lazy" style={still ? undefined : { scale: imageScale }} />
        </motion.div>
      </Media>
      <div className="project-body">
        <div className="project-head">
          <h3>{p.title}</h3>
          {live && (
            <a className="project-link" {...linkProps} aria-label={`Visit ${p.title}`}>
              <ArrowUpRight />
            </a>
          )}
        </div>
        <p className="project-desc">{p.desc}</p>
        {p.tech?.length > 0 && (
          <ul className="chips">
            {p.tech.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
        )}
        {hasUrl(p.githubUrl) && (
          <a className="text-link" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
            Source code <ArrowUpRight />
          </a>
        )}
      </div>
    </Reveal>
  );
}

export default function Projects() {
  const data = usePortfolio();
  const projects = data?.projects ?? [];
  const featureFirst = projects.length % 2 === 1;

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead
          eyebrow="Selected work"
          title="Projects I've designed and built."
          intro="A few recent products, each shipped and live on the web."
        />

        <div className="project-grid">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              featured={featureFirst && i === 0}
              delay={(featureFirst ? Math.max(i - 1, 0) : i % 2) * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
