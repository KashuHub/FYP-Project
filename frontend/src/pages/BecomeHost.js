import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BecomeHost.css';

const steps = [
  { num: '01', icon: '📝', title: 'Create an Account', desc: 'Sign up as a Host on Tourista. It\'s completely free. No hidden fees.' },
  { num: '02', icon: '🏠', title: 'List Your Property', desc: 'Add photos, description, amenities, location on the map, and set your price per night.' },
  { num: '03', icon: '⏳', title: 'Wait for Approval', desc: 'Our admin team reviews every listing to ensure quality. Approval takes 24-48 hours.' },
  { num: '04', icon: '🎉', title: 'Start Hosting!', desc: 'Go live and start receiving bookings from travelers exploring Gilgit-Baltistan.' },
];

const earnings = [
  { type: 'Guesthouse', range: 'PKR 3,000 – 8,000', per: 'per night' },
  { type: 'Cabin / Camp', range: 'PKR 4,000 – 12,000', per: 'per night' },
  { type: 'Hotel Room', range: 'PKR 6,000 – 20,000', per: 'per night' },
  { type: 'Trekking Experience', range: 'PKR 5,000 – 50,000', per: 'per person' },
  { type: 'Jeep Safari', range: 'PKR 8,000 – 30,000', per: 'per group' },
  { type: 'Cultural Tour', range: 'PKR 2,000 – 8,000', per: 'per person' },
];

const faqs = [
  { q: 'Is it free to list on Tourista?', a: 'Yes! Creating an account and listing your property is completely free. We only earn when you earn — a small commission is applied per booking.' },
  { q: 'How long does approval take?', a: 'Our team reviews all listings within 24-48 hours. We check for accuracy, quality photos, and compliance with our community standards.' },
  { q: 'Can I list experiences too?', a: 'Absolutely! Hosts can list trekking tours, cultural tours, jeep safaris, camping packages, and more alongside or instead of properties.' },
  { q: 'What if a guest cancels?', a: 'Our cancellation policy protects hosts. If a guest cancels within 48 hours of check-in, you retain a portion of the booking amount.' },
  { q: 'Do I need to be in GB to list?', a: 'Your property or experience must be located in Gilgit-Baltistan, but you can manage listings from anywhere once set up.' },
];

const BecomeHost = () => {
  const { user } = useAuth();

  return (
    <div className="become-host-page">
      {/* Hero */}
      <section className="bh-hero">
        <div className="bh-hero-bg">
          <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80" alt="Host" />
          <div className="bh-hero-overlay"></div>
        </div>
        <div className="container bh-hero-content">
          <h1>Share Your Home with the World</h1>
          <p>Turn your guesthouse, cabin, or local expertise into a source of income. Join our growing community of GB hosts.</p>
          <div className="bh-hero-actions">
            {user?.role === 'host' || user?.role === 'admin' ? (
              <Link to="/host" className="btn btn-accent btn-lg">Go to Host Panel →</Link>
            ) : (
              <Link to="/register" className="btn btn-accent btn-lg">Get Started — It's Free</Link>
            )}
            <a href="#how-it-works" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Learn More</a>
          </div>
          <div className="bh-hero-stats">
            <div className="bh-stat"><strong>120+</strong><span>Active Hosts</span></div>
            <div className="bh-stat"><strong>10K+</strong><span>Bookings Made</span></div>
            <div className="bh-stat"><strong>PKR 0</strong><span>To List</span></div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Four simple steps to start hosting on Tourista</p>
          <div className="bh-steps">
            {steps.map((step, i) => (
              <div key={step.num} className="bh-step">
                <div className="bh-step-num">{step.num}</div>
                <div className="bh-step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className="bh-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>What Can You Earn?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Estimated earnings for listings in Gilgit-Baltistan</p>
          <div className="bh-earnings-grid">
            {earnings.map(e => (
              <div key={e.type} className="bh-earning-card">
                <h4>{e.type}</h4>
                <div className="bh-earning-range">{e.range}</div>
                <div className="bh-earning-per">{e.per}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: 20 }}>
            * Earnings vary by season, location, and listing quality. Peak season (June–September) can yield 2–3x higher bookings.
          </p>
        </div>
      </section>

      {/* Why Tourista */}
      <section className="section">
        <div className="container">
          <div className="bh-why-grid">
            <div className="bh-why-img">
              <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=700" alt="GB Tourism" />
            </div>
            <div className="bh-why-content">
              <h2>Why Host on Tourista?</h2>
              <div className="bh-why-points">
                {[
                  { icon: '🎯', title: 'Targeted Audience', desc: 'We attract travelers specifically interested in GB tourism — no irrelevant traffic.' },
                  { icon: '🗺️', title: 'Map Visibility', desc: 'Your property appears on our interactive map, giving you geographic discoverability.' },
                  { icon: '🔒', title: 'Secure Bookings', desc: 'All bookings are processed through our secure system. You control acceptance.' },
                  { icon: '📊', title: 'Host Dashboard', desc: 'Manage all your listings, bookings, and earnings from one clean dashboard.' },
                  { icon: '⭐', title: 'Reviews System', desc: 'Build your reputation through verified guest reviews. Great ratings = more bookings.' },
                  { icon: '🆓', title: 'Free to Start', desc: 'No upfront costs, no monthly fees. List for free and pay only when you earn.' },
                ].map(p => (
                  <div key={p.title} className="bh-why-point">
                    <span className="bh-why-icon">{p.icon}</span>
                    <div>
                      <strong>{p.title}</strong>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Everything you need to know about hosting on Tourista</p>
          <div className="bh-faqs">
            {faqs.map((faq, i) => (
              <details key={i} className="bh-faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bh-cta-bottom">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Start Hosting?</h2>
          <p>Join 120+ hosts earning from their properties across Gilgit-Baltistan</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            {user?.role === 'host' || user?.role === 'admin' ? (
              <Link to="/host" className="btn btn-accent btn-lg">Open Host Panel →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-accent btn-lg">Create Host Account</Link>
                <Link to="/login" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Already a host? Login</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeHost;
