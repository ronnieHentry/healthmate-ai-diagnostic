import './Reminders.css';

import React, { useEffect, useState } from 'react';

const ShimmerCard = () => (
  <div className="card card-reminder shimmer-card">
    <div className="card-header-reminder">
      <span
        className="card-icon-reminder shimmer-bg"
        style={{ width: 32, height: 32, borderRadius: "50%" }}
      />
      <div
        className="shimmer-bg"
        style={{ width: 80, height: 20, borderRadius: 4, marginLeft: 8 }}
      />
    </div>
    <div
      className="shimmer-bg"
      style={{ width: 60, height: 14, borderRadius: 4, margin: "8px 0" }}
    />
    <div
      className="shimmer-bg"
      style={{ width: "90%", height: 32, borderRadius: 4, margin: "8px 0" }}
    />
  </div>
);

const Reminders = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/health-products-static')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load health products');
        setLoading(false);
      });
  }, []);

  return (
    <section className="history-section reminders-section">
      <h2 className="history-title reminders-title">Recommended for You</h2>
      <div className="cards-row reminders-row">
        {loading ? (
          [...Array(6)].map((_, i) => <ShimmerCard key={i} />)
        ) : error ? (
          <div className="reminder-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="reminder-empty">No health products to show.</div>
        ) : (
          products.map(({ title, note, image, rating = 4.5, reviews = 1200, price = '$6.99' }, i) => (
            <div className="card card-reminder product-card walmart-card" key={i}>
              <div className="product-image-wrapper walmart-image-wrapper">
                <img
                  className="product-image walmart-image"
                  src={image || `https://source.unsplash.com/80x80/?${encodeURIComponent(title)}`}
                  alt={title}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
              <div className="product-info walmart-info" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 16 }}>
                  {title}
                </div>
                <div style={{ minHeight: 36, color: '#222', fontSize: 14, margin: '4px 0' }}>{note}</div>
                <div style={{ display: 'flex', alignItems: 'center', minHeight: 24, margin: '4px 0' }}>
                  <span style={{ color: '#f7b500', fontSize: 16, marginRight: 4 }}>
                    {'★'.repeat(Math.floor(rating))}
                    {rating % 1 ? '½' : ''}
                  </span>
                  <span style={{ color: '#555', fontSize: 13 }}>({reviews})</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#222', margin: '4px 0', minHeight: 24 }}>${price}</div>
                <div style={{ flex: 1 }} />
                <div style={{ minHeight: 44, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <button className="add-to-cart-btn walmart-btn" style={{ width: '100%' }} onClick={() => alert(`Added '${title}' to cart!`)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Reminders;
