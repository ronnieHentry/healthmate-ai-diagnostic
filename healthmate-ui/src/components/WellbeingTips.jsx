import React, { useEffect, useState } from 'react';
import './WellbeingTips.css';



const SHIMMER_COUNT = 6;



const WellbeingTips = () => {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/wellbeing-tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'john_doe' })
    })
      .then(res => res.json())
      .then(data => {
        setTips(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="wellbeing-tips-section">
      <div className="wellbeing-tips-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="wellbeing-tips-icon">🌱</span>
          <h2 className="wellbeing-tips-title" style={{ marginLeft: 8 }}>Wellbeing Tips</h2>
        </div>
        <button
          className="recommend-products-btn"
          title="Recommend Wellness Products"
          style={{ fontSize: 16, padding: '4px 12px', borderRadius: 16, border: 'none', background: '#e0f7fa', cursor: 'pointer', marginLeft: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => alert('Recommended wellness products coming soon!')}
        >
          <span role="img" aria-label="products">🛒</span>
          <span style={{ fontWeight: 500 }}>Products</span>
        </button>
      </div>
      <ul className="wellbeing-tips-list">
        {loading
          ? Array.from({ length: SHIMMER_COUNT }).map((_, idx) => (
              <li key={idx} className="wellbeing-tip-item shimmer">
                <span className="tip-icon shimmer-icon" />
                <span className="tip-text shimmer-text" />
              </li>
            ))
          : tips && tips.map((tip, idx) => (
              <li key={idx} className="wellbeing-tip-item">
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-text">{tip.text}</span>
              </li>
            ))}
      </ul>
    </section>
  );
};

export default WellbeingTips;
