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

  const goToNextPage = () => {
    navigate("/next-step", { state: { sessionId } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper sx={{ p: 3, width: "100%", maxWidth: "800px" }}>
          <Typography variant="h6" gutterBottom color="primary">
            🩺 Generating your report...
          </Typography>
          {[...Array(2)].map((_, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton height={24} width="40%" />
              <Skeleton height={18} width="90%" />
              <Skeleton height={18} width="80%" />
              <Skeleton height={18} width="70%" />
              <Skeleton height={18} width="40%" />
              <Skeleton height={18} width="20%" />
              <Skeleton height={18} width="60%" />
              <Skeleton height={18} width="70%" />
            </Box>
          ))}
          <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "flex-end" }}>
            <Skeleton variant="rectangular" width={120} height={36} />
            <Skeleton variant="rectangular" width={120} height={36} />
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (error || !diagnosisData) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: "800px" }}>
          <Alert severity="error">
            Failed to generate diagnosis. Please try again later.
          </Alert>
        </Paper>
      </Box>
    );
  }

  const { diagnosis_structured, diagnosis_raw } = diagnosisData;

  // Define sections dynamically
  const sections = [
    { title: "Possible Causes", items: diagnosis_structured?.possible_causes },
    { title: "Red Flags", items: diagnosis_structured?.red_flags, fallback: "None identified." },
    { title: "Tests Suggested", items: diagnosis_structured?.tests_suggested },
    { title: "Doctor Recommendation", content: diagnosis_structured?.doctor_recommendation },
    { title: "Doctor's Summary", content: diagnosis_structured?.doctor_summary },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      <Paper sx={{ p: 2, width: "100%", maxWidth: "800px" }}>
        <Box ref={reportRef}>
          <Typography variant="h4" gutterBottom color="primary">
            🩺 Pre-Diagnosis Report
          </Typography>

          {/* Map through sections dynamically */}
          {sections.map((section, index) => (
            <Section key={index} title={section.title} items={section.items} content={section.content} fallback={section.fallback} />
          ))}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
          <Button variant="outlined" size="small" onClick={() => downloadPDF(reportRef, sessionId)}>
            Download PDF
          </Button>
          <Button variant="contained" size="small" onClick={goToNextPage}>
            Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

// Reusable Section Component
const Section = ({ title, items, content, fallback }) => (
  <Box sx={{ mt: 0.5 }}>
    <Typography variant="subtitle1" color="text.secondary">
      {title}
    </Typography>
    <Divider sx={{ my: 0.5 }} />
    {items ? (
      <List dense disablePadding>
        {items.length > 0 ? (
          items.map((item, i) => (
            <ListItem key={i} sx={{ pl: 2, py: 0.5 }}>
              <ListItemText primary={`• ${item}`} primaryTypographyProps={{ variant: "body2" }} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            {fallback || "None."}
          </Typography>
        )}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
        {content || "No additional information available."}
      </Typography>
    )}
  </Box>
);

export default DiagnosisComponent;
