
import React, { useState } from 'react';
import './SymptomForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const COMMON_ILLNESSES = [
  'Cold', 'Fever', 'Headache', 'Cough', 'Stomach Ache', 'Allergy', 'Sore Throat', 'Body Pain'
];

const SymptomForm = ({ user = { name: '', age: '', gender: '' } }) => {
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
            <div className="section-label">Describe Your Symptoms</div>
            <textarea name="symptoms" placeholder="Describe your symptoms *" value={formData.symptoms} onChange={handleChange} required />
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
