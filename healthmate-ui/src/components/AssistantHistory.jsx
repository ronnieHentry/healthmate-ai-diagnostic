import React, { useRef, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import "./AssistantHistory.css";
import ConsultationDetailsModal from "./ConsultationDetailsModal";

const ShimmerCard = () => (
  <div className="card card-history shimmer-card">
    <div className="card-header">
      <span
        className="card-icon shimmer-bg"
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
    <div
      className="shimmer-bg"
      style={{
        width: 90,
        height: 28,
        borderRadius: 4,
        margin: "8px 0 auto auto",
      }}
    />
  </div>
);

const AssistantHistory = ({ username = "john_doe" }) => {
  const rowRef = useRef(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post("http://localhost:8000/api/history", {
          user_key: username,
        });
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

  const handleViewDetails = (details) => {
    setModalDetails(details);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalDetails(null);
  };

  return (
    <section className="history-section">
      <h2 className="history-title">Assistant History</h2>
      {loading ? (
        <div className="history-cards-row-wrapper" style={{ position: "relative" }}>
          <div className="history-cards-row no-scrollbar" ref={rowRef}>
            {[...Array(6)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
          <button
            className="scroll-btn scroll-btn-abs left"
            onClick={() => scroll(-1)}
            title="Scroll left"
            style={{ left: 0, position: "absolute", top: "50%", transform: "translateY(-50%)" }}
          >
            &#8592;
          </button>
          <button
            className="scroll-btn scroll-btn-abs right"
            onClick={() => scroll(1)}
            title="Scroll right"
            style={{ right: 0, position: "absolute", top: "50%", transform: "translateY(-50%)" }}
          >
            &#8594;
          </button>
        </div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div className="history-cards-row-wrapper" style={{ position: "relative" }}>
          <div className="history-cards-row no-scrollbar" ref={rowRef}>
            {historyData.length === 0 ? (
              <div style={{ padding: 16 }}>No history found.</div>
            ) : (
              [...historyData]
                .sort((a, b) => {
                  // Prefer fullDate if available, else fallback to date string
                  const dateA = a.fullDate ? new Date(a.fullDate) : new Date(a.date);
                  const dateB = b.fullDate ? new Date(b.fullDate) : new Date(b.date);
                  return dateB - dateA; // Descending (most recent first)
                })
                .map((item, idx) => (
                  <div
                    className="card card-history"
                    key={item.title + item.fullDate + idx}
                  >
                    <div className="card-header">
                      <span className="card-icon" role="img" aria-label="history">
                        🩺
                      </span>
                      <h3>{item.title}</h3>
                    </div>
                    <p className="card-date">
                      {item.fullDate
                        ? format(parseISO(item.fullDate), "MMMM dd")
                        : item.date}
                    </p>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(item)}
                    >
                      View Details
                    </button>
                  </div>
                ))
            )}
          </div>
          <button
            className="scroll-btn scroll-btn-abs left"
            onClick={() => scroll(-1)}
            title="Scroll left"
            style={{ left: 0, position: "absolute", top: "50%", transform: "translateY(-50%)" }}
          >
            &#8592;
          </button>
          <button
            className="scroll-btn scroll-btn-abs right"
            onClick={() => scroll(1)}
            title="Scroll right"
            style={{ right: 0, position: "absolute", top: "50%", transform: "translateY(-50%)" }}
          >
            &#8594;
          </button>
        </div>
      )}

      <ConsultationDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        details={modalDetails}
      />
    </section>
  );
};
export default AssistantHistory;
