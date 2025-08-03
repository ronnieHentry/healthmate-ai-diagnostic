import "./AssistantHistory.css";

const historyData = [
  { date: "Jul 21", title: "Cold & Flu" },
  { date: "Jul 10", title: "Headache" },
  { date: "Jun 26", title: "Back Pain" },
  { date: "Jun 12", title: "Fever" },
  { date: "May 30", title: "Stomach Ache" },
];

import React, { useRef } from "react";

const AssistantHistory = ({ onViewDetails }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };
  return (
    <section className="history-section">
      <h2 className="history-title">Assistant History</h2>
      <div className="cards-row" ref={rowRef}>
        {historyData.map(({ date, title }) => (
          <div className="card card-history" key={title}>
            <div className="card-header">
              <span className="card-icon" role="img" aria-label="history">
                🩺
              </span>
              <h3>{title}</h3>
            </div>
            <p className="card-date">{date}</p>
            <button
              className="view-details-btn"
              onClick={() => onViewDetails(`Details about ${title}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default AssistantHistory;
