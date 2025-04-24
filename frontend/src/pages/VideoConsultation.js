import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  Divider,
  Stack,
  Badge,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  VideocamOutlined as VideocamIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamOnIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  Chat as ChatIcon,
  ScreenShare as ScreenShareIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const VideoConsultation = () => {
  const navigate = useNavigate();
  const [consultationState, setConsultationState] = useState('scheduling'); // 'scheduling', 'waiting', 'connecting', 'active', 'ended'
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Chiku',
      specialty: 'General Practitioner',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      nextAvailable: '10:30 AM Today',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dr. Shivam Saurabh',
      specialty: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      nextAvailable: '1:15 PM Today',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Dr. Reshma',
      specialty: 'Pediatrician',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      nextAvailable: '11:00 AM Tomorrow',
      rating: 4.7,
    },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [timer, setTimer] = useState(0);
  const [permissionError, setPermissionError] = useState(null);
  const [stream, setStream] = useState(null);
  const userVideoRef = useRef(null);
  const doctorVideoRef = useRef(null); // Reference for doctor's video
  const [doctorJoined, setDoctorJoined] = useState(false);

  const handleBack = () => {
    if (consultationState === 'active') {
      // Show confirmation dialog before ending call
      if (window.confirm('Are you sure you want to end this consultation?')) {
        stopUserMedia();
        navigate('/dashboard');
      }
    } else {
      stopUserMedia();
      navigate('/dashboard');
    }
  };

  const requestMediaPermissions = async () => {
    try {
      setPermissionError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      
      // Once permissions are granted, connect user video to the video element
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
      }
      
      return true;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      
      // Handle specific permission errors
      if (err.name === 'NotAllowedError') {
        setPermissionError('Camera or microphone permission denied. Please allow access to continue.');
      } else if (err.name === 'NotFoundError') {
        setPermissionError('Camera or microphone not found. Please check your device connections.');
      } else {
        setPermissionError(`Error accessing media: ${err.message}`);
      }
      
      return false;
    }
  };

  const stopUserMedia = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    
    // Request camera/mic permission
    const permissionsGranted = await requestMediaPermissions();
    
    if (permissionsGranted) {
      // Show video consultation UI right away
      setConsultationState('active');
      
      // Simulate doctor joining after a delay
      setTimeout(() => {
        setDoctorJoined(true);
        // Add welcome message
        setChatMessages([
          { 
            sender: 'doctor', 
            text: `Hello, I'm Dr. ${doctor.name.split(' ')[1]}. How can I help you today?`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
      }, 3000);
    }
  };

  const handleToggleMic = () => {
    setMicEnabled(!micEnabled);
    
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
    }
  };

  const handleToggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
    }
  };

  const handleEndCall = () => {
    stopUserMedia();
    setConsultationState('ended');
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const newMessage = {
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      const doctorResponses = [
        "I understand. Could you tell me more about when these symptoms started?",
        "That's helpful information. Have you noticed any other symptoms?",
        "I see. Based on what you've described, it sounds like it could be a minor case of...",
        "Have you tried any medications or remedies already?",
        "Let me share some recommendations that might help..."
      ];
      
      const responseMessage = {
        sender: 'doctor',
        text: doctorResponses[Math.floor(Math.random() * doctorResponses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Timer for active call
  useEffect(() => {
    let interval;
    if (consultationState === 'active') {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [consultationState]);

  // Cleanup media streams when component unmounts
  useEffect(() => {
    return () => {
      stopUserMedia();
    };
  }, []);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderConsultationContent = () => {
    switch (consultationState) {
      case 'scheduling':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a Doctor for Video Consultation
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {doctors.map((doctor) => (
                <Grid item xs={12} md={4} key={doctor.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar 
                          src={doctor.image} 
                          alt={doctor.name}
                          sx={{ width: 64, height: 64, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" component="div">
                            {doctor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.specialty}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                              Rating:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {doctor.rating}/5
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          Next Available:
                        </Typography>
                        <Chip 
                          label={doctor.nextAvailable} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        startIcon={<VideocamIcon />}
                        onClick={() => handleSelectDoctor(doctor)}
                      >
                        Start Consultation
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {permissionError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {permissionError}
              </Alert>
            )}
          </Box>
        );
      
      case 'active':
        return (
          <Box>
            <Grid container spacing={3}>
              {/* Main video container */}
              <Grid item xs={12}>
                <Box sx={{ position: 'relative', height: '450px', bgcolor: '#111', borderRadius: 2, overflow: 'hidden' }}>
                  
                  {/* Doctor's video */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: doctorJoined ? 1 : 0.3,
                    }}
                  >
                    {doctorJoined ? (
                      <img 
                        src={selectedDoctor.image} 
                        alt="Doctor" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Typography variant="h5" sx={{ color: 'white' }}>
                        Waiting for doctor to join...
                      </Typography>
                    )}
                  </Box>
                  
                  {/* User's video (small overlay) */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 20,
                      right: 20,
                      width: 180,
                      height: 120,
                      bgcolor: '#333',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '2px solid rgba(255,255,255,0.2)',
                      zIndex: 2,
                    }}
                  >
                    {cameraEnabled && stream ? (
                      <video
                        ref={userVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: 'scaleX(-1)' // Mirror effect
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <VideocamOffIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </Box>
                    )}
                  </Box>
                  
                  {/* Call info/timer */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {doctorJoined ? 'Connected with' : 'Connecting to'} {selectedDoctor.name}
                    </Typography>
                    <Chip 
                      label={formatTimer()} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        height: 24,
                      }} 
                    />
                  </Box>
                  
                  {/* Video controls */}
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    borderRadius: 5,
                    padding: '8px',
                  }}>
                    <IconButton 
                      color={micEnabled ? 'primary' : 'error'}
                      onClick={handleToggleMic}
                      sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.1)' }}
                    >
                      {micEnabled ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                    
                    <IconButton 
                      color="error" 
                      onClick={handleEndCall}
                      sx={{ mx: 1, bgcolor: 'rgba(255,0,0,0.2)' }}
                    >
                      <CallEndIcon />
                    </IconButton>
                    
                    <IconButton 
                      color={cameraEnabled ? 'primary' : 'error'}
                      onClick={handleToggleCamera}
                      sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.1)' }}
                    >
                      {cameraEnabled ? <VideocamOnIcon /> : <VideocamOffIcon />}
                    </IconButton>
                    
                    <IconButton 
                      color={chatOpen ? 'primary' : 'inherit'}
                      onClick={handleToggleChat}
                      sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.1)' }}
                    >
                      <Badge 
                        color="error" 
                        variant="dot" 
                        invisible={chatMessages.length === 0 || chatOpen}
                      >
                        <ChatIcon />
                      </Badge>
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              
              {/* Chat area */}
              {chatOpen && (
                <Grid item xs={12} md={4} sx={{ mt: 3 }}>
                  <Paper sx={{ 
                    height: 350, 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Typography variant="subtitle1">Chat</Typography>
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={handleToggleChat}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ 
                      flexGrow: 1, 
                      overflowY: 'auto', 
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                    }}>
                      {chatMessages.map((msg, index) => (
                        <Box 
                          key={index}
                          sx={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                            color: msg.sender === 'user' ? 'white' : 'text.primary',
                            p: 1.5,
                            borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              textAlign: msg.sender === 'user' ? 'right' : 'left',
                              mt: 0.5,
                              opacity: 0.8,
                            }}
                          >
                            {msg.time}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ 
                      p: 2, 
                      borderTop: 1, 
                      borderColor: 'divider',
                      display: 'flex',
                      gap: 1,
                    }}>
                      <TextField
                        fullWidth
                        placeholder="Type a message..."
                        size="small"
                        value={message}
                        onChange={handleMessageChange}
                        onKeyPress={handleKeyPress}
                      />
                      <IconButton 
                        color="primary" 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        );
      
      case 'ended':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Consultation Ended
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for using our video consultation service.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
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
            <VideocamIcon sx={{ mr: 1, color: 'info.main' }} />
            Video Consultation
            {consultationState === 'active' && (
              <Chip 
                label="LIVE" 
                color="error" 
                size="small" 
                sx={{ ml: 2, height: 20 }}
              />
            )}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          {renderConsultationContent()}
        </Paper>
        
        {consultationState === 'scheduling' && (
          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
            Our video consultation service connects you with licensed healthcare professionals.
            Consultations are secure, private, and covered by most insurance plans.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default VideoConsultation; 