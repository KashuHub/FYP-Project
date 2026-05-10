import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { placeAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/common/MapView';
import StarRating from '../components/common/StarRating';
import { toast } from 'react-toastify';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [placeRes, revRes] = await Promise.all([
          placeAPI.getById(id),
          reviewAPI.getByTarget(id),
        ]);
        setPlace(placeRes.data.place);
        setReviews(revRes.data.reviews || []);
      } catch {
        toast.error('Place not found');
        navigate('/places');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login'); return; }
    if (!reviewForm.rating) { toast.warning('Please rate'); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.create({ targetId: id, targetModel: 'Place', ...reviewForm });
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
  if (!place) return null;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 24 }}>
          <Link to="/places" style={{ color: 'var(--primary)' }}>Places</Link> › {place.location?.region} › {place.name}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--primary-dark)' }}>{place.name}</h1>
          {place.isHiddenGem && <span className="badge badge-accent">💎 Hidden Gem</span>}
          {place.isFeatured && <span className="badge badge-primary">⭐ Featured</span>}
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: 28, flexWrap: 'wrap' }}>
          <span>📍 {place.location?.region}</span>
          {place.altitude && <span>🏔 {place.altitude}</span>}
          {place.difficulty && <span className={`difficulty difficulty-${place.difficulty.toLowerCase()}`}>{place.difficulty}</span>}
          {place.rating > 0 && <span>⭐ {place.rating} ({place.reviewCount} reviews)</span>}
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ aspectRatio: '16/7', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 10 }}>
            <img src={place.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200'} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {place.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {place.images.map((img, i) => (
                <img key={i} src={img.url} alt="" onClick={() => setActiveImg(i)} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', flexShrink: 0, border: activeImg === i ? '3px solid var(--primary)' : '3px solid transparent', opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.2s' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48, alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 32, marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--primary-dark)' }}>About this place</h3>
              <p style={{ color: 'var(--gray-700)', lineHeight: 1.8 }}>{place.description}</p>
            </div>

            {place.activities?.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 32, marginBottom: 32 }}>
                <h3 style={{ marginBottom: 16, color: 'var(--primary-dark)' }}>Activities</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {place.activities.map(a => <span key={a} className="badge badge-primary">{a}</span>)}
                </div>
              </div>
            )}

            {place.tips?.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: 32, marginBottom: 32 }}>
                <h3 style={{ marginBottom: 16, color: 'var(--primary-dark)' }}>💡 Traveler Tips</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {place.tips.map((tip, i) => <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--gray-700)', fontSize: '0.9rem' }}><span>→</span>{tip}</li>)}
                </ul>
              </div>
            )}

            {place.location?.latitude && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ marginBottom: 16, color: 'var(--primary-dark)' }}>Location</h3>
                <MapView singlePin={[place.location.latitude, place.location.longitude]} height="300px" />
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 style={{ marginBottom: 20, color: 'var(--primary-dark)' }}>⭐ Reviews ({reviews.length})</h3>
              {reviews.length === 0 && <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>No reviews yet.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                {reviews.map(r => (
                  <div key={r._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{r.user?.name?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}><StarRating value={r.rating} readonly size="sm" /></div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
              {user && (
                <form onSubmit={handleReview} style={{ background: 'var(--gray-100)', padding: 24, borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 700 }}>Write a Review</h4>
                  <div style={{ marginBottom: 12 }}>
                    <StarRating value={reviewForm.rating} onChange={v => setReviewForm(p => ({ ...p, rating: v }))} size="lg" />
                  </div>
                  <textarea className="form-control" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required />
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-lg)' }}>
              <h3 style={{ marginBottom: 20, color: 'var(--primary-dark)' }}>Quick Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {place.location?.region && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}><span style={{ color: 'var(--gray-500)' }}>Region</span><strong>{place.location.region}</strong></div>}
                {place.category && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 12, borderBottom: '1px solid var(--gray-100)', textTransform: 'capitalize' }}><span style={{ color: 'var(--gray-500)' }}>Type</span><strong>{place.category}</strong></div>}
                {place.altitude && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}><span style={{ color: 'var(--gray-500)' }}>Altitude</span><strong>{place.altitude}</strong></div>}
                {place.difficulty && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}><span style={{ color: 'var(--gray-500)' }}>Difficulty</span><span className={`difficulty difficulty-${place.difficulty.toLowerCase()}`}>{place.difficulty}</span></div>}
                {place.entryFee !== undefined && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}><span style={{ color: 'var(--gray-500)' }}>Entry Fee</span><strong>{place.entryFee === 0 ? 'Free' : `PKR ${place.entryFee}`}</strong></div>}
                {place.bestTimeToVisit?.from && <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}><div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 4 }}>Best Time to Visit</div><strong style={{ fontSize: '0.9rem' }}>{place.bestTimeToVisit.from} – {place.bestTimeToVisit.to}</strong>{place.bestTimeToVisit.notes && <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: 4 }}>{place.bestTimeToVisit.notes}</p>}</div>}
              </div>
              <Link to="/stays" className="btn btn-primary" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'center' }}>🏨 Find Stays Nearby →</Link>
              <Link to="/experiences" className="btn btn-ghost" style={{ width: '100%', marginTop: 10, display: 'flex', justifyContent: 'center' }}>🥾 Book an Experience →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
