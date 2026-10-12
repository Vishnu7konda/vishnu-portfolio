import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Moon, Sun } from './Icons';
import { Magnetic, RollText } from './Anim';
import { useContact } from './ContactDrawer';
import { EASE, EASE_IN_OUT } from '../lib/hooks';
import { lockScroll } from '../lib/scroll';
import { SOCIALS } from '../data/socials';
import { EMAIL } from '../data/defaults';

const NAV_ITEMS = [
  { id: 'about',    label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills',   label: 'Services' },
  { id: 'contact',  label: 'Contact' },
];

const currentTheme = () =>
  document.documentElement.dataset.theme ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export default function Navbar({ ready }) {
  const openContact = useContact();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(currentTheme);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
    setScrolled(y > 24);

    let current = '';
    document.querySelectorAll('main section[id]').forEach((s) => {
      if (s.id !== 'home' && y >= s.offsetTop - window.innerHeight * 0.45) current = s.id;
    });
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) current = 'contact';
    setActive(current);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setTheme(next);
  };

  const talk = () => {
    setOpen(false);
    openContact();
  };

  return (
    <>
      <motion.header
        className={`header${scrolled && !open ? ' scrolled' : ''}`}
        initial={{ y: '-100%' }}
        animate={{ y: ready && (!hidden || open) ? '0%' : '-100%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="container header-inner">
          <a href="#home" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">VK</span>
            <RollText text="Vishnu Konda" />
          </a>

          <nav className="nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? 'active' : undefined}
                aria-current={active === item.id ? 'true' : undefined}
              >
                <RollText text={item.label} />
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
            <Magnetic className="header-cta" strength={0.25}>
              <button className="btn btn-primary btn-sm" onClick={talk}>
                <RollText text="Let's talk" />
              </button>
            </Magnetic>
            <button
              className={`menu-btn${open ? ' is-open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <div className="container mobile-menu-inner">
              <span className="mono muted-label">Navigation</span>
              <nav className="mobile-links" aria-label="Mobile">
                {NAV_ITEMS.map((item, i) => (
                  <span key={item.id} className="split-word">
                    <motion.a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.07 }}
                    >
                      {item.label}
                    </motion.a>
                  </span>
                ))}
              </nav>
              <motion.div
                className="mobile-menu-foot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <div className="mobile-socials">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={talk}>Let's talk</button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
