
import React, { useState } from 'react';
import './SymptomForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SymptomForm = ({ user = { name: '', age: '', gender: '' } }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    symptoms: '',
    duration: '',
  });
  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedName = formData.name.toLowerCase().replace(/\s+/g, '_');
    const sessionId = `${formattedName}-${Date.now()}`;
    const message = `\n      Name: ${formData.name}\n      Age: ${formData.age}\n      Gender: ${formData.gender}\n      Symptoms: ${formData.symptoms}\n      Duration: ${formData.duration}\n      \n      Check for vague or missing info. Ask follow-up questions if needed. If all info is sufficient, say 'All clear'.\n    `.trim();

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
    <form className="symptom-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <textarea name="symptoms" placeholder="Describe your symptoms *" value={formData.symptoms} onChange={handleChange} required />
      <input name="duration" placeholder="Duration (e.g. 3 days) *" value={formData.duration} onChange={handleChange} required />
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default SymptomForm;
