import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, size = 'md', readonly = false }) => {
  const [hover, setHover] = useState(0);
  const fontSize = size === 'lg' ? '1.8rem' : size === 'sm' ? '1rem' : '1.3rem';

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#e8a838' : '#dee2e6',
            transition: 'color 0.15s',
            userSelect: 'none'
          }}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
