import React, { useState, createContext } from 'react';
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
  ListItemIcon,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';

// Create theme context
export const ThemeContext = createContext();

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

const Settings = () => {
  const location = useLocation();
  const isInDoctorRoute = location.pathname.startsWith('/doctor');
  
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Theme settings
  const [themeMode, setThemeMode] = useState('light');
  const [colorScheme, setColorScheme] = useState(theme.palette.primary.main);
  
  // Available color schemes
  const colorSchemes = [
    { name: 'Default', value: theme.palette.primary.main },
    { name: 'Blue', value: '#2196f3' },
    { name: 'Green', value: '#4caf50' },
    { name: 'Red', value: '#f44336' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Purple', value: '#9c27b0' },
  ];
  
  // Create a custom theme based on current settings
  const customTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: colorScheme,
      },
    },
  });
  
  // Sample user data
  const user = {
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Psychologist',
    address: '123 Medical Center Dr, Suite 456, San Francisco, CA 94143',
    bio: 'Board-certified psychologist with over 10 years of experience specializing in cognitive behavioral therapy, anxiety disorders, and depression treatment. Committed to providing compassionate care and evidence-based treatments tailored to each patient\'s unique needs.',
    avatar: '/avatar-doctor.jpg',
    notificationSettings: {
      email: true,
      sms: true,
      app: true,
      remindersBefore: 24, // hours
    },
    privacySettings: {
      profileVisibility: 'all', // 'all', 'patients', 'none'
      showContactInfo: true,
      allowReviews: true,
    },
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleThemeModeChange = (mode) => {
    setThemeMode(mode);
    // In a real app, this would save to local storage or user preferences in database
    localStorage.setItem('themeMode', mode);
  };
  
  const handleColorSchemeChange = (color) => {
    setColorScheme(color);
    // In a real app, this would save to local storage or user preferences in database
    localStorage.setItem('colorScheme', color);
  };
  
  const applyThemeChanges = () => {
    // This would trigger a global theme change in a real app
    // Show success message to user
    alert('Theme settings applied successfully!');
  };

  return (
    <ThemeProvider theme={customTheme}>
      {isInDoctorRoute ? (
        <DoctorLayout>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>Settings</Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your account preferences and settings
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {/* Left Column - Tabs Navigation */}
              <Grid item xs={12} md={3}>
                <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
                  <List component="nav">
                    <ListItem 
                      button 
                      selected={tabValue === 0}
                      onClick={(e) => handleTabChange(e, 0)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon>
                        <PersonIcon color={tabValue === 0 ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Profile Information" 
                        primaryTypographyProps={{ 
                          fontWeight: tabValue === 0 ? 'bold' : 'regular',
                          color: tabValue === 0 ? 'primary' : 'inherit'
                        }} 
                      />
                    </ListItem>
                    <ListItem 
                      button 
                      selected={tabValue === 1}
                      onClick={(e) => handleTabChange(e, 1)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon>
                        <SecurityIcon color={tabValue === 1 ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Security" 
                        primaryTypographyProps={{ 
                          fontWeight: tabValue === 1 ? 'bold' : 'regular',
                          color: tabValue === 1 ? 'primary' : 'inherit'
                        }}  
                      />
                    </ListItem>
                    <ListItem 
                      button 
                      selected={tabValue === 2}
                      onClick={(e) => handleTabChange(e, 2)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon>
                        <NotificationsIcon color={tabValue === 2 ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Notifications" 
                        primaryTypographyProps={{ 
                          fontWeight: tabValue === 2 ? 'bold' : 'regular',
                          color: tabValue === 2 ? 'primary' : 'inherit'
                        }}  
                      />
                    </ListItem>
                    <ListItem 
                      button 
                      selected={tabValue === 3}
                      onClick={(e) => handleTabChange(e, 3)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon>
                        <PaletteIcon color={tabValue === 3 ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Appearance" 
                        primaryTypographyProps={{ 
                          fontWeight: tabValue === 3 ? 'bold' : 'regular',
                          color: tabValue === 3 ? 'primary' : 'inherit'
                        }}  
                      />
                    </ListItem>
                    <ListItem 
                      button 
                      selected={tabValue === 4}
                      onClick={(e) => handleTabChange(e, 4)}
                      sx={{ py: 2 }}
                    >
                      <ListItemIcon>
                        <PublicIcon color={tabValue === 4 ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Privacy" 
                        primaryTypographyProps={{ 
                          fontWeight: tabValue === 4 ? 'bold' : 'regular',
                          color: tabValue === 4 ? 'primary' : 'inherit'
                        }}  
                      />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
              
              {/* Right Column - Settings Content */}
              <Grid item xs={12} md={9}>
                <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
                  <CardContent sx={{ p: 0 }}>
                    <TabPanel value={tabValue} index={0}>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Profile Information</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Update your personal information and profile details
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' }, 
                          alignItems: { xs: 'center', sm: 'flex-start' },
                          mb: 4,
                          mt: 3
                        }}>
                          <Box sx={{ position: 'relative', mb: { xs: 3, sm: 0 }, mr: { sm: 4 } }}>
                            <Avatar 
                              src={user.avatar} 
                              alt={user.name}
                              sx={{ width: 100, height: 100 }}
                            />
                            <IconButton 
                              sx={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0, 
                                bgcolor: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                '&:hover': {
                                  bgcolor: 'white',
                                }
                              }}
                            >
                              <CameraIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body1" fontWeight="medium" gutterBottom>
                              Profile Photo
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              This photo will be displayed on your profile and visible to patients
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                sx={{ borderRadius: 2 }}
                              >
                                Delete Photo
                              </Button>
                              <Button 
                                variant="contained" 
                                size="small"
                                sx={{ borderRadius: 2 }}
                              >
                                Upload New
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              variant="outlined"
                              defaultValue={user.name}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Specialization"
                              variant="outlined"
                              defaultValue={user.specialization}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email"
                              variant="outlined"
                              defaultValue={user.email}
                              InputProps={{
                                startAdornment: (
                                  <EmailIcon color="action" sx={{ mr: 1 }} />
                                ),
                              }}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              variant="outlined"
                              defaultValue={user.phone}
                              InputProps={{
                                startAdornment: (
                                  <PhoneIcon color="action" sx={{ mr: 1 }} />
                                ),
                              }}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              variant="outlined"
                              defaultValue={user.address}
                              InputProps={{
                                startAdornment: (
                                  <LocationIcon color="action" sx={{ mr: 1 }} />
                                ),
                              }}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Professional Bio"
                              variant="outlined"
                              defaultValue={user.bio}
                              multiline
                              rows={4}
                              InputProps={{
                                startAdornment: (
                                  <AssignmentIcon color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                                ),
                              }}
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: 2, px: 4 }}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Security</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Manage your account security and authentication settings
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Change Password
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                variant="outlined"
                                sx={{ mb: 3 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                variant="outlined"
                                sx={{ mb: 3 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                sx={{ mb: 3 }}
                              />
                            </Grid>
                          </Grid>
                          
                          <Button 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: 2, px: 3, mt: 1 }}
                          >
                            Update Password
                          </Button>
                        </Box>
                        
                        <Divider sx={{ my: 4 }} />
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Two-Factor Authentication
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Add an extra layer of security to your account by enabling two-factor authentication
                          </Typography>
                          
                          <FormControlLabel 
                            control={<Switch />} 
                            label="Enable Two-Factor Authentication" 
                            sx={{ mb: 2 }}
                          />
                          
                          <Typography variant="body2" color="text.secondary">
                            When enabled, you'll be required to provide a verification code sent to your device when signing in.
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 4 }} />
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Sessions
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Manage your active sessions and sign out from other devices
                          </Typography>
                          
                          <Button 
                            variant="outlined" 
                            color="error"
                            sx={{ borderRadius: 2, mt: 1 }}
                          >
                            Sign Out From All Devices
                          </Button>
                        </Box>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={2}>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Notifications</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Configure how you receive notifications and alerts
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Notification Channels
                          </Typography>
                          
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Email Notifications" 
                                secondary="Receive appointment reminders and updates via email" 
                              />
                              <Switch defaultChecked={user.notificationSettings.email} />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="SMS Notifications" 
                                secondary="Receive appointment reminders and updates via text message" 
                              />
                              <Switch defaultChecked={user.notificationSettings.sms} />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="In-App Notifications" 
                                secondary="Receive notifications within the application" 
                              />
                              <Switch defaultChecked={user.notificationSettings.app} />
                            </ListItem>
                          </List>
                        </Box>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Notification Preferences
                          </Typography>
                          
                          <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel id="reminder-time-label">Appointment Reminders</InputLabel>
                                <Select
                                  labelId="reminder-time-label"
                                  label="Appointment Reminders"
                                  defaultValue={user.notificationSettings.remindersBefore}
                                >
                                  <MenuItem value={1}>1 hour before</MenuItem>
                                  <MenuItem value={2}>2 hours before</MenuItem>
                                  <MenuItem value={12}>12 hours before</MenuItem>
                                  <MenuItem value={24}>24 hours before</MenuItem>
                                  <MenuItem value={48}>2 days before</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Notification Types
                            </Typography>
                            
                            <List>
                              <ListItem>
                                <ListItemText 
                                  primary="New Appointments" 
                                  secondary="Get notified when a new appointment is scheduled" 
                                />
                                <Switch defaultChecked />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Appointment Changes" 
                                  secondary="Get notified when an appointment is modified or cancelled" 
                                />
                                <Switch defaultChecked />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Patient Messages" 
                                  secondary="Get notified when you receive a new message from a patient" 
                                />
                                <Switch defaultChecked />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="System Updates" 
                                  secondary="Get notified about system maintenance and updates" 
                                />
                                <Switch defaultChecked />
                              </ListItem>
                            </List>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: 2, px: 4 }}
                          >
                            Save Preferences
                          </Button>
                        </Box>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={3}>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Appearance</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Customize the look and feel of your dashboard
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Theme Mode
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                width: 150, 
                                height: 100, 
                                borderRadius: 2,
                                border: themeMode === 'light' ? `2px solid ${customTheme.palette.primary.main}` : `1px solid rgba(0, 0, 0, 0.12)`,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                              }}
                              onClick={() => handleThemeModeChange('light')}
                            >
                              {themeMode === 'light' && (
                                <Box sx={{ 
                                  position: 'absolute', 
                                  top: -10, 
                                  right: -10, 
                                  bgcolor: customTheme.palette.primary.main,
                                  borderRadius: '50%',
                                  width: 24,
                                  height: 24,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                                </Box>
                              )}
                              <Box sx={{ bgcolor: '#ffffff', width: '80%', height: '60%', mb: 1, borderRadius: 1 }} />
                              <Typography variant="body2" fontWeight="medium">Light</Typography>
                            </Card>
                            
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                width: 150, 
                                height: 100, 
                                borderRadius: 2,
                                border: themeMode === 'dark' ? `2px solid ${customTheme.palette.primary.main}` : `1px solid rgba(0, 0, 0, 0.12)`,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#333',
                                position: 'relative',
                              }}
                              onClick={() => handleThemeModeChange('dark')}
                            >
                              {themeMode === 'dark' && (
                                <Box sx={{ 
                                  position: 'absolute', 
                                  top: -10, 
                                  right: -10, 
                                  bgcolor: customTheme.palette.primary.main,
                                  borderRadius: '50%',
                                  width: 24,
                                  height: 24,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                                </Box>
                              )}
                              <Box sx={{ bgcolor: '#555', width: '80%', height: '60%', mb: 1, borderRadius: 1 }} />
                              <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>Dark</Typography>
                            </Card>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 4 }} />
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Color Scheme
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                            {colorSchemes.map((scheme) => (
                              <Box 
                                key={scheme.value}
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: '50%', 
                                  bgcolor: scheme.value,
                                  border: colorScheme === scheme.value ? `2px solid ${scheme.value}` : `1px solid rgba(0, 0, 0, 0.12)`,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  '&:hover': {
                                    boxShadow: `0 0 0 4px rgba(${parseInt(scheme.value.slice(1, 3), 16)}, ${parseInt(scheme.value.slice(3, 5), 16)}, ${parseInt(scheme.value.slice(5, 7), 16)}, 0.2)`,
                                  },
                                  boxShadow: colorScheme === scheme.value ? `0 0 0 2px rgba(${parseInt(scheme.value.slice(1, 3), 16)}, ${parseInt(scheme.value.slice(3, 5), 16)}, ${parseInt(scheme.value.slice(5, 7), 16)}, 0.5)` : 'none',
                                }}
                                onClick={() => handleColorSchemeChange(scheme.value)}
                              >
                                {colorScheme === scheme.value && (
                                  <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Preview
                          </Typography>
                          <Card sx={{ 
                            p: 2, 
                            bgcolor: themeMode === 'dark' ? '#333' : '#ffffff',
                            color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                            border: `1px solid ${themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)'}`
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box 
                                sx={{ 
                                  width: 50, 
                                  height: 50, 
                                  borderRadius: '50%', 
                                  bgcolor: colorScheme,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <PersonIcon sx={{ color: '#ffffff' }} />
                              </Box>
                              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#ffffff' : 'inherit' }}>
                                Theme Preview
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                              This is how your selected theme will look
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                              <Button 
                                variant="contained" 
                                size="small" 
                                sx={{ 
                                  bgcolor: colorScheme,
                                  '&:hover': {
                                    bgcolor: `rgba(${parseInt(colorScheme.slice(1, 3), 16)}, ${parseInt(colorScheme.slice(3, 5), 16)}, ${parseInt(colorScheme.slice(5, 7), 16)}, 0.8)`
                                  }
                                }}
                              >
                                Primary Button
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                sx={{ 
                                  borderColor: colorScheme,
                                  color: colorScheme
                                }}
                              >
                                Secondary Button
                              </Button>
                            </Box>
                          </Card>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: 2, px: 4 }}
                            onClick={applyThemeChanges}
                          >
                            Apply Changes
                          </Button>
                        </Box>
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={4}>
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Privacy Settings</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Control who can see your information and how it's used
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Profile Visibility
                          </Typography>
                          
                          <FormControl fullWidth variant="outlined" sx={{ mb: 3, mt: 1 }}>
                            <InputLabel id="profile-visibility-label">Who can see my profile</InputLabel>
                            <Select
                              labelId="profile-visibility-label"
                              label="Who can see my profile"
                              defaultValue={user.privacySettings.profileVisibility}
                            >
                              <MenuItem value="all">Everyone</MenuItem>
                              <MenuItem value="patients">My Patients Only</MenuItem>
                              <MenuItem value="none">Private (Admin Only)</MenuItem>
                            </Select>
                          </FormControl>
                          
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Show Contact Information" 
                                secondary="Make your email and phone number visible on your profile" 
                              />
                              <Switch defaultChecked={user.privacySettings.showContactInfo} />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Allow Patient Reviews" 
                                secondary="Let patients leave reviews and ratings on your profile" 
                              />
                              <Switch defaultChecked={user.privacySettings.allowReviews} />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Share Availability Status" 
                                secondary="Show your online/offline status to patients" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                          </List>
                        </Box>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                            Data Privacy
                          </Typography>
                          
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Usage Analytics" 
                                secondary="Allow system to collect anonymous usage data to improve services" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Third-Party Integration" 
                                secondary="Allow integration with third-party services like calendars" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                          </List>
                          
                          <Box sx={{ mt: 2 }}>
                            <Button 
                              variant="outlined" 
                              color="primary"
                              sx={{ borderRadius: 2, mr: 2 }}
                            >
                              Download My Data
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error"
                              sx={{ borderRadius: 2 }}
                            >
                              Delete Account
                            </Button>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: 2, px: 4 }}
                          >
                            Save Privacy Settings
                          </Button>
                        </Box>
                      </Box>
                    </TabPanel>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </DoctorLayout>
      ) : (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Settings</Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account preferences and settings
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Left Column - Tabs Navigation */}
            <Grid item xs={12} md={3}>
              <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
                <List component="nav">
                  <ListItem 
                    button 
                    selected={tabValue === 0}
                    onClick={(e) => handleTabChange(e, 0)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <PersonIcon color={tabValue === 0 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Profile Information" 
                      primaryTypographyProps={{ 
                        fontWeight: tabValue === 0 ? 'bold' : 'regular',
                        color: tabValue === 0 ? 'primary' : 'inherit'
                      }} 
                    />
                  </ListItem>
                  <ListItem 
                    button 
                    selected={tabValue === 1}
                    onClick={(e) => handleTabChange(e, 1)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <SecurityIcon color={tabValue === 1 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Security" 
                      primaryTypographyProps={{ 
                        fontWeight: tabValue === 1 ? 'bold' : 'regular',
                        color: tabValue === 1 ? 'primary' : 'inherit'
                      }}  
                    />
                  </ListItem>
                  <ListItem 
                    button 
                    selected={tabValue === 2}
                    onClick={(e) => handleTabChange(e, 2)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon color={tabValue === 2 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Notifications" 
                      primaryTypographyProps={{ 
                        fontWeight: tabValue === 2 ? 'bold' : 'regular',
                        color: tabValue === 2 ? 'primary' : 'inherit'
                      }}  
                    />
                  </ListItem>
                  <ListItem 
                    button 
                    selected={tabValue === 3}
                    onClick={(e) => handleTabChange(e, 3)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <PaletteIcon color={tabValue === 3 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Appearance" 
                      primaryTypographyProps={{ 
                        fontWeight: tabValue === 3 ? 'bold' : 'regular',
                        color: tabValue === 3 ? 'primary' : 'inherit'
                      }}  
                    />
                  </ListItem>
                  <ListItem 
                    button 
                    selected={tabValue === 4}
                    onClick={(e) => handleTabChange(e, 4)}
                    sx={{ py: 2 }}
                  >
                    <ListItemIcon>
                      <PublicIcon color={tabValue === 4 ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Privacy" 
                      primaryTypographyProps={{ 
                        fontWeight: tabValue === 4 ? 'bold' : 'regular',
                        color: tabValue === 4 ? 'primary' : 'inherit'
                      }}  
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            
            {/* Right Column - Settings Content */}
            <Grid item xs={12} md={9}>
              <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <TabPanel value={tabValue} index={0}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Profile Information</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Update your personal information and profile details
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        mb: 4,
                        mt: 3
                      }}>
                        <Box sx={{ position: 'relative', mb: { xs: 3, sm: 0 }, mr: { sm: 4 } }}>
                          <Avatar 
                            src={user.avatar} 
                            alt={user.name}
                            sx={{ width: 100, height: 100 }}
                          />
                          <IconButton 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              right: 0, 
                              bgcolor: 'white',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                              '&:hover': {
                                bgcolor: 'white',
                              }
                            }}
                          >
                            <CameraIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body1" fontWeight="medium" gutterBottom>
                            Profile Photo
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            This photo will be displayed on your profile and visible to patients
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              sx={{ borderRadius: 2 }}
                            >
                              Delete Photo
                            </Button>
                            <Button 
                              variant="contained" 
                              size="small"
                              sx={{ borderRadius: 2 }}
                            >
                              Upload New
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            defaultValue={user.name}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Specialization"
                            variant="outlined"
                            defaultValue={user.specialization}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            defaultValue={user.email}
                            InputProps={{
                              startAdornment: (
                                <EmailIcon color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            defaultValue={user.phone}
                            InputProps={{
                              startAdornment: (
                                <PhoneIcon color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            variant="outlined"
                            defaultValue={user.address}
                            InputProps={{
                              startAdornment: (
                                <LocationIcon color="action" sx={{ mr: 1 }} />
                              ),
                            }}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Professional Bio"
                            variant="outlined"
                            defaultValue={user.bio}
                            multiline
                            rows={4}
                            InputProps={{
                              startAdornment: (
                                <AssignmentIcon color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                              ),
                            }}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ borderRadius: 2, px: 4 }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Security</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Manage your account security and authentication settings
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Change Password
                        </Typography>
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Current Password"
                              type="password"
                              variant="outlined"
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="New Password"
                              type="password"
                              variant="outlined"
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Confirm New Password"
                              type="password"
                              variant="outlined"
                              sx={{ mb: 3 }}
                            />
                          </Grid>
                        </Grid>
                        
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ borderRadius: 2, px: 3, mt: 1 }}
                        >
                          Update Password
                        </Button>
                      </Box>
                      
                      <Divider sx={{ my: 4 }} />
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Two-Factor Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Add an extra layer of security to your account by enabling two-factor authentication
                        </Typography>
                        
                        <FormControlLabel 
                          control={<Switch />} 
                          label="Enable Two-Factor Authentication" 
                          sx={{ mb: 2 }}
                        />
                        
                        <Typography variant="body2" color="text.secondary">
                          When enabled, you'll be required to provide a verification code sent to your device when signing in.
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 4 }} />
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Sessions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Manage your active sessions and sign out from other devices
                        </Typography>
                        
                        <Button 
                          variant="outlined" 
                          color="error"
                          sx={{ borderRadius: 2, mt: 1 }}
                        >
                          Sign Out From All Devices
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={2}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Notifications</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Configure how you receive notifications and alerts
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Notification Channels
                        </Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Email Notifications" 
                              secondary="Receive appointment reminders and updates via email" 
                            />
                            <Switch defaultChecked={user.notificationSettings.email} />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="SMS Notifications" 
                              secondary="Receive appointment reminders and updates via text message" 
                            />
                            <Switch defaultChecked={user.notificationSettings.sms} />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="In-App Notifications" 
                              secondary="Receive notifications within the application" 
                            />
                            <Switch defaultChecked={user.notificationSettings.app} />
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Notification Preferences
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel id="reminder-time-label">Appointment Reminders</InputLabel>
                              <Select
                                labelId="reminder-time-label"
                                label="Appointment Reminders"
                                defaultValue={user.notificationSettings.remindersBefore}
                              >
                                <MenuItem value={1}>1 hour before</MenuItem>
                                <MenuItem value={2}>2 hours before</MenuItem>
                                <MenuItem value={12}>12 hours before</MenuItem>
                                <MenuItem value={24}>24 hours before</MenuItem>
                                <MenuItem value={48}>2 days before</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Notification Types
                          </Typography>
                          
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="New Appointments" 
                                secondary="Get notified when a new appointment is scheduled" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Appointment Changes" 
                                secondary="Get notified when an appointment is modified or cancelled" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Patient Messages" 
                                secondary="Get notified when you receive a new message from a patient" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="System Updates" 
                                secondary="Get notified about system maintenance and updates" 
                              />
                              <Switch defaultChecked />
                            </ListItem>
                          </List>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ borderRadius: 2, px: 4 }}
                        >
                          Save Preferences
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={3}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Appearance</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Customize the look and feel of your dashboard
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Theme Mode
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              width: 150, 
                              height: 100, 
                              borderRadius: 2,
                              border: themeMode === 'light' ? `2px solid ${customTheme.palette.primary.main}` : `1px solid rgba(0, 0, 0, 0.12)`,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                            onClick={() => handleThemeModeChange('light')}
                          >
                            {themeMode === 'light' && (
                              <Box sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: -10, 
                                bgcolor: customTheme.palette.primary.main,
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                              </Box>
                            )}
                            <Box sx={{ bgcolor: '#ffffff', width: '80%', height: '60%', mb: 1, borderRadius: 1 }} />
                            <Typography variant="body2" fontWeight="medium">Light</Typography>
                          </Card>
                          
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              width: 150, 
                              height: 100, 
                              borderRadius: 2,
                              border: themeMode === 'dark' ? `2px solid ${customTheme.palette.primary.main}` : `1px solid rgba(0, 0, 0, 0.12)`,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#333',
                              position: 'relative',
                            }}
                            onClick={() => handleThemeModeChange('dark')}
                          >
                            {themeMode === 'dark' && (
                              <Box sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: -10, 
                                bgcolor: customTheme.palette.primary.main,
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                              </Box>
                            )}
                            <Box sx={{ bgcolor: '#555', width: '80%', height: '60%', mb: 1, borderRadius: 1 }} />
                            <Typography variant="body2" fontWeight="medium" sx={{ color: '#ffffff' }}>Dark</Typography>
                          </Card>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 4 }} />
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Color Scheme
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                          {colorSchemes.map((scheme) => (
                            <Box 
                              key={scheme.value}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                bgcolor: scheme.value,
                                border: colorScheme === scheme.value ? `2px solid ${scheme.value}` : `1px solid rgba(0, 0, 0, 0.12)`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                '&:hover': {
                                  boxShadow: `0 0 0 4px rgba(${parseInt(scheme.value.slice(1, 3), 16)}, ${parseInt(scheme.value.slice(3, 5), 16)}, ${parseInt(scheme.value.slice(5, 7), 16)}, 0.2)`,
                                },
                                boxShadow: colorScheme === scheme.value ? `0 0 0 2px rgba(${parseInt(scheme.value.slice(1, 3), 16)}, ${parseInt(scheme.value.slice(3, 5), 16)}, ${parseInt(scheme.value.slice(5, 7), 16)}, 0.5)` : 'none',
                              }}
                              onClick={() => handleColorSchemeChange(scheme.value)}
                            >
                              {colorScheme === scheme.value && (
                                <CheckIcon sx={{ color: '#ffffff', fontSize: 16 }} />
                              )}
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Preview
                        </Typography>
                        <Card sx={{ 
                          p: 2, 
                          bgcolor: themeMode === 'dark' ? '#333' : '#ffffff',
                          color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                          border: `1px solid ${themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)'}`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box 
                              sx={{ 
                                width: 50, 
                                height: 50, 
                                borderRadius: '50%', 
                                bgcolor: colorScheme,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <PersonIcon sx={{ color: '#ffffff' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#ffffff' : 'inherit' }}>
                              Theme Preview
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                            This is how your selected theme will look
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button 
                              variant="contained" 
                              size="small" 
                              sx={{ 
                                bgcolor: colorScheme,
                                '&:hover': {
                                  bgcolor: `rgba(${parseInt(colorScheme.slice(1, 3), 16)}, ${parseInt(colorScheme.slice(3, 5), 16)}, ${parseInt(colorScheme.slice(5, 7), 16)}, 0.8)`
                                }
                              }}
                            >
                              Primary Button
                            </Button>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                borderColor: colorScheme,
                                color: colorScheme
                              }}
                            >
                              Secondary Button
                            </Button>
                          </Box>
                        </Card>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ borderRadius: 2, px: 4 }}
                          onClick={applyThemeChanges}
                        >
                          Apply Changes
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel value={tabValue} index={4}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Privacy Settings</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Control who can see your information and how it's used
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Profile Visibility
                        </Typography>
                        
                        <FormControl fullWidth variant="outlined" sx={{ mb: 3, mt: 1 }}>
                          <InputLabel id="profile-visibility-label">Who can see my profile</InputLabel>
                          <Select
                            labelId="profile-visibility-label"
                            label="Who can see my profile"
                            defaultValue={user.privacySettings.profileVisibility}
                          >
                            <MenuItem value="all">Everyone</MenuItem>
                            <MenuItem value="patients">My Patients Only</MenuItem>
                            <MenuItem value="none">Private (Admin Only)</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Show Contact Information" 
                              secondary="Make your email and phone number visible on your profile" 
                            />
                            <Switch defaultChecked={user.privacySettings.showContactInfo} />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Allow Patient Reviews" 
                              secondary="Let patients leave reviews and ratings on your profile" 
                            />
                            <Switch defaultChecked={user.privacySettings.allowReviews} />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Share Availability Status" 
                              secondary="Show your online/offline status to patients" 
                            />
                            <Switch defaultChecked />
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          Data Privacy
                        </Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Usage Analytics" 
                              secondary="Allow system to collect anonymous usage data to improve services" 
                            />
                            <Switch defaultChecked />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Third-Party Integration" 
                              secondary="Allow integration with third-party services like calendars" 
                            />
                            <Switch defaultChecked />
                          </ListItem>
                        </List>
                        
                        <Box sx={{ mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            color="primary"
                            sx={{ borderRadius: 2, mr: 2 }}
                          >
                            Download My Data
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error"
                            sx={{ borderRadius: 2 }}
                          >
                            Delete Account
                          </Button>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ borderRadius: 2, px: 4 }}
                        >
                          Save Privacy Settings
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default Settings;