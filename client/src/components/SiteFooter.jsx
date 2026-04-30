import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-inner">
          <section className="site-footer-column">
            <h3>Quick Links</h3>
            <nav className="site-footer-links" aria-label="Quick links">
              <Link to="/">Home</Link>
              <Link to="/login">Products</Link>
              <Link to="/customer">Profile</Link>
              <Link to="/">About Us</Link>
              <Link to="/">Contact</Link>
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
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="Instagram">ig</a>
              <a href="#" aria-label="LinkedIn">in</a>
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