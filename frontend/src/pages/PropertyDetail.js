import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI, reviewAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/common/MapView';
import StarRating from '../components/common/StarRating';
import { toast } from 'react-toastify';
import './PropertyDetail.css';

const amenityIcons = {
  'WiFi': '📶', 'Heating': '🔥', 'Hot Water': '🚿', 'Meals': '🍽️',
  'Guide': '🧭', 'Parking': '🅿️', 'Generator': '⚡', 'Kitchen': '🍳',
  'Laundry': '👕', 'TV': '📺', 'Mountain View': '🏔', 'River View': '🏞'
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: { adults: 1, children: 0, total: 1 } });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, revRes] = await Promise.all([
          propertyAPI.getById(id),
          reviewAPI.getByTarget(id),
        ]);
        setProperty(propRes.data.property);
        setReviews(revRes.data.reviews || []);
      } catch {
        toast.error('Property not found');
        navigate('/stays');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (booking.checkIn && booking.checkOut) {
      const n = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
      setNights(n > 0 ? n : 0);
    } else {
      setNights(0);
    }
  }, [booking.checkIn, booking.checkOut]);

  const handleBook = async () => {
    if (!user) { toast.info('Please login to book'); navigate('/login'); return; }
    if (!booking.checkIn || !booking.checkOut) { toast.warning('Please select dates'); return; }
    if (nights < 1) { toast.warning('Check-out must be after check-in'); return; }
    setBookingLoading(true);
    try {
      await bookingAPI.create({ propertyId: id, ...booking });
      toast.success('🎉 Booking confirmed! Check My Bookings.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to review'); return; }
    if (reviewForm.rating === 0) { toast.warning('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await reviewAPI.create({ targetId: id, targetModel: 'Property', ...reviewForm });
      setReviews(prev => [data.review, ...prev]);
      setReviewForm({ rating: 0, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="spinner-wrapper" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!property) return null;

  const totalPrice = nights > 0 ? property.price * nights : 0;

  return (
    <div className="property-detail">
      <div className="container">
        {/* Header */}
        <div className="pd-header">
          <div>
            <h1 className="pd-title">{property.title}</h1>
            <div className="pd-meta">
              {property.rating > 0 && <span>⭐ {property.rating} · {property.reviewCount} reviews</span>}
              <span>📍 {property.location?.address}, {property.location?.region}</span>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{property.propertyType}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={property.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900'} alt={property.title} />
          </div>
          {property.images?.length > 1 && (
            <div className="pd-thumbs">
              {property.images.map((img, i) => (
                <img key={i} src={img.url} alt={`View ${i + 1}`} className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="pd-body">
          {/* Left: Info */}
          <div className="pd-info">
            <div className="pd-host-bar">
              <div className="pd-host">
                <div className="pd-host-avatar">{property.host?.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <div className="pd-host-label">Hosted by</div>
                  <div className="pd-host-name">{property.host?.name}</div>
                </div>
              </div>
              <div className="pd-capacity">
                <span>👥 {property.maxGuests} guests</span>
                <span>🛏 {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                <span>🚿 {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="pd-section">
              <h3>About this place</h3>
              <p>{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="pd-section">
                <h3>What this place offers</h3>
                <div className="pd-amenities">
                  {property.amenities.map(a => (
                    <div key={a} className="pd-amenity">
                      <span>{amenityIcons[a] || '✓'}</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.rules?.length > 0 && (
              <div className="pd-section">
                <h3>House Rules</h3>
                <ul className="pd-rules">
                  {property.rules.map((r, i) => <li key={i}>✓ {r}</li>)}
                </ul>
              </div>
            )}

            <div className="pd-section">
              <h3>Location</h3>
              <p style={{ marginBottom: 16, color: 'var(--gray-600)' }}>📍 {property.location?.address}, {property.location?.city}, {property.location?.region}</p>
              {property.location?.latitude && (
                <MapView
                  singlePin={[property.location.latitude, property.location.longitude]}
                  height="300px"
                />
              )}
            </div>

            {/* Reviews */}
            <div className="pd-section">
              <h3>⭐ {property.rating} · {property.reviewCount} Reviews</h3>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--gray-500)' }}>No reviews yet. Be the first!</p>
              ) : (
                <div className="pd-reviews">
                  {reviews.map(r => (
                    <div key={r._id} className="pd-review">
                      <div className="review-header">
                        <div className="review-avatar">{r.user?.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <div className="review-name">{r.user?.name}</div>
                          <div className="review-date">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <StarRating value={r.rating} readonly size="sm" />
                        </div>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Write Review */}
              {user && (
                <form className="review-form" onSubmit={handleReview}>
                  <h4>Write a Review</h4>
                  <div style={{ marginBottom: 12 }}>
                    <StarRating value={reviewForm.rating} onChange={v => setReviewForm(p => ({ ...p, rating: v }))} size="lg" />
                  </div>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={submittingReview} style={{ marginTop: 12 }}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="pd-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <strong>PKR {property.price?.toLocaleString()}</strong>
                <span> / night</span>
              </div>
              {property.rating > 0 && (
                <div className="booking-rating">⭐ {property.rating} · {property.reviewCount} reviews</div>
              )}

              <div className="booking-dates">
                <div className="booking-date-field">
                  <label>CHECK-IN</label>
                  <input type="date" className="form-control" value={booking.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking(p => ({ ...p, checkIn: e.target.value }))} />
                </div>
                <div className="booking-date-field">
                  <label>CHECK-OUT</label>
                  <input type="date" className="form-control" value={booking.checkOut}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setBooking(p => ({ ...p, checkOut: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label>GUESTS</label>
                <select className="form-control form-select" value={booking.guests.total}
                  onChange={e => setBooking(p => ({ ...p, guests: { ...p.guests, adults: Number(e.target.value), total: Number(e.target.value) } }))}>
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {nights > 0 && (
                <div className="booking-breakdown">
                  <div className="breakdown-row">
                    <span>PKR {property.price?.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row breakdown-total">
                    <strong>Total</strong>
                    <strong>PKR {totalPrice.toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleBook} disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : user ? 'Reserve' : 'Login to Book'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: 10 }}>
                You won't be charged yet
              </p>

              {property.host?.bio && (
                <div className="booking-host-info">
                  <strong>About the host</strong>
                  <p>{property.host.bio}</p>
                  {property.host.phone && <p>📞 {property.host.phone}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
