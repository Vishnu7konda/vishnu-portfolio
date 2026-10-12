import { useEffect, useRef, useState } from 'react';
import { useReveal, trackSpotlight, stagger } from '../lib/motion';

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
    fetch('/api/data')
      .then((r) => r.json())
      .then((data) => setProjects(data.projects?.length ? data.projects : DEFAULT_PROJECTS))
      .catch(() => setProjects(DEFAULT_PROJECTS));
  }, []);

  useReveal(sectionRef, [projects]);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">Featured work</span>
          <h2 className="section-title">
            Selected <span className="gradient-text">projects</span>
          </h2>
          <p className="section-subtitle">A showcase of my recent work and creative solutions</p>
        </div>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="card spotlight project-card reveal"
              style={stagger(i, 120)}
              onMouseMove={trackSpotlight}
            >
              <div className="project-image">
                <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                <img src={project.image} alt={project.alt || project.title} loading="lazy" />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tech">
                  {(project.tech || []).map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="project-links">
                  {hasUrl(project.liveUrl) && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link primary">
                      Live demo <i className="fas fa-arrow-up-right-from-square"></i>
                    </a>
                  )}
                  {hasUrl(project.githubUrl) && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <i className="fab fa-github"></i> Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
