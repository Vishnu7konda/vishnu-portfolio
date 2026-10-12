import SocialLinks from './SocialLinks';
import { scrollToId } from '../lib/motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>&copy; {new Date().getFullYear()} Vishnu Konda. Crafted with passion and precision.</p>
        <div className="footer-right">
          <SocialLinks className="social-links" />
          <button className="social-link back-to-top" onClick={() => scrollToId('home')} aria-label="Back to top">
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}
