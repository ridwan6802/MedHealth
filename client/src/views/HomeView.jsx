import { Link } from 'react-router-dom';
import BrandHeader from '../components/BrandHeader';
import appStoreLogo from './images/app-store.png';
import medhealthLogo from './images/logo.png';
import playStoreLogo from './images/play-store.png';

export default function HomeView() {
  return (
    <main className="home-page">
      <BrandHeader />

      <section className="hero">
        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Get genuine medicines delivered to your doorstep in just 24 hours</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
        <div className="hero-image" aria-hidden="true">
          <div className="hero-image-card">
            <div className="pill pill-one" />
            <div className="pill pill-two" />
            <div className="pill pill-three" />
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose MedHealth?</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Same day delivery available in major cities</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Genuine Medicines</h3>
            <p>100% authentic medicines from licensed pharmacies</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Guaranteed lowest prices or we'll match it</p>
          </article>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-slider">
          <div className="category-card"><h3>Prescription</h3></div>
          <div className="category-card"><h3>Over-the-Counter</h3></div>
          <div className="category-card"><h3>Wellness</h3></div>
          <div className="category-card"><h3>Ayurveda</h3></div>
          <div className="category-card"><h3>Medical Devices</h3></div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-slider">
          <article className="testimonial-card">
            <div className="rating">★★★★★</div>
            <p>"Got my medicines within 2 hours when I was really sick. Lifesavers!"</p>
            <div className="customer">- Ramesh K.</div>
          </article>
          <article className="testimonial-card">
            <div className="rating">★★★★☆</div>
            <p>"The chat with the staff helped me get the right medicines quickly."</p>
            <div className="customer">- Priya M.</div>
          </article>
          <article className="testimonial-card">
            <div className="rating">★★★★★</div>
            <p>"Prices are better than my local pharmacy and delivery is free!"</p>
            <div className="customer">- Amit S.</div>
          </article>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Download Our App</h2>
          <p>Get 10% off on your first order when you use our mobile app</p>
          <div className="app-buttons">
            <a href="#" className="app-store-btn">
              <img src={appStoreLogo} alt="" aria-hidden="true" className="store-button-icon" />
              <span>App Store</span>
            </a>
            <a href="#" className="play-store-btn">
              <img src={playStoreLogo} alt="" aria-hidden="true" className="store-button-icon" />
              <span>Play Store</span>
            </a>
          </div>
        </div>
        <div className="cta-image" aria-hidden="true">
          <img src={medhealthLogo} alt="" className="cta-logo" />
        </div>
      </section>
    </main>
  );
}
