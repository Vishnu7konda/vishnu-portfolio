import { ArrowUp, ArrowUpRight } from './Icons';
import { SOCIALS } from '../data/socials';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <p>&copy; {new Date().getFullYear()} Vishnu Konda. All rights reserved.</p>
          <nav className="footer-links" aria-label="Social">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-link">
                {s.label} <ArrowUpRight />
              </a>
            ))}
            <a href="#home" className="text-link">Back to top <ArrowUp /></a>
          </nav>
        </div>
        <p className="footer-wordmark" aria-hidden="true">Vishnu Konda</p>
      </div>
    </footer>
  );
}
