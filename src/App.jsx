import { useEffect, useState } from 'react';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import ParticlesCanvas from './components/ParticlesCanvas';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// ── Admin wrapper ──────────────────────────────────────────────────
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

// ── Main app ───────────────────────────────────────────────────────
export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdmin) document.body.classList.add('loaded');
    else document.body.classList.add('admin-mode');
  }, [isAdmin]);

  if (isAdmin) return <AdminApp />;

  return (
    <>
      <Cursor />
      <div className="bg-ambient" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <ParticlesCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
