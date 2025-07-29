import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SymptomForm = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    symptoms: "",
    duration: "",
  });

  const [report, setReport] = useState(null);

  // Handle changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedName = formData.name.toLowerCase().replace(/\s+/g, '_');
    const sessionId = `${formattedName}-${Date.now()}`;
    const message = `
      Name: ${formData.name}
      Age: ${formData.age}
      Gender: ${formData.gender}
      Symptoms: ${formData.symptoms}
      Duration: ${formData.duration}
      
      Check for vague or missing info. Ask follow-up questions if needed. If all info is sufficient, say 'All clear'.
    `.trim();

    try {
      const res = await axios.post("http://localhost:8000/api/intake", {
        session_id: sessionId,
        message,
      });

      setReport(res.data);
      navigate("/chat", { state: { report: res.data, sessionId } });
    } catch (err) {
      console.error(err);
      alert("Error submitting symptoms");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} p={2} component={Paper} elevation={1}>
        <Typography variant="h5" align="center" gutterBottom>
          Symptom Input Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange} // Added onChange for name field
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <TextField
            fullWidth
            margin="normal"
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange} // Added onChange for age field
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <TextField
            fullWidth
            select
            margin="normal"
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange} // Added onChange for gender field
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            name="symptoms"
            label="Describe your symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <TextField
            fullWidth
            margin="normal"
            name="duration"
            label="Duration (e.g. 3 days)"
            value={formData.duration}
            onChange={handleChange}
            required
            variant="outlined"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <Box mt={3}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
      </Box>

      {report && (
        <Box mt={4} p={3} component={Paper} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Diagnosis Report
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#f4f4f4",
              padding: 2,
              borderRadius: 1,
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(report, null, 2)}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default SymptomForm;
