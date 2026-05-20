import React from 'react';
import { Link } from 'react-router-dom';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  const mainImage = place.images?.[0]?.url || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600';

  return (
    <Link to={`/places/${place._id}`} className="place-card">
      <div className="place-img-wrap">
        <img src={mainImage} alt={place.name} loading="lazy" />
        {place.isHiddenGem && <span className="gem-badge">Hidden Gem</span>}
        {place.isFeatured && !place.isHiddenGem && <span className="featured-badge">⭐ Featured</span>}
        <div className="place-region-badge">{place.location?.region}</div>
      </div>
      <div className="place-info">
        <div className="place-category">{place.category}</div>
        <h3 className="place-name">{place.name}</h3>
        <p className="place-desc">{place.description?.substring(0, 100)}...</p>
        <div className="place-meta">
          {place.altitude && <span>🏔 {place.altitude}</span>}
          <span className={`difficulty difficulty-${place.difficulty?.toLowerCase()}`}>{place.difficulty}</span>
          {place.rating > 0 && <span>⭐ {place.rating}</span>}
        </div>
        {place.activities?.length > 0 && (
          <div className="place-activities">
            {place.activities.slice(0, 3).map(a => (
              <span key={a} className="activity-tag">{a}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlaceCard;
