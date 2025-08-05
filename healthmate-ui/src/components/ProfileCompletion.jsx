import React, { useState } from 'react';
import ProfileCompletionModal from './ProfileCompletionModal';
import './ProfileCompletion.css';
import ProfileCompletionForm from './PopupProfile';

const ProfileCompletion = ({ onStartSymptomCheck, profile, setProfile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleProfileSave = (data) => {
    setProfile && setProfile(data);
    setModalOpen(false);
    // Optionally, send to backend here
  };

  return (
    <section className="profile-section">
      <div className="profile-row-between">
        <div className="profile-left-group">
          <span className="profile-progress-label">60% Profile Complete</span>
          <div className="profile-progress-bar-bg">
            <div className="profile-progress-bar-fill" style={{ width: '60%' }}></div>
          </div>
          <button className="complete-profile-btn" onClick={() => setModalOpen(true)}>
            Complete Profile
          </button>
        </div>
        <div className="profile-partition" />
        <button className="start-check-btn" onClick={onStartSymptomCheck}>
          + Start New Symptom Check
        </button>
      </div>
      <ProfileCompletionForm  open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleProfileSave} />
      {/* <ProfileCompletionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleProfileSave}
        extraFields={[
          { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
          { label: 'Medical Conditions', name: 'medicalConditions', type: 'text', placeholder: 'e.g. diabetes, hypertension' },
          { label: 'Medications', name: 'medications', type: 'text', placeholder: 'e.g. metformin, aspirin' },
          { label: 'Smoking Status', name: 'smoking', type: 'select', options: ['Never', 'Former', 'Current'] },
          { label: 'Alcohol Consumption', name: 'alcohol', type: 'select', options: ['None', 'Occasional', 'Regular'] },
          { label: 'Physical Activity (hours/week)', name: 'activityHours', type: 'number' },
          { label: 'Dietary Preferences', name: 'diet', type: 'text', placeholder: 'e.g. vegetarian, vegan, keto' },
        ]}
      /> */}
    </section>
  );
};
export default ProfileCompletion;
