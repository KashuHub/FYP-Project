import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaCommentDots,
  FaEnvelope,
  FaExclamationTriangle,
  FaFlag,
  FaHandsHelping,
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaShieldAlt,
  FaSitemap,
  FaUniversity,
  FaUpload,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Contact.css';

const contactInfo = [
  { icon: FaEnvelope, label: 'Email', value: 'info@tourista.pk', link: 'mailto:info@tourista.pk' },
  { icon: FaPhoneAlt, label: 'Phone', value: '+92 315 000 0000', link: 'tel:+923150000000' },
  { icon: FaMapMarkerAlt, label: 'Address', value: 'University of Agriculture, Peshawar, KPK, Pakistan' },
  { icon: FaRegClock, label: 'Office Hours', value: 'Mon–Fri: 9AM – 5PM (PKT)' },
];

const emergencyContacts = [
  { name: 'GB Police', number: '1122', icon: FaShieldAlt },
  { name: 'Rescue & Emergency', number: '1122', icon: FaHandsHelping },
  { name: 'PTDC Islamabad', number: '051-9213398', icon: FaSitemap },
  { name: 'GB Tourism Dept', number: '05811-920276', icon: FaFlag },
  { name: 'Gilgit District HQ', number: '05811-920100', icon: FaUniversity },
  { name: 'Skardu Tourism Office', number: '05815-452111', icon: FaHome },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending (no backend email endpoint in MVP)
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '', type: 'general' });
    setSending(false);
  };

  return (
    <div className="contact-page">
      <div className="page-hero" style={{ marginBottom: 0 }}>
        <div className="container page-hero-content">
          <h1>Contact Us</h1>
          <p>Have a question? We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px 80px' }}>
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-wrap">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Inquiry Type</label>
                <div className="contact-type-chips">
                  {[
                    { value: 'general', label: <><FaCommentDots style={{ marginRight: 6 }} /> General</> },
                    { value: 'booking', label: <><FaCalendarAlt style={{ marginRight: 6 }} /> Booking Help</> },
                    { value: 'host', label: <><FaHome style={{ marginRight: 6 }} /> Host Support</> },
                    { value: 'report', label: <><FaExclamationTriangle style={{ marginRight: 6 }} /> Report Issue</> },
                  ].map(t => (
                    <button
                      type="button" key={t.value}
                      className={`chip ${form.type === t.value ? 'active' : ''}`}
                      onClick={() => setForm(p => ({ ...p, type: t.value }))}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" className="form-control" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ali Hassan" required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="ali@example.com" required />
                </div>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input type="text" className="form-control" value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="How can we help you?" required />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  className="form-control" rows={6} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Write your message here..." required
                />
                <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                  {form.message.length} / 1000 characters
                </small>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={sending}>
                {sending ? <><FaUpload style={{ marginRight: 6 }} /> Sending...</> : <><FaUpload style={{ marginRight: 6 }} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="contact-sidebar">
            {/* Contact Info */}
            <div className="contact-info-card">
              <h3>Get in Touch</h3>
              <div className="contact-info-items">
                {contactInfo.map(info => (
                  <div key={info.label} className="contact-info-item">
                    <span className="contact-info-icon"><info.icon /></span>
                    <div>
                      <div className="contact-info-label">{info.label}</div>
                      {info.link ? (
                        <a href={info.link} className="contact-info-value">{info.value}</a>
                      ) : (
                        <div className="contact-info-value">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="emergency-card">
              <h3><FaExclamationTriangle style={{ marginRight: 8 }} /> Emergency Contacts in GB</h3>
              <p>If you're in an emergency situation while traveling in Gilgit-Baltistan, contact:</p>
              <div className="emergency-contacts">
                {emergencyContacts.map(ec => (
                  <a key={ec.name} href={`tel:${ec.number}`} className="emergency-contact-item">
                    <span><ec.icon /></span>
                    <div>
                      <div className="ec-name">{ec.name}</div>
                      <div className="ec-number">{ec.number}</div>
                    </div>
                    <span className="ec-call"><FaPhoneAlt /></span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="contact-faq-card">
              <h3>Common Questions</h3>
              <div className="contact-faqs">
                {[
                  { q: 'How do I cancel a booking?', a: 'Go to My Bookings and click Cancel on the relevant booking.' },
                  { q: 'How do I become a host?', a: 'Register as a Host, then submit your property from the Host Panel.' },
                  { q: 'Is Tourista free to use?', a: 'Yes, browsing and booking is free. Hosts pay a small commission per booking.' },
                ].map((faq, i) => (
                  <div key={i} className="contact-faq-item">
                    <strong>Q: {faq.q}</strong>
                    <p>A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
