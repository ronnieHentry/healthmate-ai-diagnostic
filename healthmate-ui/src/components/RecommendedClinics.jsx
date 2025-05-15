import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const RecommendedClinics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state;

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await response.json();
        const recommendations = data?.doctor_recommendation_structured?.recommendations || [];
        setClinics(recommendations);
      } catch (error) {
        console.error("Failed to load clinics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const handleBookNow = (clinic) => {
    alert(`Booking started for ${clinic.hospital} / ${clinic.doctor_name}`);
  };

  const goBackToDiagnosis = () => {
    navigate("/diagnosis", { state: { sessionId } });
  };

  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <React.Fragment key={index}>
        <ListItem alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "start" }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ mt: 1, borderRadius: 1 }} />
        </ListItem>
        <Divider sx={{ my: 2 }} />
      </React.Fragment>
    ));
  };

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 4, backgroundColor: "#fff" }}>
      <Typography variant="h5" gutterBottom>
        Recommended Hospitals & Clinics
      </Typography>

      {loading ? (
        <List>{renderSkeletons()}</List>
      ) : clinics.length > 0 ? (
        <List>
          {clinics.map((clinic, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ flexDirection: "column", alignItems: "start" }}>
                <ListItemText
                  primary={
                    <Typography variant="h7">{clinic.hospital}</Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="subtitle1">
                        {clinic.doctor_name} — {clinic.specialty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {clinic.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact: {clinic.contact}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {clinic.rating}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleBookNow(clinic)}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < clinics.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No recommendations available at the moment. Please try again later.
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" color="primary" onClick={goBackToDiagnosis}>
          Back to Diagnosis
        </Button>
      </Box>
    </Paper>
  );
};

export default RecommendedClinics;
