import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Wishlist.css';
import { IoSearch } from 'react-icons/io5';
import { FaHotel, FaMapMarkedAlt, FaHome, FaTree, FaStar } from 'react-icons/fa';

const regions = ['Hunza','Skardu','Ghizer','Astore','Ghanche','Diamer','Nagar','Gilgit'];

const Wishlist = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch full wishlist (populated properties) from /api/auth/me
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getMe();
      const items = data.user?.wishlist || [];
      // Backend populates wishlist with Property objects
      // Filter out any that are just ID strings (not fully populated)
      const populated = items.filter(item => typeof item === 'object' && item !== null && item.title);
      setWishlist(populated);
      // Keep auth context in sync
      if (updateUser) updateUser(data.user);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Remove item from wishlist
  const handleRemove = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(propertyId);
    try {
      await authAPI.toggleWishlist(propertyId);
      setWishlist(prev => prev.filter(p => p._id !== propertyId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setRemoving(null);
    }
  };

  // Filter & sort
  const filtered = wishlist
    .filter(p => filter === 'All' || p.location?.region === filter)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'recent' — keep original order
    });

  const usedRegions = [...new Set(wishlist.map(p => p.location?.region).filter(Boolean))];

  const typeIcons = {
    hotel: '🏨', guesthouse: '🏡', cabin: '🪵',
    resort: '✨', hostel: '🛏', apartment: '🏢',
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wl-hero">
          <div className="container wl-hero-content">
            <h1>❤️ My Wishlist</h1>
            <p>Your saved properties across Gilgit-Baltistan</p>
          </div>
        </div>
        <div className="container">
          <div className="wl-skeleton-grid">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="wl-skeleton-card">
                <div className="wl-skeleton-img skeleton-pulse"></div>
                <div style={{ padding: 14 }}>
                  <div className="skeleton-pulse" style={{ height: 12, borderRadius: 6, marginBottom: 8, width: '60%' }}></div>
                  <div className="skeleton-pulse" style={{ height: 16, borderRadius: 6, marginBottom: 12, width: '85%' }}></div>
                  <div className="skeleton-pulse" style={{ height: 12, borderRadius: 6, width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* Hero */}
      <div className="wl-hero">
        <div className="container wl-hero-content">
          <div className="wl-hero-left">
            <h1>❤️ My Wishlist</h1>
            <p>
              {wishlist.length === 0
                ? 'Start saving properties you love'
                : `${wishlist.length} saved ${wishlist.length === 1 ? 'property' : 'properties'} across Gilgit-Baltistan`}
            </p>
          </div>
          <div className="wl-hero-actions">
            <Link to="/stays" className="btn btn-primary">
              <IoSearch style={{ width: 20, height: 20 }} /> Explore More
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>

        {wishlist.length > 0 && (
          <>
            {/* Stats bar */}
            <div className="wl-stats">
              <div className="wl-stat">
                <strong>{wishlist.length}</strong>
                <span>Saved</span>
              </div>
              <div className="wl-stat">
                <strong>{usedRegions.length}</strong>
                <span>Regions</span>
              </div>
              <div className="wl-stat">
                <strong>
                  PKR {Math.min(...wishlist.map(p => p.price || 0)).toLocaleString()}
                </strong>
                <span>Lowest</span>
              </div>
              <div className="wl-stat">
                <strong>
                  {wishlist.length > 0
                    ? (wishlist.reduce((s, p) => s + (p.rating || 0), 0) / wishlist.length).toFixed(1)
                    : '—'}
                </strong>
                <span>Avg Rating</span>
              </div>
            </div>

            {/* Filter & Sort */}
            <div className="wl-toolbar">
              <div className="wl-filters">
                <button
                  className={`chip ${filter === 'All' ? 'on' : ''}`}
                  onClick={() => setFilter('All')}
                >
                  All Regions
                </button>
                {usedRegions.map(r => (
                  <button
                    key={r}
                    className={`chip ${filter === r ? 'on' : ''}`}
                    onClick={() => setFilter(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <select
                className="form-control form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ width: 'auto', fontSize: '0.88rem' }}
              >
                <option value="recent">Recently Saved</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Results count */}
            <p className="wl-count">
              Showing {filtered.length} of {wishlist.length} saved {wishlist.length === 1 ? 'property' : 'properties'}
            </p>
          </>
        )}

        {/* Empty state */}
        {wishlist.length === 0 && (
          <div className="wl-empty">
            <div className="wl-empty-icon">🤍</div>
            <h2>Your wishlist is empty</h2>
            <p>
              Browse stays across Gilgit-Baltistan and tap the ❤️ heart icon
              on any property to save it here.
            </p>
            <div className="wl-empty-actions">
              <Link to="/stays" className="btn btn-primary btn-lg">
                <FaHotel style={{ marginRight: 8 }} /> Browse Stays
              </Link>
              <Link to="/places" className="btn btn-outline btn-lg">
                <FaMapMarkedAlt style={{ marginRight: 8 }} /> Explore Places
              </Link>
            </div>
            <div className="wl-empty-tips">
              <h4>What can you save?</h4>
              <div className="wl-tip-grid">
                {[
                  { icon: FaHotel, label: 'Hotels' },
                  { icon: FaHome, label: 'Guesthouses' },
                  { icon: FaTree, label: 'Cabins' },
                  { icon: FaStar, label: 'Resorts' },
                ].map(t => (
                  <div key={t.label} className="wl-tip-item">
                    <span><t.icon /></span>
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No results after filter */}
        {wishlist.length > 0 && filtered.length === 0 && (
          <div className="wl-empty" style={{ padding: '40px 0' }}>
            <div className="wl-empty-icon" style={{ fontSize: '2.5rem' }}>🔍</div>
            <h3>No properties in {filter}</h3>
            <p>Try a different region filter.</p>
            <button className="btn btn-ghost" onClick={() => setFilter('All')}>
              Clear filter
            </button>
          </div>
        )}

        {/* Property Grid */}
        {filtered.length > 0 && (
          <div className="wl-grid">
            {filtered.map(property => {
              const mainImage = property.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
              const isRemoving = removing === property._id;

              return (
                <div
                  key={property._id}
                  className={`wl-card ${isRemoving ? 'removing' : ''}`}
                  onClick={() => navigate(`/stays/${property._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/stays/${property._id}`)}
                  aria-label={`View ${property.title}`}
                >
                  {/* Image */}
                  <div className="wl-card-img">
                    <img src={mainImage} alt={property.title} loading="lazy" />
                    {/* Remove button */}
                    <button
                      className={`wl-heart-btn ${isRemoving ? 'removing' : ''}`}
                      onClick={(e) => handleRemove(property._id, e)}
                      disabled={isRemoving}
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      {isRemoving ? '⏳' : '❤️'}
                    </button>
                    {/* Type badge */}
                    <span className="wl-type-badge">
                      {typeIcons[property.propertyType] || '🏠'} {property.propertyType}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="wl-card-body">
                    <div className="wl-card-location">
                      📍 {property.location?.city || property.location?.region}
                    </div>
                    <h3 className="wl-card-title">{property.title}</h3>

                    <div className="wl-card-meta">
                      {property.rating > 0 && (
                        <span className="wl-rating">
                          ⭐ {property.rating}
                          <small> ({property.reviewCount})</small>
                        </span>
                      )}
                      <span>👥 Max {property.maxGuests}</span>
                      <span>🛏 {property.bedrooms || 1} bed</span>
                    </div>

                    {/* Amenities tags */}
                    {property.amenities?.length > 0 && (
                      <div className="wl-amenities">
                        {property.amenities.slice(0, 3).map(a => (
                          <span key={a} className="wl-amenity">{a}</span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="wl-amenity">+{property.amenities.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="wl-card-footer">
                      <div className="wl-price">
                        <strong>PKR {property.price?.toLocaleString()}</strong>
                        <span> / night</span>
                      </div>
                      <Link
                        to={`/stays/${property._id}`}
                        className="btn btn-primary btn-sm wl-view-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA when wishlist has items */}
        {wishlist.length > 0 && (
          <div className="wl-bottom-cta">
            <div className="wl-bottom-cta-inner">
              <div>
                <h3>Ready to book?</h3>
                <p>Your dream GB stay is just a few clicks away.</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/stays" className="btn btn-primary">Browse More Stays</Link>
                <Link to="/experiences" className="btn btn-outline">Book Experiences</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
