import React from "react";
import "./ConsultationDetailsModal.css";

const ConsultationDetailsModal = ({ open, onClose, details }) => {
  if (!open) return null;
  const { title, date, fullDate, shortSummary } = details || {};

  return (
    <div className="modal-overlay">
      <div className="consultation-modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Consultation Details</h2>
        <div className="modal-section">
          <div className="modal-step">1 <span>Summary</span></div>
          <h3 className="modal-consult-title">{title}</h3>
          <p className="modal-summary">
            Consultation took place on {date || fullDate} to address reported symptoms such as {shortSummary}
          </p>
        </div>
        <div className="modal-section">
          <div className="modal-step">2 <span>Upload Documents</span></div>
          <div className="modal-upload-box">
            <div className="modal-upload-icon">↑</div>
            <div>Drag and drop files here or <span className="modal-browse">Browse files</span></div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-upload-btn">Upload</button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailsModal;
