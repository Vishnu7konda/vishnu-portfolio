import { ArrowUp } from './Icons';
import { Magnetic, RollText } from './Anim';
import { SOCIALS } from '../data/socials';
import { useLocalTime } from '../lib/hooks';

export default function Footer() {
  const time = useLocalTime();

  return (
    <footer className="footer">
      <div className="container footer-bar">
        <div className="footer-col">
          <span className="mono">Version</span>
          <span>© {new Date().getFullYear()} Edition</span>
        </div>
        <div className="footer-col">
          <span className="mono">Local time</span>
          <span>{time} IST</span>
        </div>
        <div className="footer-col footer-socials">
          <span className="mono">Socials</span>
          <div>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                <RollText text={s.label} />
              </a>
            ))}
          </div>
        </div>
        <Magnetic className="to-top-wrap" strength={0.4}>
          <a href="#home" className="to-top" aria-label="Back to top"><ArrowUp width={18} height={18} /></a>
        </Magnetic>
      </div>
    </footer>
  );
}
