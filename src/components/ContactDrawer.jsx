import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Close } from './Icons';
import { RollText } from './Anim';
import { EASE, EASE_IN_OUT } from '../lib/hooks';
import { lockScroll } from '../lib/scroll';
import { EMAIL } from '../data/defaults';

const ContactContext = createContext(() => {});

export const useContact = () => useContext(ContactContext);

export function ContactProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      returnTo?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return (
    <ContactContext.Provider value={openContact}>
      {children}
      <AnimatePresence>{open && <Drawer onClose={close} />}</AnimatePresence>
    </ContactContext.Provider>
  );
}

const EMPTY = { name: '', email: '', subject: '', message: '' };

function Drawer({ onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email and message.');
      return;
    }
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

  const field = (name, label, props) => {
    const Tag = props.rows ? 'textarea' : 'input';
    return (
      <div className="field">
        <label htmlFor={`f-${name}`}>{label}</label>
        <Tag id={`f-${name}`} name={name} value={form[name]} onChange={handleChange} {...props} />
      </div>
    );
  };

  return (
    <>
      <motion.div
        className="drawer-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        data-lenis-prevent
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      >
        <motion.div
          className="drawer-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        >
          <div className="drawer-head">
            <span className="mono">( Contact )</span>
            <button className="icon-btn" onClick={onClose} aria-label="Close contact form"><Close /></button>
          </div>

          <h2 id="drawer-title" className="drawer-title">
            Let's start a <span className="serif">conversation</span>
          </h2>
          <p className="drawer-sub">
            Tell me a little about your project, or email me directly at{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>

          {status === 'success' ? (
            <div className="drawer-success">
              <span className="success-icon"><Check width={22} height={22} /></span>
              <h3>Message sent</h3>
              <p>Thanks for reaching out — I'll get back to you soon.</p>
              <button className="btn btn-secondary" onClick={onClose}><RollText text="Close" /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                {field('name', 'Name', { type: 'text', autoComplete: 'name', placeholder: 'Jane Doe', required: true, autoFocus: true })}
                {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@email.com', required: true })}
              </div>
              {field('subject', 'Subject (optional)', { type: 'text', placeholder: "What's this about?" })}
              {field('message', 'Message', { rows: 6, placeholder: 'Tell me about your project, goals and timeline…', required: true })}

              <div className="form-footer">
                <p className={`form-status ${status}`} role="status" aria-live="polite">
                  {status === 'error' ? errorMsg : status === 'sending' ? 'Sending…' : ''}
                </p>
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  <RollText text={status === 'sending' ? 'Sending…' : 'Send message'} />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.aside>
    </>
  );
}
