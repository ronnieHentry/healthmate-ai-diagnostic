import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import ProfileCompletion from '../components/ProfileCompletion';
import AssistantHistory from '../components/AssistantHistory';
import HealthInsights from '../components/HealthInsights';
import Reminders from '../components/Reminders';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStartSymptomCheck = () => {
    navigate('/symptomform');
  };

  return (
    <div className="dashboard-wrapper">
      <ProfileCompletion onStartSymptomCheck={handleStartSymptomCheck} />
      <AssistantHistory onViewDetails={() => {}} />
      <HealthInsights />
      <Reminders />
    </div>
  );
};

export default Dashboard;
