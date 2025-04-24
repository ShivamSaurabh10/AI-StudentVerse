import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
  IconButton, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Badge,
  Chip,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { 
  PeopleAlt as PatientsIcon,
  DateRange as AppointmentsIcon,
  InsertChart as AnalyticsIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  CompareArrows as SwitchIcon,
  CompareArrows,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/DoctorLayout';
import { DoctorContext } from '../contexts/DoctorContext';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DoctorDashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [doctorSwitcherAnchor, setDoctorSwitcherAnchor] = useState(null);
  const { currentDoctorId, currentDoctor, availableDoctors, switchDoctor } = useContext(DoctorContext);
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAnalysis, setRecentAnalysis] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    completedAppointments: 0,
    pendingReviews: 0,
    analysisCompleted: 0
  });
  
  // Doctor-specific data sets
  const doctorsData = {
    1: { // Dr. Sarah Wilson
      appointments: [
        { id: 1, patientName: 'John Doe', time: '10:00 AM', date: 'Today', status: 'confirmed', avatar: '/avatar1.jpg', condition: 'Anxiety' },
        { id: 2, patientName: 'Sara Wilson', time: '11:30 AM', date: 'Today', status: 'confirmed', avatar: '/avatar2.jpg', condition: 'Depression' },
        { id: 3, patientName: 'Michael Johnson', time: '2:15 PM', date: 'Today', status: 'pending', avatar: '/avatar3.jpg', condition: 'PTSD' },
        { id: 4, patientName: 'Emily Davis', time: '9:00 AM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar4.jpg', condition: 'Grief Counseling' },
      ],
      analysis: [
        { id: 1, patientName: 'Lisa Adams', date: '2 hours ago', sentiment: 'positive', insights: 'Patient shows improved mood and engagement', score: 0.85 },
        { id: 2, patientName: 'Robert Smith', date: 'Yesterday', sentiment: 'neutral', insights: 'No significant changes in emotional patterns', score: 0.45 },
        { id: 3, patientName: 'Jessica Miller', date: '2 days ago', sentiment: 'negative', insights: 'Detected increased anxiety levels', score: -0.65 },
      ],
      stats: {
        totalPatients: 124,
        todaysAppointments: 8,
        completedAppointments: 3,
        pendingReviews: 5,
        analysisCompleted: 42
      }
    },
    2: { // Dr. Robert Chen
      appointments: [
        { id: 1, patientName: 'Kevin Moore', time: '9:30 AM', date: 'Today', status: 'confirmed', avatar: '/avatar5.jpg', condition: 'Bipolar Disorder' },
        { id: 2, patientName: 'Rachel Green', time: '1:00 PM', date: 'Today', status: 'pending', avatar: '/avatar6.jpg', condition: 'Medication Review' },
        { id: 3, patientName: 'Thomas Baker', time: '3:45 PM', date: 'Today', status: 'confirmed', avatar: '/avatar7.jpg', condition: 'Schizophrenia' },
        { id: 4, patientName: 'Jennifer Lopez', time: '11:15 AM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar8.jpg', condition: 'ADHD' },
        { id: 5, patientName: 'William Carter', time: '2:30 PM', date: 'Tomorrow', status: 'pending', avatar: '/avatar9.jpg', condition: 'OCD' },
      ],
      analysis: [
        { id: 1, patientName: 'Alice Johnson', date: '1 hour ago', sentiment: 'positive', insights: 'Medication appears to be stabilizing mood cycles', score: 0.78 },
        { id: 2, patientName: 'Mark Wilson', date: 'Today', sentiment: 'negative', insights: 'Patient showing increased paranoid ideation', score: -0.82 },
        { id: 3, patientName: 'Samantha Lee', date: 'Yesterday', sentiment: 'neutral', insights: 'Maintaining baseline with current medication', score: 0.12 },
        { id: 4, patientName: 'David Thompson', date: '3 days ago', sentiment: 'positive', insights: 'Significant reduction in manic episodes', score: 0.91 },
      ],
      stats: {
        totalPatients: 187,
        todaysAppointments: 12,
        completedAppointments: 4,
        pendingReviews: 8,
        analysisCompleted: 63
      }
    },
    3: { // Dr. Emily Rodriguez
      appointments: [
        { id: 1, patientName: 'Christopher Miller', time: '8:45 AM', date: 'Today', status: 'confirmed', avatar: '/avatar10.jpg', condition: 'Epilepsy' },
        { id: 2, patientName: 'Olivia Parker', time: '12:15 PM', date: 'Today', status: 'confirmed', avatar: '/avatar11.jpg', condition: 'Migraine' },
        { id: 3, patientName: 'George Washington', time: '4:30 PM', date: 'Tomorrow', status: 'pending', avatar: '/avatar12.jpg', condition: 'Stroke Recovery' },
      ],
      analysis: [
        { id: 1, patientName: 'Patricia Evans', date: '3 hours ago', sentiment: 'positive', insights: 'EEG shows reduced seizure activity', score: 0.76 },
        { id: 2, patientName: 'James Franklin', date: 'Yesterday', sentiment: 'neutral', insights: 'Headache frequency unchanged after medication adjustment', score: 0.22 },
      ],
      stats: {
        totalPatients: 95,
        todaysAppointments: 6,
        completedAppointments: 2,
        pendingReviews: 3,
        analysisCompleted: 28
      }
    }
  };

  // Update data when doctor changes
  useEffect(() => {
    const doctorData = doctorsData[currentDoctorId];
    if (doctorData) {
      setUpcomingAppointments(doctorData.appointments);
      setRecentAnalysis(doctorData.analysis);
      setDashboardStats(doctorData.stats);
    }
  }, [currentDoctorId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDoctorSwitcherOpen = (event) => {
    setDoctorSwitcherAnchor(event.currentTarget);
  };
  
  const handleDoctorSwitcherClose = () => {
    setDoctorSwitcherAnchor(null);
  };

  const handleSwitchDoctor = (doctorId) => {
    switchDoctor(doctorId);
    handleDoctorSwitcherClose();
  };
  
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'neutral': return theme.palette.warning.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <DoctorLayout>
      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Quick Doctor Switcher */}
        <Card 
          sx={{ 
            mb: 4, 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', 
            borderRadius: 2,
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SwitchIcon 
                sx={{ 
                  mr: 2, 
                  color: theme.palette.primary.main,
                  fontSize: 28,
                }} 
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  Current Profile
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {currentDoctor.name}, {currentDoctor.specialty}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined"
              color="primary"
              startIcon={<SwitchIcon />}
              onClick={handleDoctorSwitcherOpen}
              sx={{ 
                borderRadius: 8,
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  background: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Switch Doctor
            </Button>
            
            {/* Quick Doctor Switcher Menu */}
            <Menu
              anchorEl={doctorSwitcherAnchor}
              open={Boolean(doctorSwitcherAnchor)}
              onClose={handleDoctorSwitcherClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  minWidth: 250,
                },
              }}
            >
              <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Quick Switch
                </Typography>
              </Box>
              <Divider />
              {availableDoctors.map((doctor) => (
                <MenuItem 
                  key={doctor.id} 
                  onClick={() => handleSwitchDoctor(doctor.id)}
                  selected={doctor.id === currentDoctorId}
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <Avatar 
                      src={doctor.avatar} 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: !doctor.avatar ? theme.palette.primary.main : 'transparent' 
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doctor.name} 
                    secondary={doctor.specialty} 
                    primaryTypographyProps={{ fontWeight: doctor.id === currentDoctorId ? 'bold' : 'normal' }}
                  />
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={handleDoctorSwitcherClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Add New Doctor" />
              </MenuItem>
            </Menu>
          </CardContent>
        </Card>
        
        {/* Top Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Patients</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <PatientsIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{dashboardStats.totalPatients}</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> +8 new this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Today's Appointments</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                    <AppointmentsIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{dashboardStats.todaysAppointments}</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> 3 completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Pending Reviews</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                    <WarningIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{dashboardStats.pendingReviews}</Typography>
                <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <WarningIcon fontSize="small" sx={{ mr: 0.5 }} /> Requires attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Analysis Completed</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                    <AnalyticsIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{dashboardStats.analysisCompleted}</Typography>
                <Typography variant="body2" color="info.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> This week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Main Tabs Section */}
        <Paper sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2, p: 0, mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 120,
                py: 2,
              }
            }}
          >
            <Tab label="Appointments" />
            <Tab label="Recent Analysis" />
            <Tab label="Patient Insights" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <List sx={{ width: '100%' }}>
              {upcomingAppointments.map((appointment) => (
                <React.Fragment key={appointment.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={appointment.avatar}
                        alt={appointment.patientName}
                        sx={{ 
                          width: 50, 
                          height: 50,
                          border: appointment.status === 'confirmed' 
                            ? `2px solid ${theme.palette.success.main}` 
                            : '2px solid transparent'
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight="bold" 
                            sx={{ mr: 1 }}
                          >
                            {appointment.patientName}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={appointment.status} 
                            sx={{ 
                              bgcolor: appointment.status === 'confirmed' 
                                ? alpha(theme.palette.success.main, 0.1) 
                                : alpha(theme.palette.warning.main, 0.1),
                              color: appointment.status === 'confirmed' 
                                ? theme.palette.success.main 
                                : theme.palette.warning.main,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }} 
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.primary">
                            {appointment.time} • {appointment.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.condition}
                          </Typography>
                        </>
                      }
                    />
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      sx={{ 
                        minWidth: 120, 
                        ml: 2, 
                        alignSelf: 'center',
                        borderRadius: '20px',
                      }}
                    >
                      Start Session
                    </Button>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" sx={{ borderRadius: 2 }}>View All Appointments</Button>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <List sx={{ width: '100%' }}>
              {recentAnalysis.map((analysis) => (
                <React.Fragment key={analysis.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          minWidth: 100, 
                          borderRadius: '20px',
                        }}
                      >
                        View Details
                      </Button>
                    }
                    sx={{ py: 2 }}
                  >
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: getSentimentColor(analysis.sentiment),
                        mr: 2,
                        alignSelf: 'center'
                      }} 
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight="bold" 
                            sx={{ mr: 1 }}
                          >
                            {analysis.patientName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 'auto' }}
                          >
                            {analysis.date}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.primary" gutterBottom>
                            Sentiment: <span style={{ color: getSentimentColor(analysis.sentiment), fontWeight: 500 }}>
                              {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} ({analysis.score})
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {analysis.insights}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" sx={{ borderRadius: 2 }}>View All Analysis</Button>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Patient insights features coming soon
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
        
        {/* Quick Links */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <PatientsIcon sx={{ mb: 1 }} />
                      New Patient
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <AppointmentsIcon sx={{ mb: 1 }} />
                      Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <AnalyticsIcon sx={{ mb: 1 }} />
                      Analysis
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <MessageIcon sx={{ mb: 1 }} />
                      Messages
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Patient file updated: John Doe"
                      secondary="Today, 11:30 AM"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Analysis completed: Sara Wilson"
                      secondary="Today, 10:15 AM"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="New appointment scheduled: Michael Johnson"
                      secondary="Yesterday, 3:45 PM"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Therapy notes added: Emily Davis"
                      secondary="Yesterday, 2:20 PM"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DoctorLayout>
  );
};

export default DoctorDashboard; 