import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './PropertyCard.css';

const PropertyCard = ({ property, onWishlistToggle }) => {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const saved = isInWishlist(property._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info('Please login to save properties'); return; }
    try {
      const { isWishlisted } = await toggleWishlist(property._id);
      toast.success(isWishlisted ? '❤️ Saved to wishlist!' : 'Removed from wishlist');
      if (onWishlistToggle) onWishlistToggle(property._id, isWishlisted);
    } catch {
      toast.error('Something went wrong');
    }
  };

  const mainImage = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';

  return (
    <Link to={`/stays/${property._id}`} className="property-card">
      <div className="property-img-wrap">
        <img src={mainImage} alt={property.title} loading="lazy" />
        <button className={`wishlist-btn ${saved ? 'wishlisted' : ''}`} onClick={handleWishlist} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}>
          {saved ? '❤️' : '🤍'}
        </button>
        <span className="property-type-badge">{property.propertyType}</span>
      </div>
      <div className="property-info">
        <div className="property-location">
          📍 {property.location?.city || property.location?.region}
        </div>
        <h3 className="property-title">{property.title}</h3>
        <div className="property-meta">
          {property.rating > 0 && (
            <span className="property-rating">⭐ {property.rating} <small>({property.reviewCount})</small></span>
          )}
          <span className="property-guests">👥 Up to {property.maxGuests}</span>
        </div>
        <div className="property-footer">
          <div className="property-price">
            <strong>PKR {property.price?.toLocaleString()}</strong>
            <span> / night</span>
          </div>
          {property.amenities?.slice(0, 3).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
