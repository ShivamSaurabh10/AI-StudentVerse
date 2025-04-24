import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  Badge,
} from '@mui/material';
import { 
  MedicalServices as DoctorIcon,
  Dashboard as DashboardIcon,
  PeopleAlt as PatientsIcon,
  DateRange as AppointmentsIcon,
  InsertChart as AnalyticsIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  SearchRounded as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
  PersonAdd as PersonAddIcon,
  PermIdentity as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DoctorContext } from '../contexts/DoctorContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Default mock data for fallback
const defaultDoctors = [
  { id: 1, name: "Dr. Sarah Wilson", specialty: "Psychologist", avatar: null },
  { id: 2, name: "Dr. Robert Chen", specialty: "Psychiatrist", avatar: "/doctor2.jpg" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Neurologist", avatar: "/doctor3.jpg" },
];

const DoctorLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctorMenuAnchor, setDoctorMenuAnchor] = useState(null);
  
  const contextData = useContext(DoctorContext);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  
  // Initialize with context data or default data
  useEffect(() => {
    try {
      if (contextData) {
        setCurrentDoctor(contextData.currentDoctor);
        setAvailableDoctors(contextData.availableDoctors);
      } else {
        console.warn("DoctorContext is undefined, using default data");
        setCurrentDoctor(defaultDoctors[0]);
        setAvailableDoctors(defaultDoctors);
      }
    } catch (error) {
      console.error("Error using DoctorContext:", error);
      setCurrentDoctor(defaultDoctors[0]);
      setAvailableDoctors(defaultDoctors);
    }
  }, [contextData]);
  
  // Handle loading state
  if (!currentDoctor) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading doctor profile...</Typography>
      </Box>
    );
  }
  
  const handleDoctorMenuOpen = (event) => {
    setDoctorMenuAnchor(event.currentTarget);
  };
  
  const handleDoctorMenuClose = () => {
    setDoctorMenuAnchor(null);
  };
  
  const handleSwitchDoctor = (doctor) => {
    try {
      if (contextData && contextData.switchDoctor) {
        contextData.switchDoctor(doctor.id);
      } else {
        console.warn("Cannot switch doctor - context function unavailable");
        setCurrentDoctor(doctor);
      }
    } catch (error) {
      console.error("Error switching doctor:", error);
      setCurrentDoctor(doctor);
    }
    handleDoctorMenuClose();
  };
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          bgcolor: 'white',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.05)',
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          height: '100vh',
          zIndex: 10,
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.05)',
            },
            transition: 'all 0.2s ease',
          }}
          onClick={handleDoctorMenuOpen}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={currentDoctor.avatar}
              sx={{
                bgcolor: !currentDoctor.avatar ? theme.palette.primary.main : 'transparent',
                width: 50,
                height: 50,
                mr: 2,
                border: '2px solid rgba(25, 118, 210, 0.3)',
              }}
            >
              {!currentDoctor.avatar && <DoctorIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">{currentDoctor.name}</Typography>
              <Typography variant="body2" color="text.secondary">{currentDoctor.specialty}</Typography>
            </Box>
          </Box>
          <ArrowDownIcon 
            color="action" 
            sx={{ 
              transition: 'transform 0.2s',
              transform: doctorMenuAnchor ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
        </Box>
        
        {/* Doctor Selection Menu */}
        <Menu
          anchorEl={doctorMenuAnchor}
          open={Boolean(doctorMenuAnchor)}
          onClose={handleDoctorMenuClose}
          sx={{ 
            mt: 1.5,
            '& .MuiPaper-root': {
              borderRadius: 2,
              minWidth: 250,
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
            }
          }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Switch Doctor Profile
            </Typography>
          </Box>
          <Divider />
          {availableDoctors.map((doctor) => (
            <MenuItem 
              key={doctor.id} 
              onClick={() => handleSwitchDoctor(doctor)}
              selected={doctor.id === currentDoctor.id}
              sx={{ 
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.15)',
                  }
                }
              }}
            >
              <ListItemIcon>
                <Avatar 
                  src={doctor.avatar} 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: !doctor.avatar ? theme.palette.primary.main : 'transparent'
                  }}
                >
                  {!doctor.avatar && <DoctorIcon fontSize="small" />}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={doctor.name} 
                secondary={doctor.specialty}
                primaryTypographyProps={{ fontWeight: doctor.id === currentDoctor.id ? 'bold' : 'normal' }}
              />
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleDoctorMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <ProfileIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </MenuItem>
          <MenuItem onClick={handleDoctorMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Add New Doctor Profile" />
          </MenuItem>
        </Menu>
        
        <List component="nav" sx={{ pt: 2 }}>
          <ListItem 
            button 
            selected={location.pathname === '/doctor' || location.pathname === '/doctor/dashboard'} 
            onClick={() => navigate('/doctor/dashboard')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <DashboardIcon sx={{ mr: 2, color: location.pathname === '/doctor' || location.pathname === '/doctor/dashboard' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button 
            selected={location.pathname === '/doctor/patients'}
            onClick={() => navigate('/doctor/patients')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <PatientsIcon sx={{ mr: 2, color: location.pathname === '/doctor/patients' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText primary="Patients" />
          </ListItem>
          <ListItem 
            button 
            selected={location.pathname === '/doctor/appointments'}
            onClick={() => navigate('/doctor/appointments')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <AppointmentsIcon sx={{ mr: 2, color: location.pathname === '/doctor/appointments' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText primary="Appointments" />
          </ListItem>
          <ListItem 
            button 
            selected={location.pathname === '/doctor/analysis'}
            onClick={() => navigate('/doctor/analysis')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <AnalyticsIcon sx={{ mr: 2, color: location.pathname === '/doctor/analysis' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText primary="Analysis" />
          </ListItem>
          <ListItem 
            button 
            selected={location.pathname === '/doctor/messages'}
            onClick={() => navigate('/doctor/messages')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <MessageIcon sx={{ mr: 2, color: location.pathname === '/doctor/messages' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Messages</Typography>
                  <Chip size="small" label="4" sx={{ bgcolor: theme.palette.primary.main, color: '#ffffff', height: 20, width: 20, fontSize: '0.75rem' }} />
                </Box>
              }
            />
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2, mx: 2 }} />
        
        <List component="nav">
          <ListItem 
            button 
            selected={location.pathname === '/doctor/settings'}
            onClick={() => navigate('/doctor/settings')}
            sx={{ mb: 1, borderRadius: 1, mx: 1 }}
          >
            <SettingsIcon sx={{ mr: 2, color: location.pathname === '/doctor/settings' ? theme.palette.primary.main : theme.palette.text.secondary }} />
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              mb: 1, 
              borderRadius: 1, 
              mx: 1,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.1)',
              }
            }}
          >
            <LogoutIcon sx={{ mr: 2, color: theme.palette.error.main }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pl: { md: '280px' }, 
          width: { xs: '100%', md: `calc(100% - 280px)` }, 
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            bgcolor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {location.pathname.includes('/patients') ? 'Patients' : 
             location.pathname.includes('/appointments') ? 'Appointments' : 
             location.pathname.includes('/analysis') ? 'Analysis' : 
             location.pathname.includes('/messages') ? 'Messages' : 
             location.pathname.includes('/settings') ? 'Settings' : 
             'Doctor Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>
        
        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
};

export default DoctorLayout; 