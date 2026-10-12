import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from '../components/Icons';
import { SOCIALS } from '../data/socials';
import { useReveal, stagger } from '../lib/motion';

const EMAIL = 'vishnu.konda40@gmail.com';
const EMPTY = { name: '', email: '', subject: '', message: '' };

const ROWS = [
  { label: 'Email',    value: EMAIL,                  href: `mailto:${EMAIL}`, copy: true },
  { label: 'Phone',    value: '+91 89775 70809',      href: 'tel:+918977570809' },
  { label: 'Location', value: 'Hyderabad, Telangana' },
  ...SOCIALS.map((s) => ({ label: s.label, value: s.handle, href: s.href, external: true })),
];

const STATUS_TEXT = {
  sending: 'Sending…',
  success: 'Thanks — your message has been sent.',
};

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useReveal(sectionRef);

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email and message.');
      return;
    }
    setErrorMsg('');
    setStatus('sending');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: form.subject.trim(),
          message: message.trim(),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || 'Failed to send');
      }

      setStatus('success');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const statusText = status === 'error' ? errorMsg : STATUS_TEXT[status];

  return (
    <section id="contact" className="section" ref={sectionRef}>
      <div className="container section-grid">
        <p className="section-label mono reveal"><b>04</b>Contact</p>
        <div className="section-body">
          <h2 className="section-title reveal">
            Have a project in mind? <span className="muted">Let's build it together.</span>
          </h2>

          <div className="contact-grid">
            <ul className="contact-list reveal">
              {ROWS.map((row) => (
                <li key={row.label} className="contact-row">
                  <span className="mono">{row.label}</span>
                  {row.href ? (
                    <a
                      className="contact-value"
                      href={row.href}
                      {...(row.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {row.value}
                      {row.external && <ArrowUpRight />}
                    </a>
                  ) : (
                    <span className="contact-value">{row.value}</span>
                  )}
                  {row.copy ? (
                    <button
                      type="button"
                      className="icon-btn icon-btn-sm"
                      onClick={copyEmail}
                      aria-label={copied ? 'Email copied' : 'Copy email address'}
                      title={copied ? 'Copied' : 'Copy'}
                    >
                      {copied ? <Check /> : <Copy />}
                    </button>
                  ) : <span />}
                </li>
              ))}
            </ul>

            <form className="form-card reveal" style={stagger(1)} onSubmit={handleSubmit} noValidate>
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
                <p className={`form-status ${status}`} role="status" aria-live="polite">
                  {statusText}
                </p>
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
