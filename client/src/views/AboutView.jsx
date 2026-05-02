import BrandHeader from '../components/BrandHeader';

export default function AboutView() {
  return (
    <main className="about-page">
      <BrandHeader />

      <section className="about-hero" style={{ padding: '3.5rem 8%', background: '#f7fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#2c3e50' }}>About MedHealth</h1>
          <p style={{ color: '#4a5568', marginTop: '0.6rem' }}>MedHealth brings trusted medicines and healthcare services to your doorstep with fast delivery, verified products, and friendly pharmacist support.</p>
        </div>
      </section>

      <section className="about-values" style={{ padding: '3rem 8%', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2>Our Mission</h2>
            <p>To make quality healthcare accessible and affordable for everyone by combining technology, licensed pharmacists, and reliable supply chains.</p>

            <h3 style={{ marginTop: '1.2rem' }}>What we offer</h3>
            <ul>
              <li>Genuine medicines sourced from licensed distributors</li>
              <li>Same-day delivery in major cities</li>
              <li>Secure online ordering and order tracking</li>
              <li>Prescription management and pharmacist support</li>
            </ul>
          </div>

          <div>
            <h2>Our Story</h2>
            <p>Founded to simplify medicine access, MedHealth combines a curated pharmacy network, experienced staff, and a user-friendly app to serve patients and caretakers.</p>

            <h3 style={{ marginTop: '1.2rem' }}>Trusted by customers</h3>
            <p>We adhere to strict quality checks and follow regulatory guidelines to ensure every order is safe and reliable.</p>
          </div>
        </div>
      </section>

      <section className="about-team" style={{ padding: '3rem 8%', background: '#f7fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2>Meet the Team</h2>
          <p style={{ color: '#4a5568' }}>A small dedicated team of pharmacists, engineers, and operations specialists working to keep your family healthy.</p>
        </div>
      </section>

    </main>
  );
}
