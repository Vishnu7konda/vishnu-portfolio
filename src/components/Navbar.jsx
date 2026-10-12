import { useEffect, useState } from 'react';
import { Close, Menu, Moon, Sun } from './Icons';

const NAV_ITEMS = [
  { id: 'projects', label: 'Work' },
  { id: 'about',    label: 'About' },
  { id: 'skills',   label: 'Capabilities' },
  { id: 'contact',  label: 'Contact' },
];

const currentTheme = () =>
  document.documentElement.dataset.theme ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export default function Navbar() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      setScrolled(y > 8);

      let current = '';
      document.querySelectorAll('main section[id]').forEach((s) => {
        if (s.id !== 'home' && y >= s.offsetTop - window.innerHeight * 0.4) current = s.id;
      });
      if (y + window.innerHeight >= doc.scrollHeight - 4) current = 'contact';
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    setTheme(next);
  };

  const close = () => setOpen(false);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="brand" onClick={close}>
          <span className="brand-mark">VK</span>
          Vishnu Konda
        </a>

        <nav id="primary-nav" className={`nav${open ? ' open' : ''}`} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? 'active' : undefined}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={close}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
          <a href="#contact" className="btn btn-primary btn-sm header-cta">Get in touch</a>
          <button
            className="icon-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="primary-nav"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
