import React from 'react';
import './SymptomForm.css';

const SymptomForm = ({ formData, onChange, onSubmit }) => (
  <form className="symptom-form" onSubmit={onSubmit}>
    <input name="name" placeholder="Name" value={formData.name} onChange={onChange} required />
    <input name="age" type="number" placeholder="Age" value={formData.age} onChange={onChange} required />
    <select name="gender" value={formData.gender} onChange={onChange} required>
      <option value="">Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    <textarea name="symptoms" placeholder="Describe your symptoms *" value={formData.symptoms} onChange={onChange} required />
    <input name="duration" placeholder="Duration (e.g. 3 days) *" value={formData.duration} onChange={onChange} required />
    <button type="submit" className="submit-btn">Submit</button>
  </form>
);

export default SymptomForm;
