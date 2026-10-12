import { SOCIALS } from '../data/socials';

export default function SocialLinks({ className = 'social-links' }) {
  return (
    <div className={className}>
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={s.label}
        >
          <i className={s.icon}></i>
        </a>
      ))}
    </div>
  );
}
