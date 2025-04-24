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
  Login as LoginIcon,
  Google as GoogleIcon,
  LockOutlined as LockIcon,
  Email as EmailIcon,
  MedicalServices as DoctorIcon,
  Person as PatientIcon,
} from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { keyframes } from '@mui/system';

// Enhanced animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 20px rgba(66, 165, 245, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(66, 165, 245, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 20px rgba(66, 165, 245, 0.4); }
`;

const shimmer = keyframes`
  0% { background-position: -80vw 0; }
  100% { background-position: 80vw 0; }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 6px rgba(66, 165, 245, 0.6)); }
  50% { filter: drop-shadow(0 0 14px rgba(66, 165, 245, 0.9)); }
  100% { filter: drop-shadow(0 0 6px rgba(66, 165, 245, 0.6)); }
`;

const borderGlow = keyframes`
  0% { border-color: rgba(66, 165, 245, 0.6); box-shadow: 0 0 10px rgba(66, 165, 245, 0.4), inset 0 0 10px rgba(66, 165, 245, 0.4); }
  50% { border-color: rgba(66, 165, 245, 0.9); box-shadow: 0 0 20px rgba(66, 165, 245, 0.7), inset 0 0 15px rgba(66, 165, 245, 0.5); }
  100% { border-color: rgba(66, 165, 245, 0.6); box-shadow: 0 0 10px rgba(66, 165, 245, 0.4), inset 0 0 10px rgba(66, 165, 245, 0.4); }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(66, 165, 245, 0.3), 0 0 10px rgba(66, 165, 245, 0.2); }
  50% { text-shadow: 0 0 10px rgba(66, 165, 245, 0.6), 0 0 20px rgba(66, 165, 245, 0.4); }
  100% { text-shadow: 0 0 5px rgba(66, 165, 245, 0.3), 0 0 10px rgba(66, 165, 245, 0.2); }
`;

// Enhanced Bubble component with glow effect
const Bubble = ({ size, top, left, delay, opacity }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 70%, transparent 100%)`,
        opacity: opacity || 0.6,
        top: `${top}%`,
        left: `${left}%`,
        animation: `${float} ${5 + delay}s ease-in-out ${delay}s infinite, ${glow} 3s infinite alternate`,
        zIndex: 0,
        boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.7)}`,
        filter: 'blur(2px)',
      }}
    />
  );
};

// BubbleContainer for background effects
const BubbleContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const bubbles = Array.from({ length: isMobile ? 8 : 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.3 + 0.2,
  }));
  
  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        pointerEvents: 'none', 
        zIndex: 0,
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 1,
        }
      }}
    >
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    // Firebase email/password authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(`${userType} signed in:`, user);
        
        // Redirect based on user type
        if (userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setError(getErrorMessage(error.code));
        setIsLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info
        const user = result.user;
        console.log(`Google ${userType} sign-in successful:`, user);
        
        // Redirect based on user type
        if (userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Google login error:', error);
        setError(getErrorMessage(error.code));
        setIsLoading(false);
      });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later';
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed before completing';
      case 'auth/cancelled-popup-request':
        return 'Login was cancelled';
      case 'auth/popup-blocked':
        return 'Login popup was blocked by your browser';
      default:
        return 'An error occurred during login. Please try again';
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, #040d21 0%, #0a2342 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BubbleContainer />
      
      {/* Header with back button */}
      <Box sx={{ 
        py: 2, 
        px: 3, 
        position: 'relative', 
        zIndex: 1,
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha('#0a1929', 0.3),
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}>
        <Button
          startIcon={<ArrowBack sx={{ color: theme.palette.primary.light }} />}
          onClick={() => navigate('/')}
          sx={{ 
            color: theme.palette.primary.light,
            borderRadius: 2,
            px: 2,
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateX(-3px)',
            },
            animation: `${glow} 3s infinite alternate`,
          }}
        >
          Back to Home
        </Button>
      </Box>

      {/* Main content */}
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 4, position: 'relative', zIndex: 1 }}>
        <Zoom in={true} timeout={800}>
          <Paper
            elevation={5}
            sx={{
              p: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 3,
              background: `rgba(13, 25, 54, 0.8)`,
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
              animation: `${borderGlow} 4s infinite ease-in-out`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 0 20px ${theme.palette.primary.main}`,
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.7)}`,
              },
            }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              mb: 4,
              position: 'relative',
            }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  margin: '0 auto 16px', 
                  backgroundColor: alpha(theme.palette.primary.main, 0.8),
                  animation: `${pulse} 3s infinite ease-in-out`,
                  boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.7)}`,
                }}
              >
                <LockIcon sx={{ fontSize: 40, color: '#fff' }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textGlow} 3s infinite alternate`,
                  letterSpacing: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  maxWidth: '80%',
                  margin: '0 auto',
                  color: alpha('#fff', 0.8),
                }}
              >
                Sign in to access your account and analyze conversations
              </Typography>
              
              {/* User Type Toggle */}
              <Box sx={{ mt: 4, mb: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ mb: 1, fontWeight: 500, color: alpha('#fff', 0.8) }}
                >
                  Select your role
                </Typography>
                <ToggleButtonGroup
                  value={userType}
                  exclusive
                  onChange={handleUserTypeChange}
                  aria-label="user type"
                  sx={{
                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    borderRadius: 3,
                    width: '100%',
                    maxWidth: 350,
                    margin: '0 auto',
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 0,
                      flex: 1,
                      '&:not(:first-of-type)': {
                        borderRadius: 0,
                        borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                      '&:first-of-type': {
                        borderRadius: '24px 0 0 24px',
                      },
                      '&:last-of-type': {
                        borderRadius: '0 24px 24px 0',
                      },
                    },
                  }}
                >
                  <ToggleButton 
                    value="patient" 
                    aria-label="patient"
                    sx={{
                      py: 1.5,
                      transition: 'all 0.3s ease',
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                      color: alpha('#fff', 0.7),
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                        color: '#fff',
                        boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)} inset`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.4),
                        },
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <PatientIcon sx={{ mr: 1 }} />
                    Patient
                  </ToggleButton>
                  <ToggleButton 
                    value="doctor" 
                    aria-label="doctor"
                    sx={{
                      py: 1.5,
                      transition: 'all 0.3s ease',
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                      color: alpha('#fff', 0.7),
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.3),
                        color: '#fff',
                        boxShadow: `0 0 15px ${alpha(theme.palette.secondary.main, 0.5)} inset`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.4),
                        },
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      },
                    }}
                  >
                    <DoctorIcon sx={{ mr: 1 }} />
                    Doctor
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Box 
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: 1.5,
                  backgroundColor: alpha(userType === 'patient' ? theme.palette.primary.main : theme.palette.secondary.main, 0.15),
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  width: 'fit-content',
                  margin: '0 auto',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 0 10px ${alpha(userType === 'patient' ? theme.palette.primary.main : theme.palette.secondary.main, 0.5)}`,
                }}
              >
                {userType === 'patient' ? 
                  <PatientIcon sx={{ color: theme.palette.primary.light }} fontSize="small" /> : 
                  <DoctorIcon sx={{ color: theme.palette.secondary.light }} fontSize="small" />
                }
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: userType === 'patient' ? theme.palette.primary.light : theme.palette.secondary.light 
                  }}
                >
                  {userType === 'patient' 
                    ? 'Patient' 
                    : 'Healthcare Provider'}
                </Typography>
              </Box>
            </Box>

            {error && (
              <Fade in={!!error} timeout={500}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.light,
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                    boxShadow: `0 0 15px ${alpha(theme.palette.error.main, 0.3)}`,
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: theme.palette.error.main,
                      display: 'inline-block',
                      mr: 1,
                      boxShadow: `0 0 8px ${theme.palette.error.main}`,
                    }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {error}
                  </Typography>
                </Box>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.6),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.light,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: alpha('#fff', 0.7) }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.6),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.light,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: alpha('#fff', 0.7) }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ 
                          color: alpha('#fff', 0.7),
                          transition: 'all 0.3s',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            color: '#fff',
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.7)}`,
                  transition: 'all 0.3s',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.9)}`,
                    transform: 'translateY(-3px)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  ...(isLoading && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '200%',
                      height: '100%',
                      backgroundImage: `linear-gradient(90deg, 
                        rgba(255,255,255,0) 0%, 
                        rgba(255,255,255,0.3) 50%, 
                        rgba(255,255,255,0) 100%)`,
                      backgroundSize: '80vw 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '-80vw 0',
                      animation: `${shimmer} 2s infinite linear`,
                    },
                  }),
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider 
                sx={{ 
                  my: 3,
                  '&::before, &::after': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  color: alpha('#fff', 0.7),
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ px: 2, fontWeight: 500, color: alpha('#fff', 0.7) }}
                >
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />}
                onClick={handleGoogleLogin}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 4,
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  color: '#fff',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-3px)',
                    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                }}
              >
                Sign in with Google
              </Button>

              <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link 
                    href="#" 
                    variant="body2" 
                    underline="hover"
                    sx={{ 
                      color: theme.palette.primary.light,
                      transition: 'all 0.3s',
                      '&:hover': {
                        color: '#fff',
                        textShadow: `0 0 8px ${theme.palette.primary.main}`,
                      },
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Link 
                    href="#" 
                    variant="body2" 
                    underline="hover"
                    sx={{ 
                      color: theme.palette.primary.light,
                      transition: 'all 0.3s',
                      '&:hover': {
                        color: '#fff',
                        textShadow: `0 0 8px ${theme.palette.primary.main}`,
                      },
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    }}
                  >
                    Don't have an account? Sign up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Zoom>
      </Container>

      {/* Footer */}
      <Box 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha('#0a1929', 0.3),
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            letterSpacing: 0.5,
            color: alpha('#fff', 0.7),
          }}
        >
          © {new Date().getFullYear()} Conversational Intelligence Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage; 