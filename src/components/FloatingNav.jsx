import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '#home',     icon: 'fa-home',     section: 'home' },
  { href: '#about',    icon: 'fa-user',     section: 'about' },
  { href: '#skills',   icon: 'fa-code',     section: 'skills' },
  { href: '#projects', icon: 'fa-briefcase',section: 'projects' },
  { href: '#contact',  icon: 'fa-envelope', section: 'contact' },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = 'home';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 200) {
          current = section.getAttribute('id') || current;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="floating-nav">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.section}>
            <a
              href={item.href}
              className={activeSection === item.section ? 'active' : ''}
              onClick={(e) => handleClick(e, item.href)}
              aria-label={item.section}
            >
              <i className={`fas ${item.icon}`}></i>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
