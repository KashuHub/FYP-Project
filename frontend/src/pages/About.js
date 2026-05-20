import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaHome, FaMapMarkedAlt, FaMoneyBillWave } from 'react-icons/fa';
import './About.css';

const team = [
  { name: 'Kashif Qamar', role: 'Backend Lead', id: '576', emoji: '⚙️', desc: 'Node.js, Express, MongoDB, JWT Auth & API Design' },
  { name: 'Muhammad Muneeb', role: 'Integration & Maps', id: '100', emoji: '🗺️', desc: 'API Integration, Map Features & Booking Logic' },
  { name: 'Mueed Hassan', role: 'Frontend Lead', id: '570', emoji: '🎨', desc: 'React.js, Tailwind CSS, UI/UX & Responsive Design' },
];

const About = () => (
  <div className="about-page">
    {/* Hero */}
    <section className="about-hero">
      <div className="about-hero-bg">
        <img src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1600" alt="Gilgit-Baltistan" />
        <div className="about-hero-overlay"></div>
      </div>
      <div className="container about-hero-content">
        <h1>About Tourista GB</h1>
        <p>Pakistan's dedicated platform for Gilgit-Baltistan tourism</p>
      </div>
    </section>

    <div className="container" style={{ maxWidth: 960 }}>
      {/* Mission */}
      <section className="about-section">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>Tourista was built with one goal: to make Gilgit-Baltistan accessible to every traveler. GB is home to some of the world's most spectacular mountain landscapes — from the mighty K2 to the turquoise waters of Attabad Lake — yet tourism infrastructure has lagged behind the destination's incredible potential.</p>
          <p>We connect travelers with local hosts, authentic experiences, and hidden gems across all eight districts of GB, creating economic opportunities for local communities while promoting sustainable, responsible tourism.</p>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="about-section">
        <h2 className="section-title">The Problem We Solve</h2>
        <div className="about-problems">
          {[
            { icon: FiSearch, title: 'Fragmented Information', desc: 'Travelers spend hours searching Facebook groups, WhatsApp chats, and unverified blogs to plan a GB trip. Tourista centralizes everything.' },
            { icon: FaHome, title: 'No Booking Platform', desc: 'Most guesthouses in GB had no online presence. Tourista gives every local host a digital storefront and booking system.' },
            { icon: FaMapMarkedAlt, title: 'No Interactive Maps', desc: 'Finding the exact location of a guesthouse or trailhead in GB was nearly impossible. Our integrated map solves this.' },
            { icon: FaMoneyBillWave, title: 'No Transparent Pricing', desc: 'Prices were negotiated ad-hoc with no benchmarks. Tourista brings pricing transparency to GB hospitality.' },
          ].map(p => (
            <div key={p.title} className="about-problem-card">
              <span><p.icon /></span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      {/* <section className="about-section">
        <h2 className="section-title">Technology Stack</h2>
        <div className="tech-grid">
          {[
            { label: 'Frontend', items: ['React.js', 'React Router v6', 'Leaflet Maps', 'React Toastify'] },
            { label: 'Backend', items: ['Node.js', 'Express.js', 'JWT Auth', 'Bcrypt.js'] },
            { label: 'Database', items: ['MongoDB', 'Mongoose ODM', 'Indexing', 'Aggregation'] },
            { label: 'DevOps', items: ['REST APIs', 'Rate Limiting', 'CORS', 'Helmet.js'] },
          ].map(t => (
            <div key={t.label} className="tech-card">
              <h4>{t.label}</h4>
              <ul>
                {t.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section> */}

      {/* Team */}
      <section className="about-section">
        <h2 className="section-title" style={{ textAlign: 'center' , marginBottom:20}}>Meet the Team</h2>
        {/* <p className="section-subtitle" style={{ textAlign: 'center' }}>Final Year Project — BS Computer Science, University of Agriculture, Peshawar (2022–2026)</p> */}
        {/* <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 32, fontSize: '0.9rem' }}>
          Supervisor: <strong>Ms. Lala Rukh</strong>
        </p> */}
        <div className="team-grid">
          {team.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">{member.emoji}</div>
              <h3>{member.name}</h3>
              {/* <div className="team-role">{member.role}</div>
              <div className="team-id">Student ID: {member.id}</div> */}
              <p>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About GB */}
      <section className="about-section">
        <div className="about-gb">
          <div className="about-gb-content">
            <h2>About Gilgit-Baltistan</h2>
            <p>Gilgit-Baltistan is Pakistan's northernmost territory and one of the most spectacular mountain regions on Earth. It borders China, Afghanistan, and Indian-occupied Kashmir, and is home to three of the world's greatest mountain ranges — the Karakoram, Himalayas, and Hindu Kush.</p>
            <p>The region contains five of the world's seventeen 8,000m peaks, including K2 (8,611m) — the world's second highest and arguably its most challenging. It also contains the largest glaciers outside the polar regions, including the Biafo and Baltoro glaciers.</p>
            <div className="gb-facts">
              <div className="gb-fact"><strong>5</strong><span>8,000m+ peaks</span></div>
              <div className="gb-fact"><strong>8</strong><span>Districts</span></div>
              <div className="gb-fact"><strong>72,971</strong><span>km² area</span></div>
              <div className="gb-fact"><strong>1,800+</strong><span>Glaciers</span></div>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600" alt="GB Mountains" />
        </div>
      </section>

      {/* CTA */}
      <section className="about-section" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>Start Your GB Journey</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: 28 }}>Explore stays, experiences, and hidden gems across Gilgit-Baltistan</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/stays" className="btn btn-primary btn-lg">Browse Stays</Link>
          <Link to="/places" className="btn btn-outline btn-lg">Explore Places</Link>
          <Link to="/contact" className="btn btn-ghost btn-lg">Contact Us</Link>
        </div>
      </section>
    </div>
  </div>
);

export default About;
