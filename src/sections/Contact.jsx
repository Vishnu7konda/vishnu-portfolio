import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import Reveal, { SplitWords } from '../components/Reveal';
import { Check, Copy, Mail, Phone, Pin } from '../components/Icons';
import { SOCIALS } from '../data/socials';
import { EMAIL, PHONE } from '../data/defaults';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'start 0.4'] });
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const cardRadius = useTransform(scrollYProgress, [0, 1], [56, 24]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message: body } = form;
    if (!name.trim() || !email.trim() || !body.trim()) {
      setStatus('error');
      setMessage('Please fill in your name, email and message.');
      return;
    }
    setStatus('sending');
    setMessage('');
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: form.subject.trim(),
          message: body.trim(),
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || 'Failed to send');
      }
      setStatus('success');
      setMessage("Thanks — your message has been sent. I'll get back to you soon.");
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal
          ref={cardRef}
          className="contact-card"
          y={40}
          amount={0.15}
          style={still ? undefined : { scale: cardScale, borderRadius: cardRadius }}
        >
          <div className="contact-info">
            <p className="eyebrow">Contact</p>
            <SplitWords as="h2" className="section-title" segments="Let's build something together." delay={0.2} />
            <p className="contact-lead">
              Have a project in mind or just want to say hello? Send a message and I'll get back to you.
            </p>

            <ul className="contact-list">
              <li>
                <span className="contact-icon"><Mail /></span>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <button
                  type="button"
                  className="icon-btn icon-btn-sm"
                  onClick={copyEmail}
                  aria-label={copied ? 'Email copied' : 'Copy email address'}
                  title={copied ? 'Copied' : 'Copy'}
                >
                  {copied ? <Check /> : <Copy />}
                </button>
              </li>
              <li>
                <span className="contact-icon"><Phone /></span>
                <a href={PHONE.href}>{PHONE.display}</a>
              </li>
              <li>
                <span className="contact-icon"><Pin /></span>
                <span>Hyderabad, Telangana</span>
              </li>
            </ul>

            <div className="contact-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social" aria-label={s.label}>
                  <i className={s.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" placeholder="you@email.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="subject">Subject <span className="optional">(optional)</span></label>
              <input id="subject" name="subject" type="text" placeholder="What's this about?"
                value={form.subject} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="Tell me a little about your project…"
                value={form.message} onChange={handleChange} required />
            </div>

            <div className="form-footer">
              <p className={`form-status ${status}`} role="status" aria-live="polite">{message}</p>
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
