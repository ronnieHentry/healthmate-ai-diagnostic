import React, { useState } from 'react';
import './Dashboard.css';
import Modal from './Modal'; 

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'form' or 'details'
  const [detailText, setDetailText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    duration: ''
  });

  const handleStartSymptomCheck = () => {
  setModalType('form');
  setShowModal(true);
};

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleViewDetails = (text) => {
  setDetailText(text);
  setModalType('details');
  setShowModal(true);
};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    setShowModal(false);
  };

  return (
    <div className="dashboard-wrapper">
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">💙 HealthMate</div>
        <nav className="nav-links">
          <a href="#">Usages</a>
          <a href="#">Tausmnths</a>
          <a href="#">Reports</a>
          <a href="#">Website</a>
          <a href="#">Logoo</a>
          <div className="profile-pic">John Doe</div>
        </nav>
      </header>

      <div className="profile-completion">
        <span>60% Profile Complete</span>
        <button className="complete-profile-btn">Complete Profile</button>
      </div>

       <button className="start-check-btn" onClick={handleStartSymptomCheck}>
          + Start New Symptom Check
       </button>

      <section className="history-section">
        <h2>Assistant History</h2>
        <div className="cards-row">
          <div className="card">
            <p>Jul 21</p>
            <h3>Cold & Flu</h3>
            <button onClick={() => handleViewDetails('Details about Cold & Flu')}>
            View Details
            </button>
          </div>
          <div className="card">
            <p>Jul 10</p>
            <h3>Headache</h3>
            <button onClick={() => handleViewDetails('Details about Headache')}>
            View Details
            </button>
          </div>
          <div className="card">
            <p>Jun 26</p>
            <h3>Back Pain</h3>
            <button onClick={() => handleViewDetails('Details about Back Pain')}>
            View Details
            </button>
          </div>
        </div>
      </section>

      <section className="insights-section">
        <h2>Your Health Insights</h2>
        <div className="cards-row">
          <div className="card">
            <p>Average blood pressure <span>last month</span></p>
            <h3>120/80 mmHg</h3>
          </div>
          <div className="card">
            <p>+1.2 kg</p>
            <span>2 weeks</span>
          </div>
          <div className="card wide">
            <p>Consider adding magnesium-rich foods to your diet</p>
          </div>
        </div>
      </section>

      <section className="reminders-section">
        <h2>Reminders & Alerts</h2>
        <div className="cards-row">
          <div className="card">
            <p><strong>Oranges</strong><br />Vitamin C boost during a cold</p>
          </div>
          <div className="card">
            <p><strong>Heating Pad</strong><br />Helps relieve back pain</p>
          </div>
          <div className="card">
            <p><strong>Tej kêjn supplement</strong><br />at 8:00 AM</p>
            <span className="pending">Pending</span>
          </div>
        </div>
      </section>
    </div>
      <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalType === 'form' ? 'Symptom Input Form' : 'Details'}
        >
          {modalType === 'form' ? (
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
          ) : (
            <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
              {detailText}
            </p>
          )}
        </Modal>
      </div>
  );
};

export default Dashboard;
