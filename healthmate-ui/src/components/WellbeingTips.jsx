import React, { useEffect, useState } from 'react';
import './WellbeingTips.css';



const SHIMMER_COUNT = 6;



const WellbeingTips = () => {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Prevent double API call (e.g., in React Strict Mode) by using a ref
  const hasFetchedRef = React.useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setLoading(true);
    setError("");
    fetch('http://localhost:8000/api/wellbeing-tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'john_doe' })
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          setError("Invalid response from server.");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError(data && data.error ? data.error : "Failed to fetch wellbeing tips.");
          setLoading(false);
          return;
        }
        if (Array.isArray(data)) {
          setTips(data);
        } else if (data && data.error) {
          setError(data.error);
        } else {
          setError("Unexpected response from server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not connect to wellbeing tips service.");
        setLoading(false);
      });
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
      {error && (
        <div style={{ color: 'red', padding: 12, fontWeight: 500 }}>{error}</div>
      )}
      <ul className="wellbeing-tips-list">
        {loading && !error
          ? Array.from({ length: SHIMMER_COUNT }).map((_, idx) => (
              <li key={idx} className="wellbeing-tip-item shimmer">
                <span className="tip-icon shimmer-icon" />
                <span className="tip-text shimmer-text" />
              </li>
            ))
          : !error && Array.isArray(tips) && tips.map((tip, idx) => (
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
