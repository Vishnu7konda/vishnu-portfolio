import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from '../components/Icons';
import { FadeIn, Magnetic, RollText, SplitText } from '../components/Anim';
import { useContact } from '../components/ContactDrawer';
import { EASE, useLocalTime } from '../lib/hooks';
import { EMAIL, PHONE } from '../data/defaults';

export default function Contact() {
  const openContact = useContact();
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);

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

  return (
    <section id="contact" className="contact">
      <div className="container">
        <FadeIn className="eyebrow-row">
          <span className="mono">( Contact )</span>
          <span className="mono">Hyderabad, IN — {time} IST</span>
        </FadeIn>

        <h2 className="cta-title">
          <SplitText text="Let's work|*together*" stagger={0.1} />
        </h2>

        <div className="cta-row">
          <motion.span
            className="cta-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <div className="cta-circle-wrap">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            >
              <Magnetic strength={0.45}>
                <button className="cta-circle" onClick={openContact}>
                  <span className="cta-circle-fill" />
                  <RollText text="Get in touch" />
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        <FadeIn className="cta-pills" delay={0.15}>
          <button className="pill" onClick={copyEmail} title="Copy email address">
            <RollText text={copied ? 'Copied to clipboard' : EMAIL} />
            {copied ? <Check /> : <Copy />}
          </button>
          <a className="pill" href={PHONE.href}>
            <RollText text={PHONE.display} />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
