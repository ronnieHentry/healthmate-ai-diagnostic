
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './SymptomForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COMMON_ILLNESSES = [
  'Cold', 'Fever', 'Headache', 'Cough', 'Stomach Ache', 'Allergy', 'Sore Throat', 'Body Pain'
];

const SymptomForm = ({ user = { name: 'John Doe', age: '45', gender: 'Male' } }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "John Doe",
    age: 45,
    gender: "Male",
    symptoms: '',
    duration: '',
    onset: '',
    severity: '',
  });
  const [report, setReport] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reportAnalysis, setReportAnalysis] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIllnessClick = (illness) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms ? prev.symptoms + ', ' + illness : illness
    }));
  };

  const [summaryReport, setSummaryReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = `${user.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}-${Date.now()}`;
    let message = `\n      Name: ${"John Doe"}\n      Age: 45\n      Gender: Male\n      Symptoms: ${formData.symptoms}\n      Duration: ${formData.duration}\n      Onset: ${formData.onset}\n      Severity: ${formData.severity}\n      \n      Check for vague or missing info. Ask follow-up questions if needed. If all info is sufficient, say 'All clear'.\n    `.trim();
    if (reportAnalysis) {
      message += `\n\nSummary Report of attached document:\n${reportAnalysis}`;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/intake', {
        session_id: sessionId,
        message,
      });
      setReport(res.data);
      navigate('/chat', { state: { report: res.data, sessionId } });
    } catch (err) {
      console.error(err);
      alert('Error submitting symptoms');
    }
  };

  const pullFormSmartWatch = () => {
    const str = `HRV: SDNN 65ms | RMSSD 40ms | LF/HF 1.5  
SpO₂: 2AM 97% | 10AM 98% | 6PM 96%  
Sleep: REM 90m | Deep 80m | Light 220m | Awake 30m  
Steps: 10,200 | Calories: 480 kcal | Distance: 7.8 km  
Skin Temp: 6AM 33.5°C | 12PM 34.2°C | 9PM 33.8°C  
`
    setFormData(state => ({ ...state, symptoms: str }))
  }

  return (
    <div className="symptom-form-outer">
      <div className="symptom-form-container">
        <form className="symptom-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Medical Pre-Diagnosis</h2>
          <div className="form-section">
            <div className="section-label">Common Illnesses</div>
            <div className="common-illnesses-row">
              {COMMON_ILLNESSES.map((illness) => (
                <div
                  key={illness}
                  className="illness-card"
                  onClick={() => handleIllnessClick(illness)}
                  tabIndex={0}
                  role="button"
                >
                  {illness}
                </div>
              ))}
            </div>
          </div>
          <div className="form-section">
            <div className="section-label">
              <span>Describe Your Symptoms</span>
              <Button style={{ textTransform: 'none' }} variant="outlined" size='small' onClick={pullFormSmartWatch}>Load Wellness Info</Button> </div>
            <textarea style={{ width: "97%" }} name="symptoms" placeholder="Describe your symptoms *" value={formData.symptoms} onChange={handleChange} required />
          </div>
          <div className="form-section form-row duration-upload-row">
            <input name="duration" placeholder="Duration (e.g. 3 days) *" value={formData.duration} onChange={handleChange} required className="duration-input" />
            <div className="upload-preview-row">
              <label htmlFor="file-upload" className="file-upload-label">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (file) {
                      setFile(file);
                      const reader = new FileReader();
                      reader.onload = ev => setPreview(ev.target.result);
                      reader.readAsDataURL(file);

                      // Send to backend for analysis
                      setReportLoading(true);
                      setReportAnalysis(null);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        // Use the same endpoint as ConsultationDetailsModal
                        const response = await fetch('http://localhost:8000/upload_report', {
                          method: 'POST',
                          body: formData
                        });
                        if (response.ok) {
                          const data = await response.json();
                          let summaryText = '';
                          if (data.summary) {
                            if (data.summary.response && data.summary.response.candidates) {
                              summaryText = data.summary.response.candidates[0]?.content?.parts[0]?.text || '';
                            } else if (typeof data.summary === 'string') {
                              summaryText = data.summary;
                            } else if (data.summary.raw_response) {
                              summaryText = data.summary.raw_response;
                            } else if (data.summary.error) {
                              summaryText = data.summary.error + (data.summary.details ? ': ' + data.summary.details : '');
                            }
                          }
                          setReportAnalysis(summaryText);
                          console.log('Report Analysis:', summaryText);
                        } else {
                          setReportAnalysis('Upload failed. Please try again.');
                        }
                      } catch (err) {
                        setReportAnalysis('Upload failed. Please try again.');
                        console.log('Report Analysis: Upload failed. Please try again.');
                      }
                      setReportLoading(false);
                    }
                  }}
                />
                <span className="upload-btn">
                  <svg className="attachment-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l10.61-10.61a3 3 0 0 1 4.24 4.24l-10.61 10.61a1 1 0 0 1-1.41-1.41l9.19-9.19"/></svg>
                  <span className="upload-btn-text">Upload File/Image</span>
                </span>
              </label>
              {preview && (
                <div className="inline-file-preview">
                  {file && file.type.startsWith('image') ? (
                    <img src={preview} alt="Preview" className="file-preview-image-fixed" />
                  ) : (
                    <a href={preview} target="_blank" rel="noopener noreferrer" className="file-preview-link">View File</a>
                  )}
                </div>
              )}
              {reportLoading && (
                <div className="report-loading">Analyzing file...</div>
              )}
              {/* Report analysis is stored in state but not displayed */}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="submit-btn" disabled={reportLoading}>Submit</button>
          </div>
        </form>
    </div>
    </div>
  );
};

export default SymptomForm;
