import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🏔 Tourista GB</Link>
          <p>Your gateway to the majestic valleys, peaks, and culture of Gilgit-Baltistan, Pakistan.</p>
          <div className="footer-socials">
            <a href="#!" aria-label="Facebook">📘</a>
            <a href="#!" aria-label="Instagram">📸</a>
            <a href="#!" aria-label="Twitter">🐦</a>
            <a href="#!" aria-label="YouTube">📺</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/stays">All Stays</Link></li>
            <li><Link to="/experiences">Experiences</Link></li>
            <li><Link to="/places">Places to Visit</Link></li>
            <li><Link to="/stays?type=hotel">Hotels</Link></li>
            <li><Link to="/stays?type=cabin">Cabins</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Regions</h4>
          <ul>
            <li><Link to="/places?region=Hunza">Hunza Valley</Link></li>
            <li><Link to="/places?region=Skardu">Skardu</Link></li>
            <li><Link to="/places?region=Astore">Astore</Link></li>
            <li><Link to="/places?region=Ghizer">Ghizer</Link></li>
            <li><Link to="/places?region=Nagar">Nagar</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/become-host">Become a Host</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Emergency Contacts</h4>
          <ul className="emergency-list">
            <li>🚔 GB Police: <strong>1122</strong></li>
            <li>🏥 Rescue: <strong>1122</strong></li>
            <li>⛑️ PTDC: <strong>051-9213398</strong></li>
            <li>🗺️ Tourism Dept: <strong>05811-920276</strong></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tourista GB. All rights reserved. | University of Agriculture, Peshawar – FYP 2022-2026</p>
        <p>🇵🇰 Proudly promoting tourism in Pakistan</p>
      </div>
    </div>
  </footer>
);

export default Footer;
