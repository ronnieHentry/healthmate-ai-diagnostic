import React, { useRef, useState } from "react";
import "./ConsultationDetailsModal.css";

const ConsultationDetailsModal = ({ open, onClose, details }) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [reportSummary, setReportSummary] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();


  // Clear state when modal is closed
  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadStatus("");
      setReportSummary(null);
    }
  }, [open]);

  if (!open) return null;
  const { title, date, fullDate, shortSummary } = details || {};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadStatus("");
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadStatus("");
      if (file && file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }
    setUploading(true);
    setUploadStatus("");
    setReportSummary(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://localhost:8000/upload_report", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setUploadStatus("Upload successful!");
        // Do NOT clear selectedFile or previewUrl so the image remains visible
        const data = await response.json();
        // Try to extract summary text from Gemini or Groq response
        let summaryText = "";
        if (data.summary) {
          // Gemini (image) response
          if (data.summary.response && data.summary.response.candidates) {
            summaryText = data.summary.response.candidates[0]?.content?.parts[0]?.text || "";
          } else if (typeof data.summary === "string") {
            summaryText = data.summary;
          } else if (data.summary.raw_response) {
            summaryText = data.summary.raw_response;
          } else if (data.summary.error) {
            summaryText = data.summary.error + (data.summary.details ? ": " + data.summary.details : "");
          }
        }
        setReportSummary(summaryText);
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (err) {
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="consultation-modal wide-modal extra-wide-modal">
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
          <div
            className="modal-upload-box"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="modal-upload-icon">↑</div>
            <div>
              Drag and drop files here or {" "}
              <span className="modal-browse" onClick={handleBrowseClick}>Browse files</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
            </div>
            {selectedFile && (
              <div style={{ marginTop: 8, color: '#2563eb', fontSize: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>Selected: {selectedFile.name}</span>
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="doc-preview-thumb" />
                )}
              </div>
            )}
            {uploadStatus && (
              <div style={{ marginTop: 8, color: uploadStatus.includes('success') ? 'green' : 'red', fontSize: 14 }}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>

        <div className="report-analysis-card">
          <h3 className="report-analysis-title">Report Analysis</h3>
          <div className="report-analysis-content">
            {reportSummary
              ? reportSummary.split('\n').map((line, idx) => {
                  // Render markdown-style bold and lists
                  if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                    return <div key={idx} className="report-analysis-bold">{line.replace(/\*\*/g, '')}</div>;
                  }
                  if (line.trim().startsWith('*')) {
                    return <div key={idx} className="report-analysis-bullet"><span className="report-analysis-dot">•</span>{line.replace(/^\*+\s*/, '')}</div>;
                  }
                  return <div key={idx}>{line}</div>;
                })
              : <span className="report-analysis-placeholder">No analysis yet. Upload a report to see the summary here.</span>}
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="modal-upload-btn" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailsModal;
