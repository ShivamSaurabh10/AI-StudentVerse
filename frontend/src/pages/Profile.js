import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedUserIcon,
  Cake as CakeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { auth } from '../firebase';

// Create keyframes for animations
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(66, 135, 245, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(66, 135, 245, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(66, 135, 245, 0.5);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const breathe = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    boxShadow: `0 15px 50px ${alpha(theme.palette.primary.main, 0.3)}`,
    transform: 'translateY(-5px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const GlowingAvatar = styled(Avatar)(({ theme }) => ({
  width: 150, 
  height: 150, 
  margin: '0 auto', 
  marginBottom: theme.spacing(2),
  border: `4px solid ${alpha(theme.palette.primary.main, 0.7)}`,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
  animation: `${glow} 4s infinite ease-in-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.8)}`,
  }
}));

const FloatingIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  margin: theme.spacing(1),
  animation: `${float} 6s infinite ease-in-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'scale(1.1)',
  }
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
  borderRadius: theme.spacing(3),
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
  '&:active': {
    transform: 'translateY(1px) scale(0.98)',
  }
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  opacity: 0.05,
  backgroundImage: `radial-gradient(circle at 30% 20%, ${theme.palette.primary.light} 0%, transparent 50%), 
                    radial-gradient(circle at 70% 60%, ${theme.palette.secondary.light} 0%, transparent 50%)`,
  animation: `${breathe} 15s infinite ease-in-out`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    '&:hover': {
      boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
  },
  '& .MuiFilledInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
    }
  }
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  borderRadius: '50%',
  minWidth: '50px',
  width: '50px',
  height: '50px',
  padding: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-5px)',
    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
  }
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  boxShadow: `0 5px 20px ${alpha(theme.palette.common.black, 0.1)}`,
  color: theme.palette.text.primary,
}));

const BackgroundBubble = styled(Box)(({ theme, size, position, color }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha(color || theme.palette.primary.light, 0.2)}, ${alpha(color || theme.palette.primary.main, 0.3)})`,
  filter: 'blur(20px)',
  ...position,
  opacity: 0.5,
  zIndex: -1,
}));

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Effect to hide the Navbar when this component mounts
  useEffect(() => {
    // Find the navbar element and hide it
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }

    // Cleanup function to show the navbar again when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: currentUser.phoneNumber || '',
          bio: ''
        });
        setLoading(false);
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });

    // Add scroll listener for scroll-to-top button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would implement the logic to update the user profile
      // For example, using Firebase Auth or your backend API
      
      // Simulate success after a short delay
      setLoading(true);
      
      setTimeout(() => {
        setLoading(false);
        setEditMode(false);
        setNotification({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success'
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)}, ${alpha(theme.palette.background.default, 0.9)})`,
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ 
            color: theme.palette.primary.main,
            boxShadow: `0 0 20px ${theme.palette.primary.main}`,
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2, 
            fontWeight: 'light',
            animation: `${breathe} 2s infinite ease-in-out`
          }}
        >
          Loading your profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnimatedBackground />
      
      {/* Background bubbles for visual interest */}
      <BackgroundBubble 
        size="300px" 
        position={{ top: '10%', left: '5%' }} 
        color={theme.palette.primary.light}
      />
      <BackgroundBubble 
        size="250px" 
        position={{ bottom: '10%', right: '5%' }} 
        color={theme.palette.secondary.light}
      />
      
      {/* App Bar */}
      <GlassAppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={handleBackToDashboard} 
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Your Profile
          </Typography>
          <GlowingButton 
            color="primary" 
            startIcon={editMode ? <SaveIcon /> : <EditIcon />}
            onClick={editMode ? handleSaveProfile : handleEditToggle}
            variant="contained"
          >
            {editMode ? "Save" : "Edit Profile"}
          </GlowingButton>
        </Toolbar>
      </GlassAppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <StyledPaper>
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <GlowingAvatar
              alt={user.displayName || user.email}
              src={user.photoURL}
            >
              {!user.photoURL && <PersonIcon sx={{ fontSize: 80 }} />}
            </GlowingAvatar>
            
            {editMode && (
              <IconButton 
                color="primary" 
                component="label" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: '43%',
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(5px)',
                  boxShadow: `0 5px 15px ${alpha(theme.palette.common.black, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <input hidden type="file" accept="image/*" />
                <PhotoCameraIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              {user.displayName || user.email}
              {user.emailVerified && (
                <VerifiedUserIcon 
                  sx={{ 
                    ml: 1, 
                    color: theme.palette.success.main,
                    fontSize: '0.8em',
                    verticalAlign: 'middle',
                    animation: `${float} 3s infinite ease-in-out`,
                  }} 
                />
              )}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CakeIcon fontSize="small" />
              Member since {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
          
          <Divider 
            sx={{ 
              mb: 4, 
              '&::before, &::after': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }
            }} 
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                disabled={!editMode}
                margin="normal"
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <PersonIcon 
                      color="primary" 
                      sx={{ mr: 1, opacity: 0.7 }} 
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled={true}  // Email is usually not editable
                margin="normal"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <EmailIcon 
                      color="primary" 
                      sx={{ mr: 1, opacity: 0.7 }} 
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!editMode}
                margin="normal"
                variant={editMode ? "outlined" : "filled"}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon 
                      color="primary" 
                      sx={{ mr: 1, opacity: 0.7 }} 
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!editMode}
                margin="normal"
                multiline
                rows={4}
                variant={editMode ? "outlined" : "filled"}
                placeholder={editMode ? "Tell us about yourself..." : ""}
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon 
                      color="primary" 
                      sx={{ mr: 1, mt: 1, opacity: 0.7 }} 
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <FloatingIconBox>
              <IconButton color="primary">
                <PersonIcon />
              </IconButton>
            </FloatingIconBox>
            <FloatingIconBox sx={{ animationDelay: '1s' }}>
              <IconButton color="primary">
                <EmailIcon />
              </IconButton>
            </FloatingIconBox>
            <FloatingIconBox sx={{ animationDelay: '2s' }}>
              <IconButton color="primary">
                <PhoneIcon />
              </IconButton>
            </FloatingIconBox>
          </Box>
        </StyledPaper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            align="center"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            © {new Date().getFullYear()} Conversational Intelligence Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Scroll to top button */}
      {showScrollTop && (
        <FloatingActionButton 
          onClick={handleScrollToTop}
          aria-label="scroll to top"
        >
          <KeyboardArrowUpIcon />
        </FloatingActionButton>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            boxShadow: `0 5px 15px ${alpha(
              notification.severity === 'success' 
                ? theme.palette.success.main 
                : theme.palette.error.main, 
              0.3
            )}`,
            borderLeft: `5px solid ${
              notification.severity === 'success' 
                ? theme.palette.success.main 
                : theme.palette.error.main
            }`,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile; 