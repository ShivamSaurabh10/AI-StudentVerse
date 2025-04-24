import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Fade,
  Zoom,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  PersonAdd,
  Google as GoogleIcon,
  LockOutlined as LockIcon,
  Email as EmailIcon,
  MedicalServices as DoctorIcon,
  Person as PatientIcon,
} from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { keyframes } from '@mui/system';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -80vw 0; }
  100% { background-position: 80vw 0; }
`;

// Bubble component for background decoration
const Bubble = ({ size, top, left, delay, opacity }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}40, ${theme.palette.secondary.light}30)`,
        opacity: opacity || 0.4,
        top: `${top}%`,
        left: `${left}%`,
        animation: `${float} ${5 + delay}s ease-in-out ${delay}s infinite`,
        zIndex: 0,
        backdropFilter: 'blur(3px)',
      }}
    />
  );
};

// BubbleContainer for background effects
const BubbleContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const bubbles = Array.from({ length: isMobile ? 5 : 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.2 + 0.1,
  }));
  
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          size={bubble.size}
          top={bubble.top}
          left={bubble.left}
          delay={bubble.delay}
          opacity={bubble.opacity}
        />
      ))}
    </Box>
  );
};

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
      // Reset form when switching user types
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    // Firebase email/password registration
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(`${userType} registered:`, user);
        
        // Redirect based on user type
        if (userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        setError(getErrorMessage(error.code));
        setIsLoading(false);
      });
  };

  const handleGoogleSignup = () => {
    setError('');
    setIsLoading(true);
    
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info
        const user = result.user;
        console.log(`Google ${userType} sign-up successful:`, user);
        
        // Redirect based on user type
        if (userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Google signup error:', error);
        setError(getErrorMessage(error.code));
        setIsLoading(false);
      });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      case 'auth/popup-closed-by-user':
        return 'Google sign-up process was cancelled';
      default:
        return 'An error occurred during sign-up';
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
        overflow: 'hidden',
      }}
    >
      <BubbleContainer />
      
      <Container component="main" maxWidth="xs" sx={{ zIndex: 1 }}>
        <Zoom in={true} timeout={800}>
          <Paper
            elevation={5}
            sx={{
              my: 8,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
              borderRadius: 2,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              },
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2,
              }}
            >
              <IconButton
                onClick={() => navigate('/')}
                sx={{ p: 0, mr: 1 }}
                aria-label="back to home"
              >
                <ArrowBack />
              </IconButton>
            </Box>
            
            <Avatar
              sx={{
                m: 1,
                bgcolor: theme.palette.secondary.main,
                width: 56,
                height: 56,
                boxShadow: 2,
                animation: `${pulse} 3s infinite ease-in-out`,
              }}
            >
              <LockIcon />
            </Avatar>
            
            <Typography component="h1" variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
              Create Account
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
              Join our healthcare platform to monitor and improve your well-being
            </Typography>
            
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              aria-label="user type"
              sx={{
                mb: 3,
                width: '100%',
                '& .MuiToggleButtonGroup-grouped': {
                  border: 1,
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    },
                  },
                },
              }}
            >
              <ToggleButton
                value="patient"
                aria-label="patient"
                sx={{ 
                  width: '50%',
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <PatientIcon />
                <Typography variant="body2">Patient</Typography>
              </ToggleButton>
              <ToggleButton
                value="doctor"
                aria-label="doctor"
                sx={{ 
                  width: '50%',
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <DoctorIcon />
                <Typography variant="body2">Doctor</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                    animation: `${shimmer} 2s infinite`,
                    transform: 'skewX(-20deg)',
                  },
                }}
                disabled={isLoading}
                startIcon={<PersonAdd />}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>
              
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                startIcon={<GoogleIcon />}
                sx={{ mb: 2, py: 1.2 }}
              >
                Sign up with Google
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <Link href="/login" variant="body2" sx={{ color: theme.palette.primary.main }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default SignupPage; 