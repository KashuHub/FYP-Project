import React from 'react';
import { Link } from 'react-router-dom';
import './ExperienceCard.css';

const typeIcons = {
  trekking: '🥾', cultural: '🎭', 'jeep-safari': '🚙',
  camping: '⛺', photography: '📷', fishing: '🎣', 'rock-climbing': '🧗'
};

const ExperienceCard = ({ experience }) => {
  const mainImage = experience.images?.[0]?.url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600';

  return (
    <Link to={`/experiences/${experience._id}`} className="exp-card">
      <div className="exp-img-wrap">
        <img src={mainImage} alt={experience.title} loading="lazy" />
        <span className="exp-type-badge">
          {typeIcons[experience.type] || '🌟'} {experience.type?.replace('-', ' ')}
        </span>
        {experience.isFeatured && <span className="exp-featured">⭐ Popular</span>}
      </div>
      <div className="exp-info">
        <div className="exp-location">📍 {experience.location?.region}</div>
        <h3 className="exp-title">{experience.title}</h3>
        <div className="exp-details">
          <span>⏱ {experience.duration?.value} {experience.duration?.unit}</span>
          <span>👥 Max {experience.maxGroupSize}</span>
          <span className={`difficulty difficulty-${experience.difficultyLevel?.toLowerCase()}`}>
            {experience.difficultyLevel}
          </span>
        </div>
        <div className="exp-footer">
          <div className="exp-price">
            <strong>PKR {experience.price?.toLocaleString()}</strong>
            <span> / person</span>
          </div>
          {experience.rating > 0 && (
            <span className="exp-rating">⭐ {experience.rating} ({experience.reviewCount})</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;
