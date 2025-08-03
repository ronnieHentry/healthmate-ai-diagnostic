import './ProfileCompletion.css';

const ProfileCompletion = ({ onStartSymptomCheck }) => (
  <section className="profile-section">
    <div className="profile-row-between">
      <div className="profile-left-group">
        <span className="profile-progress-label">60% Profile Complete</span>
        <div className="profile-progress-bar-bg">
          <div className="profile-progress-bar-fill" style={{ width: '60%' }}></div>
        </div>
        <button className="complete-profile-btn">Complete Profile</button>
      </div>
      <div className="profile-partition" />
      <button className="start-check-btn" onClick={onStartSymptomCheck}>
        + Start New Symptom Check
      </button>
    </div>
  </section>
);
export default ProfileCompletion;
