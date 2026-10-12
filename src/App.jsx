import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import About from './sections/About';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) document.body.classList.add('admin-mode');
  }, [isAdmin]);

  if (isAdmin) return <AdminApp />;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
