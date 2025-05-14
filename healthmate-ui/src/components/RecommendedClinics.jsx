import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Rating,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RecommendedClinics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state;

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/doctors", {
          session_id: sessionId,
        });

        if (response.data.doctor_recommendation_structured) {
          const structured = response.data.doctor_recommendation_structured;

          // If it's a list, use directly. If a single object, wrap it.
          const list = Array.isArray(structured) ? structured : [structured];
          setClinics(list);
        } else {
          setError("No structured data returned.");
        }
      } catch (err) {
        console.error("Failed to fetch recommended clinics:", err);
        setError("Failed to load recommended clinics.");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [sessionId]);

  const goBackToDiagnosis = () => {
    navigate("/diagnosis", { state: { sessionId } });
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏥 Recommended Hospitals & Clinics
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && clinics.length > 0 ? (
        <List>
          {clinics.map((clinic, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {clinic.hospital} – {clinic.doctor_name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Specialty: {clinic.specialty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Address: {clinic.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact: {clinic.contact}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Rating
                          value={parseFloat(clinic.rating)}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {clinic.rating}
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < clinics.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        !loading &&
        !error && (
          <Typography variant="body1" color="text.secondary">
            No recommendations available at the moment.
          </Typography>
        )
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={goBackToDiagnosis}>
          ← Back to Diagnosis
        </Button>
      </Box>
    </Paper>
  );
};

export default RecommendedClinics;
