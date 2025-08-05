
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = `${user.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}-${Date.now()}`;
    const message = `\n      Name: ${"John Doe"}\n      Age: 45\n      Gender: Male\n      Symptoms: ${formData.symptoms}\n      Duration: ${formData.duration}\n      Onset: ${formData.onset}\n      Severity: ${formData.severity}\n      \n      Check for vague or missing info. Ask follow-up questions if needed. If all info is sufficient, say 'All clear'.\n    `.trim();

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
    const str = `🫀 HRV: SDNN 65ms | RMSSD 40ms | LF/HF 1.5  
🫁 SpO₂: 2AM 97% | 10AM 98% | 6PM 96%  
😴 Sleep: REM 90m | Deep 80m | Light 220m | Awake 30m  
🚶 Steps: 10,200 | Calories: 480 kcal | Distance: 7.8 km  
🌡️ Skin Temp: 6AM 33.5°C | 12PM 34.2°C | 9PM 33.8°C  
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
          <div className="form-section form-row">
            <input name="duration" placeholder="Duration (e.g. 3 days) *" value={formData.duration} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SymptomForm;
