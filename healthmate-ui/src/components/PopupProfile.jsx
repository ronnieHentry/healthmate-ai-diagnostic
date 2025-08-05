

import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    FormControl,
    Checkbox,
    FormGroup,
    MenuItem,
    Typography,
    Paper,
    Divider,
    Grid
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const medicalHistoryOptions = [
    'Heart Disease',
    'Diabetes',
    'Cancer',
    'High Blood Pressure',
    'Stroke'
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const maritalStatuses = ['Single', 'Married', 'Widowed', 'Divorced'];
const occupations = ['Software Engineer', 'Accountant', 'Teacher', 'Designer', 'Manager', 'Student', 'Chef', 'Retired', 'Salesperson', 'Nurse', 'Other'];
const medicationOptions = ['Metformin', 'Lisinopril', 'Ibuprofen', 'Aspirin', 'Sumatriptan', 'Albuterol', 'Fluoxetine', 'Allopurinol', 'Levothyroxine', 'Cetirizine', 'Statins', 'Meloxicam', 'Vitamin D supplements'];
const allergyOptions = ['Peanuts', 'Penicillin', 'Shellfish', 'Dairy', 'Latex', 'Pollen', 'Gluten', 'None'];


const HealthScreeningForm = ({open, onClose, onSave, extraFields = [], medicalHistoryData}) => {
    // const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        blood_group: '',
        marital_status: '',
        address: '',
        emergency_contact: '',
        contact: '',
        email: '',
        hasMedicalConditions: '',
        medicalConditions: '',
        hadSurgeries: '',
        surgeries: '',
        medicalHistory: [],
        notes: '',
        past_illnesses: '',
        medications: '',
        allergies: '',
        chronic_conditions: '',
        family_history: '',
        recent_test_results: '',
        height: '',
        weight: '',
        age: '',
        gender: ''
    });

    // Autofill form when medicalHistoryData changes
    React.useEffect(() => {
        if (medicalHistoryData) {
            setFormData(prev => ({
                ...prev,
                ...medicalHistoryData,
                medicalHistory: Array.isArray(medicalHistoryData.medicalHistory) ? medicalHistoryData.medicalHistory : [],
                medications: medicalHistoryData.medications || '',
                allergies: medicalHistoryData.allergies || '',
                height: medicalHistoryData.height || '',
                weight: medicalHistoryData.weight || '',
                age: medicalHistoryData.age || '',
                gender: medicalHistoryData.gender || ''
            }));
        }
    }, [medicalHistoryData]);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prev) => {
                const updated = checked
                    ? [...prev.medicalHistory, value]
                    : prev.medicalHistory.filter((item) => item !== value);
                return { ...prev, medicalHistory: updated };
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        console.log('Submitted Form:', formData);
        setOpen(false);
    };

    const Row = ({ children }) => (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {React.Children.map(children, (child, idx) => (
                <Grid item xs={12} sm={6} key={idx}>{child}</Grid>
            ))}
        </Grid>
    );

    return (
        <div>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4, background: '#f8fafc' } }}>
                <DialogTitle>
                    <Typography variant="h5" fontWeight={700} color="primary.main">Complete Your Health Profile</Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: '#fff', mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom color="primary">Personal Information</Typography>
                        {/* ...existing code for personal info fields... */}
                        <Row>
                            <TextField size="small" name="name" label="Name" fullWidth value={formData.name} onChange={handleChange} variant="outlined" />
                            <Autocomplete 
                                options={occupations} 
                                value={formData.occupation} 
                                onChange={(e, value) => setFormData(prev => ({ ...prev, occupation: value }))}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Occupation" 
                                        size="small" 
                                        fullWidth 
                                        variant="outlined" 
                                        sx={{ minWidth: 250 }}
                                    />
                                )} 
                            />
                        </Row>
                        <Row>
                            <TextField 
                                select 
                                size="small" 
                                name="blood_group" 
                                label="Blood Group" 
                                fullWidth 
                                value={formData.blood_group} 
                                onChange={handleChange} 
                                variant="outlined"
                                sx={{ minWidth: 180 }}
                            >
                                {bloodGroups.map(bg => (<MenuItem key={bg} value={bg}>{bg}</MenuItem>))}
                            </TextField>
                            <TextField 
                                select 
                                size="small" 
                                name="marital_status" 
                                label="Marital Status" 
                                fullWidth 
                                value={formData.marital_status} 
                                onChange={handleChange} 
                                variant="outlined"
                                sx={{ minWidth: 200 }}
                            >
                                {maritalStatuses.map(ms => (<MenuItem key={ms} value={ms}>{ms}</MenuItem>))}
                            </TextField>
                        </Row>
                        <Row>
                            <TextField size="small" name="address" label="Address" fullWidth value={formData.address} onChange={handleChange} variant="outlined" />
                            <TextField size="small" name="emergency_contact" label="Emergency Contact" fullWidth value={formData.emergency_contact} onChange={handleChange} variant="outlined" />
                        </Row>
                        <Row>
                            <TextField size="small" name="contact" label="Contact Number" fullWidth value={formData.contact} onChange={handleChange} variant="outlined" />
                            <TextField size="small" name="email" label="Email Address" fullWidth value={formData.email} onChange={handleChange} variant="outlined" />
                        </Row>
                        <Row>
                            <TextField size="small" name="age" label="Age" fullWidth value={formData.age} onChange={handleChange} variant="outlined" />
                            {/* Gender selection can be added here if needed */}
                        </Row>
                        <Row>
                            <Autocomplete multiple options={medicationOptions} value={formData.medications ? formData.medications.split(',').map(m => m.trim()) : []} onChange={(e, value) => setFormData(prev => ({ ...prev, medications: value.join(', ') }))} renderInput={(params) => (<TextField {...params} label="Medications" size="small" fullWidth placeholder="e.g. Metformin, Lisinopril" variant="outlined" />)} />
                        </Row>
                        <Row>
                            <TextField size="small" name="height" label="Height (cm)" fullWidth value={formData.height} onChange={handleChange} variant="outlined" />
                            <TextField size="small" name="weight" label="Weight (kg)" fullWidth value={formData.weight} onChange={handleChange} variant="outlined" />
                        </Row>
                    </Paper>
                    <Divider sx={{ my: 3 }} />
                    {/* Section 4: Medical Details from medical_histories.json */}
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">Medical Details</Typography>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, background: '#f9fafb', mb: 3 }}>
                        <Row>
                            <TextField size="small" name="past_illnesses" label="Past Illnesses" fullWidth value={formData.past_illnesses} onChange={handleChange} placeholder="e.g. Asthma, Diabetes" />
                            <TextField size="small" name="medications" label="Medications" fullWidth value={formData.medications} onChange={handleChange} placeholder="e.g. Metformin, Lisinopril" />
                        </Row>
                        <Row>
                            <Autocomplete multiple options={allergyOptions} value={formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : []} onChange={(e, value) => setFormData(prev => ({ ...prev, allergies: value.join(', ') }))} renderInput={(params) => (<TextField {...params} label="Allergies" size="small" fullWidth placeholder="e.g. peanuts, pollen" />)} />
                            <TextField size="small" name="chronic_conditions" label="Chronic Conditions" fullWidth value={formData.chronic_conditions} onChange={handleChange} placeholder="e.g. Hypertension, Asthma" />
                        </Row>
                        <Row>
                            <TextField size="small" name="family_history" label="Family History" fullWidth value={formData.family_history} onChange={handleChange} placeholder="e.g. Father: Diabetes; Mother: Cancer" />
                            <TextField size="small" name="recent_test_results" label="Recent Test Results" fullWidth value={formData.recent_test_results} onChange={handleChange} placeholder="e.g. Blood pressure: 120/80 mmHg" />
                        </Row>
                    </Paper>
                    <Divider sx={{ my: 3 }} />
                    {/* Section 2: Health Screening */}
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">Health Screening</Typography>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, background: '#f9fafb', mb: 3 }}>
                        <Row>
                            <FormControl fullWidth>
                                <FormLabel>Any medical conditions?</FormLabel>
                                <RadioGroup row name="hasMedicalConditions" value={formData.hasMedicalConditions} onChange={handleChange}>
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                                {/* {formData.hasMedicalConditions === 'yes' && ( */}
                                <TextField size="small" name="medicalConditions" label="If Yes( Please specify )" fullWidth value={formData.medicalConditions} onChange={handleChange} style={{ marginTop: '8px' }} />
                                {/* )} */}
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel>Any surgeries in the past year?</FormLabel>
                                <RadioGroup row name="hadSurgeries" value={formData.hadSurgeries} onChange={handleChange}>
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                                {/* {formData.hadSurgeries === 'yes' && ( */}
                                <TextField size="small" name="surgeries" label="If Yes( Please specify )" fullWidth value={formData.surgeries} onChange={handleChange} style={{ marginTop: '8px' }} />
                                {/* )} */}
                            </FormControl>
                        </Row>
                    </Paper>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">Medical History</Typography>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, background: '#f9fafb' }}>
                        <FormGroup row>
                            {medicalHistoryOptions.map((condition) => (
                                <FormControlLabel
                                    key={condition}
                                    control={
                                        <Checkbox
                                            checked={formData.medicalHistory.includes(condition)}
                                            onChange={handleChange}
                                            name="medicalHistory"
                                            value={condition}
                                        />
                                    }
                                    label={condition}
                                />
                            ))}
                        </FormGroup>
                        <TextField size="small" name="notes" label="Additional Notes" multiline rows={3} fullWidth value={formData.notes} onChange={handleChange} style={{ marginTop: '16px' }} />
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} color="secondary" variant="outlined" sx={{ borderRadius: 2, mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2 }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default HealthScreeningForm;

