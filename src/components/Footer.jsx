import { ArrowUp } from './Icons';
import { SOCIALS } from '../data/socials';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Vishnu Konda. All rights reserved.</p>
        <nav className="footer-links" aria-label="Footer">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <a href="#home" className="to-top">Back to top <ArrowUp /></a>
        </nav>
      </div>
    </footer>
  );
}
