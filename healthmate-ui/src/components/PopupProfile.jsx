

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
    FormGroup
} from '@mui/material';

const medicalHistoryOptions = [
    'Heart Disease',
    'Diabetes',
    'Cancer',
    'High Blood Pressure',
    'Stroke'
];

const HealthScreeningForm = ({open, onClose, onSave, extraFields = []}) => {
    // const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        contact: '',
        email: '',
        hasMedicalConditions: '',
        medicalConditions: '',
        hadSurgeries: '',
        surgeries: '',
        medicalHistory: [],
        notes: ''
    });

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
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {children}
        </div>
    );

    return (
        <>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Health Screening Form
            </Button> */}
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle> Complete Your Health Profile</DialogTitle> 
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {/* Section 1: Personal Info */}
                        <div>
                            <h3>Personal Information</h3>
                            <Row>
                                <TextField
                                    size="small"
                                    name="name"
                                    label="Name"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <TextField
                                    size="small"
                                    name="department"
                                    label="Department"
                                    fullWidth
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </Row>
                            <Row>
                                <TextField
                                    size="small"
                                    name="contact"
                                    label="Contact Number"
                                    fullWidth
                                    value={formData.contact}
                                    onChange={handleChange}
                                />
                                <TextField
                                    size="small"
                                    name="email"
                                    label="Email Address"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Row>
                            <Row>
                                <TextField
                                    size="small"
                                    name="age"
                                    label="Age"
                                    fullWidth
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                                <FormControl fullWidth>
                                    {/* <FormLabel>Gender</FormLabel> */}
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    </RadioGroup>

                                </FormControl>
                            </Row>

                             <Row>
                                <TextField
                                    size="small"
                                    name="height"
                                    label="Height (cm)"
                                    fullWidth
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                                <TextField
                                    size="small"
                                    name="weight"
                                    label="Weight (kg)"
                                    fullWidth
                                    value={formData.weight}
                                    onChange={handleChange}
                                />
                            </Row>
                        </div>

                        {/* Section 2: Health Screening */}
                        <div>
                            <h3>Health Screening</h3>
                            <Row>
                                <FormControl fullWidth>
                                    <FormLabel>Any medical conditions?</FormLabel>
                                    <RadioGroup
                                        row
                                        name="hasMedicalConditions"
                                        value={formData.hasMedicalConditions}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                    {/* {formData.hasMedicalConditions === 'yes' && ( */}
                                    <TextField
                                        size="small"
                                        name="medicalConditions"
                                        label="If Yes( Please specify )"
                                        fullWidth
                                        value={formData.medicalConditions}
                                        onChange={handleChange}
                                        style={{ marginTop: '8px' }}
                                    />
                                    {/* )} */}
                                </FormControl>

                                <FormControl fullWidth>
                                    <FormLabel>Any surgeries in the past year?</FormLabel>
                                    <RadioGroup
                                        row
                                        name="hadSurgeries"
                                        value={formData.hadSurgeries}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                    {/* {formData.hadSurgeries === 'yes' && ( */}
                                    <TextField
                                        size="small"
                                        name="surgeries"
                                        label="If Yes( Please specify )"
                                        fullWidth
                                        value={formData.surgeries}
                                        onChange={handleChange}
                                        style={{ marginTop: '8px' }}
                                    />
                                    {/* )} */}
                                </FormControl>
                            </Row>
                        </div>

                        {/* Section 3: Medical History */}
                        <div>
                            <h3>Medical History</h3>
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
                            <TextField
                                size="small"
                                name="notes"
                                label="Additional Notes"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.notes}
                                onChange={handleChange}
                                style={{ marginTop: '16px' }}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HealthScreeningForm;

