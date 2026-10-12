import { useEffect, useState } from 'react';
import { ArrowRight } from '../components/Icons';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
});

function useLocalTime() {
  const [time, setTime] = useState(() => timeFormat.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(timeFormat.format(new Date())), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero() {
  const time = useLocalTime();

  return (
    <section id="home" className="hero">
      <div className="container hero-reveal">
        <p className="hero-eyebrow mono">
          <span className="dot" aria-hidden="true"></span>
          Creative Developer &amp; Startup Builder
        </p>

        <h1 className="hero-title">
          Building clean, functional web products{' '}
          <span className="muted">that solve real problems.</span>
        </h1>

        <p className="hero-lead">
          I'm Vishnu Konda, a developer and product designer based in Hyderabad. I turn
          real-world problems into fast, secure, and practical web platforms.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View selected work <ArrowRight />
          </a>
          <a href="#contact" className="btn btn-secondary">Get in touch</a>
        </div>

        <dl className="hero-meta">
          <div className="meta-item">
            <dt className="mono">Based in</dt>
            <dd>Hyderabad, India · {time} IST</dd>
          </div>
          <div className="meta-item">
            <dt className="mono">Focus</dt>
            <dd>Full-stack web &amp; product design</dd>
          </div>
          <div className="meta-item">
            <dt className="mono">Experience</dt>
            <dd>1+ year building for the web</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
