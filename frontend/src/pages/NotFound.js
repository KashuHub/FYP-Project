import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '80vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    padding: '40px 24px',
    background: 'linear-gradient(135deg, var(--off-white) 0%, var(--white) 100%)'
  }}>
    <div style={{ fontSize: '6rem', marginBottom: 24, lineHeight: 1 }}>🏔</div>
    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: 8, lineHeight: 1 }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-700)', marginBottom: 12 }}>Trail Not Found</h2>
    <p style={{ color: 'var(--gray-500)', fontSize: '1rem', maxWidth: 420, marginBottom: 36, lineHeight: 1.7 }}>
      Looks like you've wandered off the beaten path. The page you're looking for doesn't exist — but Gilgit-Baltistan has plenty of real paths to explore!
    </p>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" className="btn btn-primary btn-lg">🏠 Back to Home</Link>
      <Link to="/places" className="btn btn-outline btn-lg">🗺️ Explore Places</Link>
    </div>
  </div>
);

export default NotFound;
