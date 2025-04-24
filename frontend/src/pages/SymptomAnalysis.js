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
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Slider,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tab,
  Tabs,
  Rating,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Medication as MedicationIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  InsertChart as ChartIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subDays, format, isToday, isSameDay } from 'date-fns';

// Mock chart components
// In a real app, you would import real chart libraries like recharts or chart.js
const LineChart = ({ data, color }) => (
  <Box sx={{ height: 200, position: 'relative', mt: 2 }}>
    <Box 
      sx={{ 
        height: '100%', 
        position: 'relative', 
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          bgcolor: 'divider',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '1px',
          bgcolor: 'divider',
        },
      }}
    >
      {data.map((point, index) => {
        const x = `${(index / (data.length - 1)) * 100}%`;
        const y = `${100 - (point.value / 10) * 100}%`;
        
        return (
          <Box 
            key={index}
            sx={{
              position: 'absolute',
              left: x,
              top: y,
              width: 8,
              height: 8,
              bgcolor: color || 'primary.main',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          />
        );
      })}
      
      {data.map((point, index) => {
        if (index === data.length - 1) return null;
        
        const x1 = `${(index / (data.length - 1)) * 100}%`;
        const y1 = `${100 - (point.value / 10) * 100}%`;
        const x2 = `${((index + 1) / (data.length - 1)) * 100}%`;
        const y2 = `${100 - (data[index + 1].value / 10) * 100}%`;
        
        return (
          <svg 
            key={`line-${index}`}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              overflow: 'visible',
            }}
          >
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              style={{
                stroke: color || '#1976d2',
                strokeWidth: 2,
              }}
            />
          </svg>
        );
      })}
      
      {/* Y-axis labels */}
      {[0, 2, 4, 6, 8, 10].map((val) => (
        <Typography
          key={val}
          variant="caption"
          sx={{
            position: 'absolute',
            right: 'calc(100% + 8px)',
            top: `${100 - (val / 10) * 100}%`,
            transform: 'translateY(-50%)',
            color: 'text.secondary',
          }}
        >
          {val}
        </Typography>
      ))}
      
      {/* X-axis labels (dates) */}
      {data.map((point, index) => {
        if (index % 2 !== 0 && index !== data.length - 1) return null;
        
        return (
          <Typography
            key={`date-${index}`}
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 'calc(0% - 24px)',
              left: `${(index / (data.length - 1)) * 100}%`,
              transform: 'translateX(-50%)',
              color: 'text.secondary',
            }}
          >
            {point.date}
          </Typography>
        );
      })}
    </Box>
  </Box>
);

// Mock data
const generateMockData = () => {
  // Headache intensity over time
  const headacheData = Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'MMM d'),
    value: Math.floor(Math.random() * 6) + (i === 13 ? 4 : 2), // Make today's value higher
  }));
  
  // Nausea intensity over time
  const nauseaData = Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'MMM d'),
    value: Math.floor(Math.random() * 4) + (i % 3 === 0 ? 3 : 1),
  }));
  
  const trackingHistory = [
    {
      id: 1,
      date: new Date(),
      symptoms: [
        { name: 'Headache', intensity: 7, notes: 'Throbbing pain in temples' },
        { name: 'Fatigue', intensity: 6, notes: 'Tired all day' },
      ],
      triggers: ['Stress', 'Poor sleep'],
      medications: ['Ibuprofen 400mg'],
    },
    {
      id: 2,
      date: subDays(new Date(), 1),
      symptoms: [
        { name: 'Headache', intensity: 4, notes: 'Mild pain' },
        { name: 'Nausea', intensity: 3, notes: 'After lunch' },
      ],
      triggers: ['Skipped breakfast'],
      medications: ['Ibuprofen 200mg'],
    },
    {
      id: 3,
      date: subDays(new Date(), 3),
      symptoms: [
        { name: 'Headache', intensity: 8, notes: 'Severe pain' },
        { name: 'Sensitivity to light', intensity: 7, notes: 'Had to close blinds' },
        { name: 'Nausea', intensity: 5, notes: 'All day' },
      ],
      triggers: ['Weather change', 'Stress'],
      medications: ['Ibuprofen 600mg', 'Rest in dark room'],
    },
  ];
  
  return { headacheData, nauseaData, trackingHistory };
};

const SymptomAnalysis = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [mockData, setMockData] = useState(generateMockData());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentSymptoms, setCurrentSymptoms] = useState([{ name: 'Headache', intensity: 5, notes: '' }]);
  const [triggers, setTriggers] = useState([]);
  const [medications, setMedications] = useState([]);
  
  const symptomOptions = [
    'Headache',
    'Nausea',
    'Fatigue',
    'Dizziness',
    'Fever',
    'Cough',
    'Sore throat',
    'Shortness of breath',
    'Joint pain',
    'Muscle pain',
    'Sensitivity to light',
    'Chest pain',
    'Abdominal pain',
  ];
  
  const triggerOptions = [
    'Stress',
    'Poor sleep',
    'Skipped meal',
    'Alcohol',
    'Weather change',
    'Exercise',
    'Caffeine',
    'Dehydration',
    'Screen time',
    'Allergies',
  ];
  
  const medicationOptions = [
    'Ibuprofen 200mg',
    'Ibuprofen 400mg',
    'Ibuprofen 600mg',
    'Acetaminophen 500mg',
    'Naproxen 250mg',
    'Aspirin 325mg',
    'Rest in dark room',
  ];

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setSelectedDate(new Date());
    setCurrentSymptoms([{ name: 'Headache', intensity: 5, notes: '' }]);
    setTriggers([]);
    setMedications([]);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleSymptomChange = (index, field, value) => {
    const updatedSymptoms = [...currentSymptoms];
    updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };
    setCurrentSymptoms(updatedSymptoms);
  };

  const handleAddSymptom = () => {
    setCurrentSymptoms([...currentSymptoms, { name: '', intensity: 5, notes: '' }]);
  };

  const handleRemoveSymptom = (index) => {
    const updatedSymptoms = [...currentSymptoms];
    updatedSymptoms.splice(index, 1);
    setCurrentSymptoms(updatedSymptoms);
  };

  const handleSaveEntry = () => {
    // Validate
    if (currentSymptoms.some(s => !s.name) || currentSymptoms.length === 0) {
      alert('Please select at least one symptom and fill in all required fields');
      return;
    }
    
    // Create new entry
    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      symptoms: currentSymptoms,
      triggers,
      medications,
    };
    
    // Update tracking history
    const updatedHistory = [newEntry, ...mockData.trackingHistory];
    setMockData({
      ...mockData,
      trackingHistory: updatedHistory,
    });
    
    handleCloseAddDialog();
  };

  const formatEntryDate = (date) => {
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'MMM d, yyyy');
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Dashboard
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Headache Intensity (Last 14 Days)
                      </Typography>
                      <BarChartIcon color="primary" />
                    </Box>
                    <LineChart data={mockData.headacheData} color="#f44336" />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Nausea Intensity (Last 14 Days)
                      </Typography>
                      <BarChartIcon color="primary" />
                    </Box>
                    <LineChart data={mockData.nauseaData} color="#4caf50" />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Symptom Summary</Typography>
                      <PieChartIcon color="primary" />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {['Headache', 'Nausea', 'Fatigue', 'Sensitivity to light'].map((symptom, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{symptom}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {Math.floor(Math.random() * 60) + 20}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.floor(Math.random() * 60) + 20} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: 'action.hover',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: index === 0 ? '#f44336' : 
                                        index === 1 ? '#4caf50' : 
                                        index === 2 ? '#2196f3' : '#ff9800',
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Common Triggers</Typography>
                      <InsightsIcon color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {[
                        { name: 'Stress', count: 8 },
                        { name: 'Poor sleep', count: 6 },
                        { name: 'Weather changes', count: 5 },
                        { name: 'Skipped meals', count: 4 },
                        { name: 'Screen time', count: 3 },
                        { name: 'Caffeine', count: 2 },
                      ].map((trigger, index) => (
                        <Chip 
                          key={index}
                          label={`${trigger.name} (${trigger.count})`}
                          sx={{ 
                            bgcolor: index < 3 ? 'error.light' : 'warning.light',
                            color: index < 3 ? 'error.dark' : 'warning.dark',
                            fontWeight: index < 3 ? 600 : 400,
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        AI Insights:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Based on your tracking data, stress and poor sleep appear to be the most common triggers for your symptoms. 
                        Consider stress reduction techniques and improving sleep hygiene.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 1: // Tracking History
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Symptom Tracking History
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
              >
                Add New Entry
              </Button>
            </Box>
            
            {mockData.trackingHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <TimelineIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tracking data yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start tracking your symptoms to see your history here
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                >
                  Add First Entry
                </Button>
              </Box>
            ) : (
              <Box>
                {mockData.trackingHistory.map((entry, index) => (
                  <Card key={entry.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="h6">
                            {formatEntryDate(entry.date)}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Symptoms:
                      </Typography>
                      
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Symptom</TableCell>
                              <TableCell align="center">Intensity</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {entry.symptoms.map((symptom, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{symptom.name}</TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Chip 
                                      label={symptom.intensity} 
                                      size="small"
                                      sx={{ 
                                        bgcolor: symptom.intensity > 7 ? 'error.light' : 
                                                symptom.intensity > 4 ? 'warning.light' : 'success.light',
                                        color: symptom.intensity > 7 ? 'error.dark' : 
                                               symptom.intensity > 4 ? 'warning.dark' : 'success.dark',
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>{symptom.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {entry.triggers.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Potential Triggers:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {entry.triggers.map((trigger, idx) => (
                              <Chip 
                                key={idx} 
                                label={trigger} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {entry.medications.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Medications Taken:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {entry.medications.map((med, idx) => (
                              <Chip 
                                key={idx} 
                                label={med} 
                                size="small" 
                                variant="outlined"
                                color="secondary"
                                icon={<MedicationIcon />}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        );
        
      default:
        return null;
    }
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
            <MedicationIcon sx={{ mr: 1, color: 'secondary.main' }} />
            Symptom Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<ChartIcon />} label="Dashboard" />
            <Tab icon={<TimelineIcon />} label="Tracking History" />
          </Tabs>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          {renderTabContent()}
        </Paper>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
          Symptom tracking helps identify patterns and triggers. Share this information with your healthcare provider to aid in diagnosis and treatment.
        </Typography>
      </Container>
      
      {/* Add Entry Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Track Symptoms</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Symptoms
              </Typography>
              
              {currentSymptoms.map((symptom, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 2, 
                    mb: 2,
                    pb: 2,
                    borderBottom: index !== currentSymptoms.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <FormControl sx={{ flexBasis: '220px', flexShrink: 0 }}>
                    <InputLabel>Symptom</InputLabel>
                    <Select
                      value={symptom.name}
                      onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                      label="Symptom"
                      fullWidth
                    >
                      {symptomOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography id={`intensity-slider-${index}`} gutterBottom>
                      Intensity: {symptom.intensity}
                    </Typography>
                    <Slider
                      value={symptom.intensity}
                      onChange={(e, newValue) => handleSymptomChange(index, 'intensity', newValue)}
                      aria-labelledby={`intensity-slider-${index}`}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={10}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      label="Notes"
                      value={symptom.notes}
                      onChange={(e) => handleSymptomChange(index, 'notes', e.target.value)}
                      size="small"
                      fullWidth
                    />
                    
                    {currentSymptoms.length > 1 && (
                      <IconButton 
                        onClick={() => handleRemoveSymptom(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddSymptom}
                sx={{ mt: 1 }}
              >
                Add Another Symptom
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Potential Triggers
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Select Triggers</InputLabel>
                <Select
                  multiple
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  label="Select Triggers"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {triggerOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={triggers.indexOf(option) > -1} />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Medications Taken
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Select Medications</InputLabel>
                <Select
                  multiple
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  label="Select Medications"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {medicationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={medications.indexOf(option) > -1} />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveEntry}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SymptomAnalysis; 