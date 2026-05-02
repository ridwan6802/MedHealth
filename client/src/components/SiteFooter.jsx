import { Link } from 'react-router-dom';
import { sessionModel } from '../models/sessionModel';

function SocialIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.7c-.8-.1-1.8-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.9v2.5H7v3.1h2.2v8h4.3z" />
      </svg>
    );
  }

  if (type === 'twitter') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.8-2.7 1-1.6-1.7-4.4-1.4-5.8.5-.8 1-.9 2.3-.5 3.4-3.2-.2-6-1.7-8-4.1-.9 1.6-.5 3.8 1.1 4.8-.6 0-1.2-.2-1.7-.5 0 1.8 1.3 3.4 3.1 3.8-.5.1-1.1.1-1.6 0 .5 1.6 2 2.8 3.8 2.8-1.5 1.2-3.4 1.8-5.3 1.8H3c1.9 1.2 4.1 1.8 6.3 1.8 7.8 0 12-6.5 12-12.1v-.6c.8-.5 1.4-1.2 1.9-2z" />
      </svg>
    );
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.8 2h8.4C19.3 2 22 4.7 22 7.8v8.4c0 3.1-2.7 5.8-5.8 5.8H7.8C4.7 22 2 19.3 2 16.2V7.8C2 4.7 4.7 2 7.8 2zm0 2.2c-1.9 0-3.6 1.7-3.6 3.6v8.4c0 1.9 1.7 3.6 3.6 3.6h8.4c1.9 0 3.6-1.7 3.6-3.6V7.8c0-1.9-1.7-3.6-3.6-3.6H7.8zm4.2 2.7A5.1 5.1 0 1 1 12 17a5.1 5.1 0 0 1 0-10.2zm0 2.2A2.9 2.9 0 1 0 12 15a2.9 2.9 0 0 0 0-5.8zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 9.5h3.7V20H4.5V9.5zM6.3 4A2.1 2.1 0 1 1 6.2 8.2 2.1 2.1 0 0 1 6.3 4zM9.8 9.5h3.5v1.4h.1c.5-.9 1.8-1.8 3.6-1.8 3.9 0 4.6 2.6 4.6 6V20h-3.7v-4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V20H9.8V9.5z" />
    </svg>
  );
}

export default function SiteFooter() {
  const isLoggedIn = Boolean(sessionModel.getToken());
  const user = isLoggedIn ? sessionModel.getUser() : null;
  const homePath = isLoggedIn ? (user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : user?.role === 'customer' ? '/customer' : '/') : '/';
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-inner">
          <section className="site-footer-column">
            <h3>Quick Links</h3>
            <nav className="site-footer-links" aria-label="Quick links">
              <Link to={homePath}>Home</Link>
              <Link to={sessionModel.getToken() ? '/customer' : '/login'}>Products</Link>
              <Link to="/customer">Profile</Link>
              <Link to="/about">About Us</Link>
            </nav>
          </section>

          <section className="site-footer-column">
            <h3>Services</h3>
            <div className="site-footer-links site-footer-text-links">
              <span>Medicine Delivery</span>
              <span>Doctor Consultation</span>
              <span>Health Checkups</span>
              <span>Prescription Management</span>
            </div>
          </section>

          <section className="site-footer-column">
            <h3>Contact Us</h3>
            <div className="site-footer-contact">
              <p><span className="footer-icon">📍</span> Dhaka, Bangladesh</p>
              <p><span className="footer-icon">📞</span> +880 1717 171717</p>
              <p><span className="footer-icon">✉️</span> support@medhealth.com</p>
            </div>
          </section>

          <section className="site-footer-column">
            <h3>Follow Us</h3>
            <div className="site-footer-socials" aria-label="Social media links">
              <a href="#" aria-label="Facebook" className="site-social-link">
                <SocialIcon type="facebook" />
              </a>
              <a href="#" aria-label="Twitter" className="site-social-link">
                <SocialIcon type="twitter" />
              </a>
              <a href="#" aria-label="Instagram" className="site-social-link">
                <SocialIcon type="instagram" />
              </a>
              <a href="#" aria-label="LinkedIn" className="site-social-link">
                <SocialIcon type="linkedin" />
              </a>
            </div>
          </section>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <p>© 2026 MedHealth Online Pharmacy. All rights reserved.</p>
          <div className="site-footer-policy-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}