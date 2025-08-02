import React, { useState } from 'react';
import './Dashboard.css';
import Modal from '../components/Modal/Modal';
import SymptomForm from '../components/SymptomForm2';
import Header from '../components/Header';
import ProfileCompletion from '../components/ProfileCompletion';
import SymptomHistory from '../components/SymptomHistory';
import HealthInsights from '../components/HealthInsights';
import Reminders from '../components/Reminders';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
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
        <Header />
        <ProfileCompletion />

        <button className="start-check-btn" onClick={handleStartSymptomCheck}>
          + Start New Symptom Check
        </button>

        <SymptomHistory onViewDetails={handleViewDetails} />
        <HealthInsights />
        <Reminders />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'form' ? 'Symptom Input Form' : 'Details'}
      >
        {modalType === 'form' ? (
          <SymptomForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
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
