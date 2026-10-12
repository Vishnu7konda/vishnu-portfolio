import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Marquee from './components/Marquee';
import CursorFollower from './components/CursorFollower';
import { ContactProvider } from './components/ContactDrawer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { destroySmoothScroll, initSmoothScroll, lockScroll } from './lib/scroll';
import { TECH } from './data/defaults';

function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const handleLogin = (t) => {
    localStorage.setItem('admin_token', t);
    setToken(t);
  };
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

const shouldPlayIntro = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return !sessionStorage.getItem('intro-seen'); } catch { return false; }
};

function Portfolio() {
  const [playIntro] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(!playIntro);
  const finishIntro = useCallback(() => setReady(true), []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    initSmoothScroll();
    return destroySmoothScroll;
  }, []);

  useEffect(() => {
    if (ready) return;
    window.scrollTo(0, 0);
    lockScroll(true);
    return () => lockScroll(false);
  }, [ready]);

  return (
    <ContactProvider>
      <AnimatePresence>{!ready && <Preloader onDone={finishIntro} />}</AnimatePresence>
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} delay={playIntro ? 0.45 : 0.1} />
        <Marquee items={TECH} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <CursorFollower />
    </ContactProvider>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) document.body.classList.add('admin-mode');
  }, [isAdmin]);

  return isAdmin ? <AdminApp /> : <Portfolio />;
}
