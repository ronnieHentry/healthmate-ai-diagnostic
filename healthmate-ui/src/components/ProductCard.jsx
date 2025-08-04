import React from "react";
import "./ProductCard.css";

const ProductCard = ({ imageSrc, title, subtitle, buttonLabel, onClick, rating }) => {
  // Helper to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<span key={i} className="star">★</span>);
    if (halfStar) stars.push(<span key="half" className="star">☆</span>);
    for (let i = 0; i < emptyStars; i++) stars.push(<span key={i + fullStars + 1} className="star empty">★</span>);
    return stars;
  };

  return (
    <div className="productcard horizontal">
      <img src={imageSrc} alt={title} className="productcard-image" />
      <div className="productcard-content">
        <div className="productcard-text">
          <p className="productcard-title">{title}</p>
          {rating !== undefined && (
            <div className="productcard-rating">
              {renderStars(rating)}
              <span className="rating-number">{rating.toFixed(1)}</span>
            </div>
          )}
          {subtitle && <p className="productcard-subtitle">{subtitle}</p>}
        </div>
        <div className="productcard-actions">
          <button className="btn small" onClick={onClick}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
