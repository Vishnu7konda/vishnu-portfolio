import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '../components/Icons';
import { fetchPortfolio } from '../lib/data';
import { useReveal, pad } from '../lib/motion';

const DEFAULT_PROJECTS = [
  { id: 'proj-1', image: '/DALL·E-2024-05-10-18.27.35-A-photograph-of-a-healthcare-setting-a-doctor-and-a-nurse-consulting-an-AI-chatbot-on-a-tablet-displaying-patient-data-and-medical-history-1-1-1-2.png', alt: 'AI Consultation Platform', title: 'AI-powered online consultation and medicine delivery', desc: 'AI-powered online consultation and medicine delivery is a modern healthcare solution that makes getting medical help easier and more convenient.', liveUrl: 'https://docxpert.netlify.app/', githubUrl: '#', tech: ['HTML', 'CSS', 'Django', 'MySQL'] },
  { id: 'proj-2', image: '/delivery-horizon-drone-delivery.png', alt: 'AI-Powered Drone Delivery', title: 'Skybite - Future of Delivery', desc: "SkyBite is soaring into India's food delivery scene with cutting-edge drone technology. We're transforming the way meals reach your doorstep, offering unparalleled speed and efficiency.", liveUrl: 'https://skybite-demo.netlify.app/', githubUrl: '#', tech: ['React', 'Tailwind CSS', 'MongoDB', 'Node JS'] },
  { id: 'proj-3', image: '/istockphoto-1022925352-612x612.jpg', alt: 'Trash 2 Treasure', title: 'Trash 2 Treasure', desc: 'Trash2Treasure (T2T) is a digital waste-to-credit platform designed to promote responsible waste disposal through gamification and incentives.', liveUrl: 'https://t2tapplication.vercel.app', githubUrl: '#', tech: ['MongoDB', 'Express', 'React', 'NodeJS'] },
];

const hasUrl = (url) => url && url !== '#';

export default function Projects() {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchPortfolio()
      .then((data) => setProjects(data.projects?.length ? data.projects : DEFAULT_PROJECTS))
      .catch(() => setProjects(DEFAULT_PROJECTS));
  }, []);

  useReveal(sectionRef, [projects]);

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container section-grid">
        <p className="section-label mono reveal"><b>01</b>Work</p>
        <div className="section-body">
          <h2 className="section-title reveal">
            Selected work. <span className="muted">Recent projects I've designed and built.</span>
          </h2>

          <div className="work-list">
            {projects.map((p, i) => {
              const live = hasUrl(p.liveUrl);
              const Media = live ? 'a' : 'div';
              return (
                <article key={p.id} className="work-item reveal">
                  <Media
                    className="work-media"
                    {...(live && { href: p.liveUrl, target: '_blank', rel: 'noopener noreferrer', tabIndex: -1, 'aria-hidden': true })}
                  >
                    <img src={p.image} alt={p.alt || p.title} loading="lazy" />
                  </Media>
                  <div className="work-body">
                    <p className="work-index mono">{pad(i + 1)} / {pad(projects.length)}</p>
                    <h3 className="work-title">{p.title}</h3>
                    <p className="work-desc">{p.desc}</p>
                    {p.tech?.length > 0 && (
                      <ul className="tags">
                        {p.tech.map((t) => <li key={t} className="tag">{t}</li>)}
                      </ul>
                    )}
                    <div className="work-links">
                      {live && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                          Visit live site <ArrowUpRight />
                        </a>
                      )}
                      {hasUrl(p.githubUrl) && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                          Source code <ArrowUpRight />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
