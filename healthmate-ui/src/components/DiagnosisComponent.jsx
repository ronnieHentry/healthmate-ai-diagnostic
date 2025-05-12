import React, { useEffect, useState, useRef } from "react";
import {
  Skeleton,
  Typography,
  Paper,
  Box,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { downloadPDF } from "../utils/helper";

const DiagnosisComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state;

  const [loading, setLoading] = useState(true);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [error, setError] = useState(false);

  const reportRef = useRef();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      console.log("Fetching diagnosis for session:", sessionId);
      try {
        const res = await axios.post("http://localhost:8000/api/diagnosis", {
          session_id: sessionId,
        });
        setDiagnosisData(res.data);
      } catch (err) {
        console.error("Failed to fetch diagnosis:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, []);

  // Navigate to the next step (recommendations page)
  const goToNextPage = () => {
    navigate("/next-step", { state: { sessionId } });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generating your report...
        </Typography>
        <Skeleton height={40} />
        <Skeleton height={20} width="90%" />
        <Skeleton height={20} width="85%" />
        <Skeleton height={20} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} />
      </Paper>
    );
  }

  if (error || !diagnosisData) {
    return (
      <Paper sx={{ p: 4, mt: 4 }}>
        <Alert severity="error">
          Failed to generate diagnosis. Please try again later.
        </Alert>
      </Paper>
    );
  }

  const { diagnosis_structured, diagnosis_raw } = diagnosisData;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Box ref={reportRef}>
        <Typography variant="h4" gutterBottom color="primary">
          🩺 Pre-Diagnosis Report
        </Typography>

        {diagnosis_structured ? (
          <>
            <Section
              title="Possible Causes"
              items={diagnosis_structured.possible_causes}
            />
            <Section
              title="Red Flags"
              items={diagnosis_structured.red_flags}
              fallback="None identified."
            />
            <Section
              title="Tests Suggested"
              items={diagnosis_structured.tests_suggested}
            />
            <TextSection
              title="Doctor Recommendation"
              content={diagnosis_structured.doctor_recommendation}
            />
            <TextSection
              title="Brief Doctor's Summary"
              content={diagnosis_structured.doctor_summary}
            />
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
            {diagnosis_raw || "No diagnosis content available."}
          </Typography>
        )}
      </Box>

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 4, justifyContent: "flex-end" }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => downloadPDF(reportRef, sessionId)}
        >
          Download PDF
        </Button>
        <Button variant="contained" color="primary" onClick={goToNextPage}>
          Continue
        </Button>
      </Stack>
    </Paper>
  );
};

const Section = ({ title, items, fallback }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" color="text.secondary">
      {title}
    </Typography>
    <Divider sx={{ mb: 1 }} />
    {items && items.length > 0 ? (
      <List dense>
        {items.map((item, i) => (
          <ListItem key={i} sx={{ pl: 2 }}>
            <ListItemText primary={`• ${item}`} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
        {fallback || "None."}
      </Typography>
    )}
  </Box>
);

const TextSection = ({ title, content }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" color="text.secondary">
      {title}
    </Typography>
    <Divider sx={{ mb: 1 }} />
    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", pl: 2 }}>
      {content}
    </Typography>
  </Box>
);

export default DiagnosisComponent;
