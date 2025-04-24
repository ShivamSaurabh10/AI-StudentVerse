import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import {
  ArrowBack as ArrowBackIcon,
  AccessAlarm as AlarmIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Medication as MedicationIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

const MedicineTimer = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      times: [new Date('2023-01-01T08:00:00')],
      nextDose: new Date(new Date().setHours(8, 0, 0, 0)),
      active: true,
      instructions: 'Take with food',
      color: '#4caf50',
    },
    {
      id: 2,
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'as needed',
      times: [new Date('2023-01-01T14:00:00')],
      nextDose: new Date(new Date().setHours(14, 0, 0, 0)),
      active: true,
      instructions: 'Take with food for pain',
      color: '#2196f3',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMedication, setCurrentMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: [new Date('2023-01-01T08:00:00')],
    active: true,
    instructions: '',
    color: '#4caf50',
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const colorOptions = [
    { value: '#4caf50', label: 'Green' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as needed', label: 'As Needed' },
  ];

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleOpenDialog = (medication = null, index = -1) => {
    if (medication) {
      setCurrentMedication({ ...medication });
      setEditIndex(index);
    } else {
      setCurrentMedication({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: [new Date('2023-01-01T08:00:00')],
        active: true,
        instructions: '',
        color: '#4caf50',
      });
      setEditIndex(-1);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedication({
      ...currentMedication,
      [name]: value,
    });
  };

  const handleTimeChange = (newTime, index) => {
    const updatedTimes = [...currentMedication.times];
    updatedTimes[index] = newTime;
    setCurrentMedication({
      ...currentMedication,
      times: updatedTimes,
    });
  };

  const handleAddTime = () => {
    setCurrentMedication({
      ...currentMedication,
      times: [...currentMedication.times, new Date('2023-01-01T12:00:00')],
    });
  };

  const handleRemoveTime = (index) => {
    const updatedTimes = [...currentMedication.times];
    updatedTimes.splice(index, 1);
    setCurrentMedication({
      ...currentMedication,
      times: updatedTimes,
    });
  };

  const handleToggleActive = (index) => {
    const updatedMedications = [...medications];
    updatedMedications[index].active = !updatedMedications[index].active;
    setMedications(updatedMedications);
    
    const action = updatedMedications[index].active ? 'enabled' : 'disabled';
    setSnackbarMessage(`Reminders for ${updatedMedications[index].name} ${action}`);
    setSnackbarOpen(true);
  };

  const handleSaveMedication = () => {
    if (!currentMedication.name || !currentMedication.dosage) {
      setSnackbarMessage('Please provide medication name and dosage');
      setSnackbarOpen(true);
      return;
    }

    const updatedMedications = [...medications];
    
    // Calculate the next dose time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let nextDoseTime = null;
    
    // Find the next dose time based on the current time
    for (const time of currentMedication.times) {
      const doseTime = new Date(today);
      doseTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
      
      if (doseTime > now) {
        if (!nextDoseTime || doseTime < nextDoseTime) {
          nextDoseTime = doseTime;
        }
      }
    }
    
    // If all times are in the past for today, set for tomorrow
    if (!nextDoseTime && currentMedication.times.length > 0) {
      const tomorrow = addDays(today, 1);
      const time = currentMedication.times[0];
      nextDoseTime = new Date(tomorrow);
      nextDoseTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
    }

    const medicationWithNextDose = {
      ...currentMedication,
      nextDose: nextDoseTime,
      id: editIndex >= 0 ? medications[editIndex].id : Date.now(),
    };

    if (editIndex >= 0) {
      updatedMedications[editIndex] = medicationWithNextDose;
      setSnackbarMessage(`${medicationWithNextDose.name} updated successfully`);
    } else {
      updatedMedications.push(medicationWithNextDose);
      setSnackbarMessage(`${medicationWithNextDose.name} added to your reminders`);
    }
    
    setMedications(updatedMedications);
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteMedication = (index) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      const updatedMedications = [...medications];
      const deletedMed = updatedMedications[index];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
      
      setSnackbarMessage(`${deletedMed.name} removed from your reminders`);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const formatTimeString = (date) => {
    return format(date, 'h:mm a');
  };

  const getNextDoseText = (med) => {
    if (!med.active) return 'Reminders disabled';
    if (!med.nextDose) return 'No upcoming doses';
    
    const now = new Date();
    const nextDose = new Date(med.nextDose);
    
    // If nextDose is today
    if (nextDose.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0)) {
      return `Today at ${format(med.nextDose, 'h:mm a')}`;
    }
    
    // If nextDose is tomorrow
    const tomorrow = addDays(new Date().setHours(0, 0, 0, 0), 1);
    if (nextDose.setHours(0, 0, 0, 0) === tomorrow) {
      return `Tomorrow at ${format(med.nextDose, 'h:mm a')}`;
    }
    
    // Otherwise, include the date
    return format(med.nextDose, 'EEE, MMM d at h:mm a');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <AlarmIcon sx={{ mr: 1, color: 'warning.main' }} />
            Medicine Timer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Medication Reminders
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Medication
            </Button>
          </Box>
          
          {medications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <MedicationIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No medications added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add your first medication to get reminders
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Medication
              </Button>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {medications.map((med, index) => (
                <React.Fragment key={med.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    sx={{
                      py: 2,
                      borderLeft: `4px solid ${med.color}`,
                      opacity: med.active ? 1 : 0.6,
                    }}
                  >
                    <ListItemIcon>
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={!med.active}
                      >
                        <MedicationIcon style={{ color: med.color }} />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {med.name} - {med.dosage}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              ml: 1,
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {med.frequency}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {med.instructions}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AlarmIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: med.active ? 'warning.main' : 'text.disabled' }} />
                            <Typography variant="body2" color={med.active ? 'text.primary' : 'text.disabled'} fontWeight={med.active ? 500 : 400}>
                              {getNextDoseText(med)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="toggle" onClick={() => handleToggleActive(index)} sx={{ mr: 1 }}>
                        {med.active ? <NotificationsActiveIcon color="warning" /> : <NotificationsIcon color="disabled" />}
                      </IconButton>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(med, index)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMedication(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
          Remember: Always follow your healthcare provider's instructions for all medications.
          This app provides reminders only and does not replace professional medical advice.
        </Typography>
      </Container>

      {/* Add/Edit Medication Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Medication' : 'Add New Medication'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Medication Name"
                value={currentMedication.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dosage"
                label="Dosage"
                value={currentMedication.dosage}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g., 10mg, 1 tablet"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  name="frequency"
                  value={currentMedication.frequency}
                  onChange={handleInputChange}
                  label="Frequency"
                >
                  {frequencyOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  name="color"
                  value={currentMedication.color}
                  onChange={handleInputChange}
                  label="Color"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          bgcolor: selected, 
                          borderRadius: '50%',
                          mr: 1
                        }} 
                      />
                      {colorOptions.find(opt => opt.value === selected)?.label}
                    </Box>
                  )}
                >
                  {colorOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 20, 
                            height: 20, 
                            bgcolor: option.value, 
                            borderRadius: '50%',
                            mr: 1
                          }} 
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="instructions"
                label="Instructions"
                value={currentMedication.instructions}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                placeholder="E.g., Take with food, take before bedtime"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Reminder Times
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {currentMedication.times.map((time, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimePicker
                      label={`Time ${index + 1}`}
                      value={time}
                      onChange={(newTime) => handleTimeChange(newTime, index)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    {currentMedication.times.length > 1 && (
                      <IconButton 
                        onClick={() => handleRemoveTime(index)} 
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </LocalizationProvider>
              
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddTime}
                disabled={currentMedication.times.length >= 4}
              >
                Add Another Time
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentMedication.active}
                    onChange={(e) => setCurrentMedication({
                      ...currentMedication,
                      active: e.target.checked,
                    })}
                    color="primary"
                  />
                }
                label="Enable Reminders"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveMedication} 
            variant="contained"
            startIcon={<CheckCircleIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicineTimer; 