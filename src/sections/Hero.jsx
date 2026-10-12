import { useEffect, useState } from 'react';
import SocialLinks from '../components/SocialLinks';
import { scrollToId } from '../lib/motion';

const ROLES = ['Creative Developer', 'Full-Stack Developer', 'Startup Builder'];

function useTypedRoles(words) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0]);
      return;
    }
    const word = words[index % words.length];
    let delay = deleting ? 45 : 90;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === '') delay = 350;

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return text;
}

export default function Hero() {
  const role = useTypedRoles(ROLES);

  return (
    <section id="home" className="hero-section">
      <div className="hero-content hero-reveal">
        <div>
          <span className="hero-badge">
            <span className="pulse-dot"></span>
            Open to new opportunities
          </span>
        </div>
        <p className="hero-greeting">Hello, I'm</p>
        <h1 className="hero-title">
          Vishnu <span className="gradient-text">Konda</span>
        </h1>
        <p className="hero-role" aria-label={ROLES.join(', ')}>
          <span aria-hidden="true">
            <span className="typed">{role}</span>
            <span className="caret"></span>
          </span>
        </p>
        <p className="hero-subtitle">
          Crafting exceptional digital experiences through innovative design and cutting-edge technology.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => scrollToId('projects')}>
            View My Work <i className="fas fa-arrow-right"></i>
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToId('contact')}>
            <i className="fas fa-paper-plane"></i> Get In Touch
          </button>
        </div>
        <SocialLinks className="social-links hero-socials" />
      </div>

      <button className="scroll-indicator" onClick={() => scrollToId('about')} aria-label="Scroll to About">
        <span className="mouse"></span>
        Scroll
      </button>
    </section>
  );
}
