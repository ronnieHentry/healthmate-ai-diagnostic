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

const SymptomForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    symptoms: "",
    duration: "",
  });

  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/symptoms",
        formData
      );
      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting symptoms");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={4} component={Paper} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Symptom Input Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={formData.name}
            disabled
          />
          <TextField
            fullWidth
            margin="normal"
            name="age"
            label="Age"
            value={formData.age}
            disabled
          />
          <TextField
            fullWidth
            select
            margin="normal"
            name="gender"
            label="Gender"
            value={formData.gender}
            disabled
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
          />
          <TextField
            fullWidth
            margin="normal"
            name="duration"
            label="Duration (e.g. 3 days)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
      </Box>

      {report && (
        <Box mt={4} p={3} component={Paper} elevation={2}>
          <Typography variant="h6">Diagnosis Report</Typography>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
};

export default SymptomForm;
