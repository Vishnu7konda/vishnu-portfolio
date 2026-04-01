import { useEffect, useRef, useState } from 'react';

const DEFAULT_PROJECTS = [
  { id: 'proj-1', image: '/DALL·E-2024-05-10-18.27.35-A-photograph-of-a-healthcare-setting-a-doctor-and-a-nurse-consulting-an-AI-chatbot-on-a-tablet-displaying-patient-data-and-medical-history-1-1-1-2.png', alt: 'AI Consultation Platform', title: 'AI-powered online consultation and medicine delivery', desc: 'AI-powered online consultation and medicine delivery is a modern healthcare solution that makes getting medical help easier and more convenient.', liveUrl: 'https://docxpert.netlify.app/', githubUrl: '#', tech: ['HTML', 'CSS', 'Django', 'MySQL'] },
  { id: 'proj-2', image: '/delivery-horizon-drone-delivery.png', alt: 'AI-Powered Drone Delivery', title: 'Skybite - Future of Delivery', desc: "SkyBite is soaring into India's food delivery scene with cutting-edge drone technology. We're transforming the way meals reach your doorstep, offering unparalleled speed and efficiency.", liveUrl: 'https://skybite-demo.netlify.app/', githubUrl: '#', tech: ['React', 'Tailwind CSS', 'MongoDB', 'Node JS'] },
  { id: 'proj-3', image: '/istockphoto-1022925352-612x612.jpg', alt: 'Trash 2 Treasure', title: 'Trash 2 Treasure', desc: 'Trash2Treasure (T2T) is a digital waste-to-credit platform designed to promote responsible waste disposal through gamification and incentives.', liveUrl: 'https://t2tapplication.vercel.app', githubUrl: '#', tech: ['MongoDB', 'Express', 'React', 'NodeJS'] },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((data) => setProjects(data.projects?.length ? data.projects : DEFAULT_PROJECTS))
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = sectionRef.current?.querySelectorAll('.project-card') || [];
    cards.forEach((card, i) => {
      card.classList.add('fade-in');
      card.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [loaded, projects]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / 15;
    const rotateY = (rect.width / 2 - x) / 15;
    e.currentTarget.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    e.currentTarget.style.transition = 'none';
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    e.currentTarget.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  };

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of my recent work and creative solutions</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="project-image">
                <img src={project.image} alt={project.alt} />
                <div className="project-overlay">
                  <div className="project-links">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="Live demo">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tech">
                  {(project.tech || []).map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
