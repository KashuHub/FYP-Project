import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { experienceAPI, reviewAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/common/MapView';
import StarRating from '../components/common/StarRating';
import { toast } from 'react-toastify';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({ experienceDate: '', guests: { total: 1 } });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [expRes, revRes] = await Promise.all([
          experienceAPI.getById(id),
          reviewAPI.getByTarget(id),
        ]);
        setExperience(expRes.data.experience);
        setReviews(revRes.data.reviews || []);
      } catch {
        toast.error('Experience not found');
        navigate('/experiences');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleBook = async () => {
    if (!user) { toast.info('Please login to book'); navigate('/login'); return; }
    if (!booking.experienceDate) { toast.warning('Please select a date'); return; }
    setBookingLoading(true);
    try {
      await bookingAPI.create({ experienceId: id, ...booking });
      toast.success('🎉 Experience booked! Check My Bookings.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login'); return; }
    if (!reviewForm.rating) { toast.warning('Please select a rating'); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.create({ targetId: id, targetModel: 'Experience', ...reviewForm });
      setReviews(p => [data.review, ...p]);
      setReviewForm({ rating: 0, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrapper" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!experience) return null;

  const totalPrice = experience.price * (booking.guests.total || 1);
  const typeIcons = { trekking:'🥾', cultural:'🎭', 'jeep-safari':'🚙', camping:'⛺', photography:'📷', fishing:'🎣', 'rock-climbing':'🧗' };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 24 }}>
          <Link to="/experiences" style={{ color: 'var(--primary)' }}>Experiences</Link> › {experience.location?.region} › {experience.title}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '2rem' }}>{typeIcons[experience.type] || '🌟'}</span>
          <h1 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', color: 'var(--primary-dark)' }}>{experience.title}</h1>
          {experience.isFeatured && <span className="badge badge-accent">⭐ Popular</span>}
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: 28, flexWrap: 'wrap' }}>
          <span>📍 {experience.location?.name || experience.location?.region}</span>
          <span>⏱ {experience.duration?.value} {experience.duration?.unit}</span>
          <span>👥 Max {experience.maxGroupSize} people</span>
          <span className={`difficulty difficulty-${experience.difficultyLevel?.toLowerCase()}`}>{experience.difficultyLevel}</span>
          {experience.rating > 0 && <span>⭐ {experience.rating} ({experience.reviewCount})</span>}
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ aspectRatio: '16/7', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 10 }}>
            <img src={experience.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200'} alt={experience.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {experience.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {experience.images.map((img, i) => (
                <img key={i} src={img.url} alt="" onClick={() => setActiveImg(i)} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', flexShrink: 0, border: activeImg === i ? '3px solid var(--primary)' : '3px solid transparent', opacity: activeImg === i ? 1 : 0.65, transition: 'all 0.2s' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 28, marginBottom: 28 }}>
              <h3 style={{ marginBottom: 14, color: 'var(--primary-dark)' }}>About this experience</h3>
              <p style={{ color: 'var(--gray-700)', lineHeight: 1.8 }}>{experience.description}</p>
            </div>

            {experience.includes?.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 28, marginBottom: 28 }}>
                <h3 style={{ marginBottom: 14, color: 'var(--primary-dark)' }}>✅ What's Included</h3>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {experience.includes.map((item, i) => <li key={i} style={{ fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', gap: 8, alignItems: 'flex-start', background: 'var(--gray-100)', padding: '10px 14px', borderRadius: 8 }}><span>✓</span>{item}</li>)}
                </ul>
              </div>
            )}

            {experience.requirements?.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 28, marginBottom: 28 }}>
                <h3 style={{ marginBottom: 14, color: 'var(--primary-dark)' }}>📋 Requirements</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {experience.requirements.map((r, i) => <li key={i} style={{ fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', gap: 8 }}><span>→</span>{r}</li>)}
                </ul>
              </div>
            )}

            {experience.location?.latitude && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ marginBottom: 14, color: 'var(--primary-dark)' }}>Meeting Point</h3>
                <MapView singlePin={[experience.location.latitude, experience.location.longitude]} height="280px" />
              </div>
            )}

            <div>
              <h3 style={{ marginBottom: 20, color: 'var(--primary-dark)' }}>Reviews ({reviews.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                {reviews.map(r => (
                  <div key={r._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{r.user?.name?.charAt(0)?.toUpperCase()}</div>
                      <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.user?.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(r.createdAt).toLocaleDateString()}</div></div>
                      <div style={{ marginLeft: 'auto' }}><StarRating value={r.rating} readonly size="sm" /></div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
              {user && (
                <form onSubmit={handleReview} style={{ background: 'var(--gray-100)', padding: 24, borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 700 }}>Write a Review</h4>
                  <div style={{ marginBottom: 12 }}><StarRating value={reviewForm.rating} onChange={v => setReviewForm(p => ({ ...p, rating: v }))} size="lg" /></div>
                  <textarea className="form-control" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required />
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
                </form>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>
                <strong style={{ color: 'var(--primary)' }}>PKR {experience.price?.toLocaleString()}</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}> / person</span>
              </div>
              {experience.rating > 0 && <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: 20, fontWeight: 500 }}>⭐ {experience.rating} · {experience.reviewCount} reviews</div>}

              <div className="form-group">
                <label>SELECT DATE</label>
                <input type="date" className="form-control" value={booking.experienceDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBooking(p => ({ ...p, experienceDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>NUMBER OF PEOPLE</label>
                <select className="form-control form-select" value={booking.guests.total}
                  onChange={e => setBooking(p => ({ ...p, guests: { total: Number(e.target.value) } }))}>
                  {Array.from({ length: experience.maxGroupSize }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>

              <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
                  <span>PKR {experience.price?.toLocaleString()} × {booking.guests.total} {booking.guests.total === 1 ? 'person' : 'people'}</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--gray-200)', paddingTop: 8 }}>
                  <strong>Total</strong><strong>PKR {totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <button className="btn btn-accent btn-lg" style={{ width: '100%' }} onClick={handleBook} disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : user ? '🎯 Book Now' : 'Login to Book'}
              </button>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)' }}>
                <strong style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem' }}>Hosted by</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{experience.host?.name?.charAt(0)?.toUpperCase()}</div>
                  <div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{experience.host?.name}</div>{experience.host?.bio && <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{experience.host.bio.substring(0, 60)}...</div>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
