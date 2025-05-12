import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const RecommendedClinics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state;

  const [clinics, setClinics] = useState([]);
  
  // Placeholder data for hospitals and doctors
  useEffect(() => {
    // This could be replaced with an API call to fetch clinics and doctors near the user
    setClinics([
      {
        name: "Orthopedic Clinic 1",
        doctor: "Dr. John Smith",
        location: "123 Main St, Cityville",
      },
      {
        name: "Wrist Care Center",
        doctor: "Dr. Jane Doe",
        location: "456 Elm St, Cityville",
      },
      {
        name: "Sports Medicine Clinic",
        doctor: "Dr. Emily White",
        location: "789 Oak St, Cityville",
      },
    ]);
  }, []);

  const goBackToDiagnosis = () => {
    navigate("/diagnosis", { state: { sessionId } });
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recommended Hospitals & Clinics
      </Typography>

      {clinics.length > 0 ? (
        <List>
          {clinics.map((clinic, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${clinic.name} - Dr. ${clinic.doctor}`}
                secondary={clinic.location}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No recommendations available at the moment. Please try again later.
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={goBackToDiagnosis}>
          Go Back to Diagnosis
        </Button>
      </Box>
    </Paper>
  );
};

export default RecommendedClinics;
