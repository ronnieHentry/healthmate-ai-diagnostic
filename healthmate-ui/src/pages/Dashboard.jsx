import React from 'react';
import Container from '@mui/material/Container';
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
    <Container maxWidth={false} disableGutters sx={{ pt: '80px', pb: 2, width: '100vw !important', maxWidth: '100vw !important', px: 0 }}>
      <div className="dashboard-wrapper">
        <ProfileCompletion onStartSymptomCheck={handleStartSymptomCheck} />
        <AssistantHistory onViewDetails={() => {}} />
        <HealthInsights />
        <Reminders />
      </div>
    </Container>
  );
};

export default Dashboard;
