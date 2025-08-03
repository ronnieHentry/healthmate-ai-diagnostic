import React, { useState, useEffect } from 'react';
import Modal from './Modal/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import './ProfileCompletion.css';

const defaultFields = [
  { section: 'Basic Info', label: 'Height (cm)', name: 'height', type: 'number', required: true },
  { section: 'Basic Info', label: 'Weight (kg)', name: 'weight', type: 'number', required: true },
  { section: 'Basic Info', label: 'Age', name: 'age', type: 'number', required: true },
  { section: 'Basic Info', label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
  { section: 'Lifestyle', label: 'Lifestyle', name: 'lifestyle', type: 'select', options: ['Sedentary', 'Moderate', 'Active'], required: true },
  { section: 'Lifestyle', label: 'Physical Activity (hours/week)', name: 'activityHours', type: 'number' },
  { section: 'Lifestyle', label: 'Dietary Preferences', name: 'diet', type: 'text', placeholder: 'e.g. vegetarian, vegan, keto' },
  { section: 'Medical', label: 'Allergies (comma separated)', name: 'allergies', type: 'text', placeholder: 'e.g. peanuts, pollen' },
];

const getInitialProfile = (fields) => {
  const obj = {};
  fields.forEach(f => { obj[f.name] = ''; });
  return obj;
};

const ProfileCompletionModal = ({ open, onClose, onSave, extraFields = [] }) => {
  // Merge and group fields by section
  const allFields = [...defaultFields, ...extraFields.map(f => ({ ...f, section: f.section || 'Medical' }))];
  const sections = Array.from(new Set(allFields.map(f => f.section)));
  const [profile, setProfile] = useState(getInitialProfile(allFields));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) setProfile(getInitialProfile(allFields));
    // eslint-disable-next-line
  }, [open]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Box className="profile-modal-content" sx={{ p: 2, minWidth: 350, maxWidth: 500 }}>
        <Typography variant="h5" fontWeight={700} align="center" mb={2}>
          Complete Your Health Profile
        </Typography>
        <form onSubmit={handleSubmit} className="profile-form">
          {sections.map((section, idx) => (
            <Box key={section} mb={2}>
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ mt: idx !== 0 ? 2 : 0 }}>
                {section}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {allFields.filter(f => f.section === section).map(field => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    {field.type === 'select' ? (
                      <TextField
                        select
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={profile[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        size="small"
                      >
                        <MenuItem value="">Select</MenuItem>
                        {field.options && field.options.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={profile[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        size="small"
                        placeholder={field.placeholder || ''}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ProfileCompletionModal;
