import { useState, useRef } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const btnRef = useRef(null);

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
        setForm({ name: '', email: '', subject: '', message: '' });
      }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getBtnLabel = () => {
    if (status === 'sending') return <><i className="fas fa-spinner fa-spin"></i> Sending...</>;
    if (status === 'success') return <><i className="fas fa-check"></i> Message Sent!</>;
    if (status === 'error')   return <><i className="fas fa-times"></i> Try Again</>;
    return <><i className="fas fa-paper-plane"></i> Send Message</>;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">Ready to bring your ideas to life? Let's discuss your next project</p>
        </div>
        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-item fade-in">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>vishnu.konda40@gmail.com</p>
              </div>
            </div>
            <div className="contact-item fade-in">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div className="contact-details">
                <h4>Phone</h4>
                <p>+91 8977570809</p>
              </div>
            </div>
            <div className="contact-item fade-in">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-details">
                <h4>Location</h4>
                <p>Hyderabad, Telangana</p>
              </div>
            </div>
            <div style={{ marginTop: '-125px' }}>
              <h2 className="section-title" style={{ marginBottom: '25px', fontSize: 'clamp(1.5rem, 2.5vw, 4rem)', display: 'inline-block' }}>Connect with me through</h2>
              <div className="social-links" style={{ marginTop: 0 }}>
                <a href="https://www.linkedin.com/in/vishnu-konda" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/Vishnu7konda" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://www.instagram.com/vishnu_konda7" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="name">Your Name</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Your Email</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
              <label htmlFor="subject">Subject</label>
            </div>
            <div className="form-group">
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
              <label htmlFor="message">Your Message</label>
            </div>
            {errorMsg && (
              <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '0.9rem' }}>
                {errorMsg}
              </p>
            )}
            <button
              ref={btnRef}
              type="submit"
              className="btn btn-primary"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                justifyContent: 'center',
                background: status === 'success'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : status === 'error'
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : undefined,
              }}
            >
              {getBtnLabel()}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
