import { useRef, useState } from 'react';
import SocialLinks from '../components/SocialLinks';
import { useReveal, trackSpotlight, stagger } from '../lib/motion';

const EMPTY = { name: '', email: '', subject: '', message: '' };

const CONTACTS = [
  { icon: 'fas fa-envelope',     label: 'Email',    value: 'vishnu.konda40@gmail.com', href: 'mailto:vishnu.konda40@gmail.com' },
  { icon: 'fas fa-phone',        label: 'Phone',    value: '+91 8977570809',           href: 'tel:+918977570809' },
  { icon: 'fas fa-location-dot', label: 'Location', value: 'Hyderabad, Telangana' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useReveal(sectionRef);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in name, email and message.');
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
      setTimeout(() => {
        setStatus('idle');
        setForm(EMPTY);
      }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const btnLabel = {
    sending: <><i className="fas fa-spinner fa-spin"></i> Sending...</>,
    success: <><i className="fas fa-check"></i> Message Sent!</>,
    error:   <><i className="fas fa-xmark"></i> Try Again</>,
    idle:    <>Send Message <i className="fas fa-paper-plane"></i></>,
  }[status];

  const field = (name, label, props = {}) => {
    const Tag = props.rows ? 'textarea' : 'input';
    return (
      <div className="form-group">
        <Tag
          id={name}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder=" "
          {...props}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    );
  };

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header center reveal">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">
            Let's <span className="gradient-text">work together</span>
          </h2>
          <p className="section-subtitle">Ready to bring your ideas to life? Let's discuss your next project.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            {CONTACTS.map((c, i) => {
              const Tag = c.href ? 'a' : 'div';
              return (
                <Tag
                  key={c.label}
                  href={c.href}
                  className={`card spotlight contact-item reveal${c.href ? '' : ' is-static'}`}
                  style={stagger(i)}
                  onMouseMove={trackSpotlight}
                >
                  <div className="contact-icon"><i className={c.icon}></i></div>
                  <div className="contact-details">
                    <h4>{c.label}</h4>
                    <p>{c.value}</p>
                  </div>
                  {c.href && <i className="fas fa-arrow-right contact-arrow"></i>}
                </Tag>
              );
            })}

            <div className="connect-block reveal" style={stagger(3)}>
              <h3>Connect with me</h3>
              <SocialLinks />
            </div>
          </div>

          <form className="card contact-form reveal" style={stagger(1)} onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              {field('name', 'Your Name', { type: 'text', autoComplete: 'name', required: true })}
              {field('email', 'Your Email', { type: 'email', autoComplete: 'email', required: true })}
            </div>
            {field('subject', 'Subject', { type: 'text' })}
            {field('message', 'Your Message', { rows: 5, required: true })}

            {errorMsg && (
              <p className="form-error" role="alert">
                <i className="fas fa-circle-exclamation"></i> {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-block${status === 'success' ? ' is-success' : ''}${status === 'error' ? ' is-error' : ''}`}
              disabled={status === 'sending'}
            >
              {btnLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
