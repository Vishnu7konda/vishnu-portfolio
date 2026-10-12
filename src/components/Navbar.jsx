import { useEffect, useRef, useState } from 'react';
import { scrollToId } from '../lib/motion';

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: 'fa-house' },
  { id: 'about',    label: 'About',    icon: 'fa-user' },
  { id: 'skills',   label: 'Skills',   icon: 'fa-code' },
  { id: 'projects', label: 'Projects', icon: 'fa-briefcase' },
  { id: 'contact',  label: 'Contact',  icon: 'fa-envelope' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
      setScrolled(y > 24);

      let current = 'home';
      document.querySelectorAll('main section[id]').forEach((s) => {
        if (y >= s.offsetTop - window.innerHeight * 0.35) current = s.id;
      });
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) current = 'contact';
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a href="#home" className="nav-logo" onClick={(e) => go(e, 'home')}>
          <span className="nav-logo-mark">VK</span>
          <span>Vishnu<span className="gradient-text">.</span></span>
        </a>

        <nav aria-label="Primary">
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'active' : ''}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={(e) => go(e, item.id)}
                >
                  <i className={`fas ${item.icon}`}></i>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="btn btn-primary nav-cta" onClick={(e) => go(e, 'contact')}>
          Let's talk
        </a>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </header>
    </>
  );
}
