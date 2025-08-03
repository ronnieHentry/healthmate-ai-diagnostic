

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./AssistantHistory.css";

const ShimmerCard = () => (
  <div className="card card-history shimmer-card">
    <div className="card-header">
      <span className="card-icon shimmer-bg" style={{ width: 32, height: 32, borderRadius: "50%" }} />
      <div className="shimmer-bg" style={{ width: 80, height: 20, borderRadius: 4, marginLeft: 8 }} />
    </div>
    <div className="shimmer-bg" style={{ width: 60, height: 14, borderRadius: 4, margin: "8px 0" }} />
    <div className="shimmer-bg" style={{ width: "90%", height: 32, borderRadius: 4, margin: "8px 0" }} />
    <div className="shimmer-bg" style={{ width: 90, height: 28, borderRadius: 4, margin: "8px 0 auto auto" }} />
  </div>
);

const AssistantHistory = ({ onViewDetails, username = "john_doe" }) => {
  const rowRef = useRef(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post("http://localhost:8000/api/history", { user_key: username });
        setHistoryData(res.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [username]);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section className="history-section">
      <h2 className="history-title">Assistant History</h2>
      {loading ? (
        <div className="cards-row" ref={rowRef}>
          {[...Array(3)].map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div className="cards-row" ref={rowRef}>
          {historyData.length === 0 ? (
            <div style={{ padding: 16 }}>No history found.</div>
          ) : (
            historyData.map(({ date, title, shortSummary, fullDate }, idx) => (
              <div className="card card-history" key={title + fullDate + idx}>
                <div className="card-header">
                  <span className="card-icon" role="img" aria-label="history">
                    🩺
                  </span>
                  <h3>{title}</h3>
                </div>
                <p className="card-date">{date} <span style={{ fontSize: "0.8em", color: "#888" }}>{fullDate}</span></p>
                <p className="card-summary">{shortSummary}</p>
                <button
                  className="view-details-btn"
                  onClick={() => onViewDetails(shortSummary)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </section>
  );
};
export default AssistantHistory;
