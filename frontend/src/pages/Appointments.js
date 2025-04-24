import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/DoctorLayout';
import { DoctorContext } from '../contexts/DoctorContext';

const Appointments = () => {
  const theme = useTheme();
  const [filterStatus, setFilterStatus] = useState('all');
  const { currentDoctorId } = useContext(DoctorContext) || { currentDoctorId: 1 };
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    completed: 0,
    thisWeek: 0,
    upcoming: 0,
    pending: 0,
    patients: 0
  });
  
  // Doctor-specific appointment datasets
  const doctorAppointments = {
    1: { // Dr. Sarah Wilson - Psychologist
      appointments: [
        { id: 1, patientName: 'John Doe', time: '10:00 AM', date: 'Today', status: 'confirmed', avatar: '/avatar1.jpg', condition: 'Anxiety Treatment' },
        { id: 2, patientName: 'Sara Wilson', time: '11:30 AM', date: 'Today', status: 'confirmed', avatar: '/avatar2.jpg', condition: 'Depression Follow-up' },
        { id: 3, patientName: 'Michael Johnson', time: '2:15 PM', date: 'Today', status: 'pending', avatar: '/avatar3.jpg', condition: 'PTSD Initial Assessment' },
        { id: 4, patientName: 'Emily Davis', time: '9:00 AM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar4.jpg', condition: 'Grief Counseling' },
        { id: 5, patientName: 'Robert Smith', time: '10:30 AM', date: 'Tomorrow', status: 'cancelled', avatar: '/avatar5.jpg', condition: 'Insomnia Consultation' },
        { id: 6, patientName: 'Lisa Adams', time: '1:45 PM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar6.jpg', condition: 'Stress Management' },
        { id: 7, patientName: 'Jessica Miller', time: '3:00 PM', date: '24 Oct 2023', status: 'pending', avatar: '/avatar7.jpg', condition: 'Behavioral Assessment' },
        { id: 8, patientName: 'David Wilson', time: '11:15 AM', date: '24 Oct 2023', status: 'confirmed', avatar: '/avatar8.jpg', condition: 'Therapy Review' },
      ],
      stats: {
        todaysAppointments: 8,
        completed: 3,
        thisWeek: 24,
        upcoming: 16,
        pending: 5,
        patients: 124
      }
    },
    2: { // Dr. Robert Chen - Psychiatrist
      appointments: [
        { id: 1, patientName: 'Kevin Moore', time: '9:30 AM', date: 'Today', status: 'confirmed', avatar: '/avatar5.jpg', condition: 'Bipolar Medication Review' },
        { id: 2, patientName: 'Rachel Green', time: '11:00 AM', date: 'Today', status: 'confirmed', avatar: '/avatar6.jpg', condition: 'Schizophrenia Treatment' },
        { id: 3, patientName: 'Thomas Baker', time: '1:15 PM', date: 'Today', status: 'pending', avatar: '/avatar7.jpg', condition: 'Depression Medication' },
        { id: 4, patientName: 'Jennifer Lopez', time: '3:45 PM', date: 'Today', status: 'confirmed', avatar: '/avatar8.jpg', condition: 'ADHD Evaluation' },
        { id: 5, patientName: 'William Carter', time: '9:15 AM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar9.jpg', condition: 'OCD Treatment Plan' },
        { id: 6, patientName: 'Amanda Patel', time: '10:45 AM', date: 'Tomorrow', status: 'cancelled', avatar: '/avatar10.jpg', condition: 'Anxiety Disorder' },
        { id: 7, patientName: 'Alice Johnson', time: '2:30 PM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar11.jpg', condition: 'Mood Stabilizers Review' },
        { id: 8, patientName: 'Mark Wilson', time: '10:00 AM', date: '25 Oct 2023', status: 'pending', avatar: '/avatar12.jpg', condition: 'Paranoia Assessment' },
        { id: 9, patientName: 'Samantha Lee', time: '1:00 PM', date: '25 Oct 2023', status: 'confirmed', avatar: '/avatar13.jpg', condition: 'Medication Adjustment' },
        { id: 10, patientName: 'David Thompson', time: '3:30 PM', date: '25 Oct 2023', status: 'confirmed', avatar: '/avatar14.jpg', condition: 'Bipolar Follow-up' },
      ],
      stats: {
        todaysAppointments: 12,
        completed: 4,
        thisWeek: 35,
        upcoming: 22,
        pending: 8,
        patients: 187
      }
    },
    3: { // Dr. Emily Rodriguez - Neurologist
      appointments: [
        { id: 1, patientName: 'Christopher Miller', time: '8:45 AM', date: 'Today', status: 'confirmed', avatar: '/avatar15.jpg', condition: 'Epilepsy Management' },
        { id: 2, patientName: 'Olivia Parker', time: '10:30 AM', date: 'Today', status: 'confirmed', avatar: '/avatar16.jpg', condition: 'Migraine Treatment' },
        { id: 3, patientName: 'George Washington', time: '1:00 PM', date: 'Today', status: 'pending', avatar: '/avatar17.jpg', condition: 'Parkinson\'s Evaluation' },
        { id: 4, patientName: 'Patricia Evans', time: '3:15 PM', date: 'Today', status: 'confirmed', avatar: '/avatar18.jpg', condition: 'Multiple Sclerosis' },
        { id: 5, patientName: 'James Franklin', time: '9:30 AM', date: 'Tomorrow', status: 'confirmed', avatar: '/avatar19.jpg', condition: 'Stroke Recovery' },
        { id: 6, patientName: 'Elizabeth Clark', time: '11:45 AM', date: 'Tomorrow', status: 'cancelled', avatar: '/avatar20.jpg', condition: 'Nerve Conduction Study' },
      ],
      stats: {
        todaysAppointments: 6,
        completed: 2,
        thisWeek: 15,
        upcoming: 10,
        pending: 3,
        patients: 95
      }
    }
  };

  // Update appointments when doctor changes
  useEffect(() => {
    const doctorData = doctorAppointments[currentDoctorId] || doctorAppointments[1];
    setAppointments(doctorData.appointments);
    setStats(doctorData.stats);
  }, [currentDoctorId]);

  // Filter appointments based on status
  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

  // Group appointments by date
  const appointmentsByDate = filteredAppointments.reduce((groups, appointment) => {
    const { date } = appointment;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <DoctorLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Appointments</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your schedule and patient appointments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2 }}
            >
              New Appointment
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Today's Appointments</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <DateRangeIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{stats.todaysAppointments}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stats.completed} completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">This Week</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                    <EventIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{stats.thisWeek}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stats.upcoming} upcoming
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                    <AccessTimeIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Awaiting confirmation
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Patients</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{stats.patients}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Active patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            placeholder="Search appointments..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus}
              onChange={handleStatusChange}
              label="Status"
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Appointments List */}
        <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
          <CardContent>
            {Object.keys(appointmentsByDate).length > 0 ? (
              Object.entries(appointmentsByDate).map(([date, dateAppointments], index) => (
                <Box key={date} sx={{ mb: index !== Object.keys(appointmentsByDate).length - 1 ? 4 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DateRangeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="bold">{date}</Typography>
                  </Box>
                  <List sx={{ width: '100%' }}>
                    {dateAppointments.map((appointment) => (
                      <React.Fragment key={appointment.id}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{ py: 2, px: 0 }}
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
                                    bgcolor: alpha(getStatusColor(appointment.status), 0.1),
                                    color: getStatusColor(appointment.status),
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    textTransform: 'capitalize',
                                  }} 
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.primary">
                                  {appointment.time} • {appointment.condition}
                                </Typography>
                              </>
                            }
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small"
                              startIcon={<ArrowForwardIcon />}
                              sx={{ 
                                minWidth: 120, 
                                mr: 1,
                                borderRadius: '20px',
                              }}
                            >
                              Start Session
                            </Button>
                          </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No appointments found with the selected filter.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </DoctorLayout>
  );
};

export default Appointments; 