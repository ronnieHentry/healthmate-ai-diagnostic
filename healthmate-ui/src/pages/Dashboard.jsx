import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import ProfileCompletion from '../components/ProfileCompletion';
import AssistantHistory from '../components/AssistantHistory';
import HealthInsights from '../components/HealthInsights';
import WellbeingTips from '../components/WellbeingTips';
import Reminders from '../components/Reminders';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [medicalHistories, setMedicalHistories] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/medical-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'john_doe' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch medical history');
        return res.json();
      })
      .then((data) => setMedicalHistories(data))
      .catch((err) => {
        console.error('Error fetching medical history:', err);
        setMedicalHistories(null);
      });
  }, []);

  const handleStartSymptomCheck = () => {
    navigate('/symptomform');
  };

  // ProfileCompletion will handle modal and save logic

  return (
    <Container maxWidth={false} disableGutters sx={{ pt: '80px', pb: 2, width: '100vw !important', maxWidth: '100vw !important', px: 0 }}>
      <div className="dashboard-wrapper">
        <ProfileCompletion onStartSymptomCheck={handleStartSymptomCheck} profile={profile} setProfile={setProfile} medicalHistoryData={medicalHistories} />
        <AssistantHistory onViewDetails={() => {}} />
        <div className="insights-tips-row">
          <HealthInsights />
          <WellbeingTips />
        </div>
        <Reminders />
      </div>
    </Container>
  );
};

export default Dashboard;
