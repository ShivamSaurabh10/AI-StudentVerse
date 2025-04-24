import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  Button, 
  IconButton, 
  Tooltip, 
  Container,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme,
  alpha,
  Zoom,
  CircularProgress,
  Avatar
} from '@mui/material';
import { io } from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  Videocam as VideocamIcon, 
  VideocamOff as VideocamOffIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon,
  Psychology as PsychologyIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  Topic as TopicIcon,
  Timer as TimerIcon,
  Security as SecurityIcon,
  LiveTv as LiveTvIcon,
  RecordVoiceOver as RecordVoiceOverIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { loadFaceDetectionModels, detectFaces } from '../utils/faceDetection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
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

const RealTimeAnalysis = () => {
  const theme = useTheme();
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState({
    joy: [],
    sadness: [],
    anger: [],
    fear: [],
    surprise: [],
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [faceEmotion, setFaceEmotion] = useState(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      const success = await loadFaceDetectionModels();
      if (!success) {
        setCameraError('Failed to load face detection models');
      }
      setIsLoadingModels(false);
    };

    loadModels();
  }, []);

  useEffect(() => {
    let newSocket = null;
    let connectionAttempts = 0;
    const maxAttempts = 3;
    let connectionTimer = null;
    
    const connectSocket = () => {
      try {
        console.log('Attempting to connect to Socket.IO server...');
        setConnectionStatus('connecting');
        newSocket = io(SOCKET_URL, {
          reconnection: true,
          reconnectionAttempts: maxAttempts,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['polling'], // Use only polling transport
          forceNew: true
        });
        
        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocket(newSocket);
          setConnectionStatus('connected');
          connectionAttempts = 0; // Reset attempts on successful connection
        });
        
        newSocket.on('connected', (data) => {
          console.log('Server confirmed connection:', data);
        });
        
        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnectionStatus('error');
          connectionAttempts++;
          
          if (connectionAttempts >= maxAttempts) {
            console.error('Max connection attempts reached. Using fallback mode.');
            // Set a flag to indicate we're in fallback mode
            setSocket(null);
            setConnectionStatus('fallback');
            
            // Clear any existing timer
            if (connectionTimer) {
              clearTimeout(connectionTimer);
            }
            
            // Try to reconnect after a delay
            connectionTimer = setTimeout(() => {
              console.log('Attempting to reconnect to Socket.IO server...');
              connectionAttempts = 0;
              connectSocket();
            }, 5000); // Try again after 5 seconds
          }
        });
        
        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setConnectionStatus('disconnected');
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            connectSocket();
          }
        });
        
        newSocket.on('analysis-error', (error) => {
          console.error('Analysis error:', error);
          setIsAnalyzing(false);
        });
        
        newSocket.on('face-analysis-result', (result) => {
          console.log('Face analysis result:', result);
          // Handle face analysis result if needed
        });
      } catch (error) {
        console.error('Error creating socket:', error);
        setConnectionStatus('error');
      }
    };
    
    // Try to connect to the socket
    connectSocket();

    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition settings
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Set up event listeners
      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        // Restart if still supposed to be listening
        if (isListening) {
          try {
            recognitionInstance.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setSpeechError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setText(prevText => {
          const newText = prevText + transcript;
          if (socket) {
            socket.emit('analyze-text', { text: newText });
          }
          return newText;
        });
      };
      
      setRecognition(recognitionInstance);
    } else {
      setSpeechError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (newSocket) {
        newSocket.close();
      }
      // Clear any existing timer
      if (connectionTimer) {
        clearTimeout(connectionTimer);
      }
      // Clean up camera stream when component unmounts
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      // Stop speech recognition if active
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleTextChange = useCallback((event) => {
    const newText = event.target.value;
    setText(newText);

    if (socket) {
      setIsAnalyzing(true);
      socket.emit('analyze-text', { text: newText });
    } else {
      // Fallback for when socket is not available
      setIsAnalyzing(true);
      // Simulate analysis with a timeout
      setTimeout(() => {
        const mockAnalysis = {
          sentiment: {
            score: Math.random() * 2 - 1,
            comparative: Math.random() * 2 - 1
          },
          emotions: {
            joy: Math.random(),
            sadness: Math.random(),
            anger: Math.random(),
            fear: Math.random(),
            surprise: Math.random()
          },
          context: {
            formality: 'Informal',
            topic: 'General conversation',
            urgency: 'Low'
          }
        };
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
        
        // Check if emotions property exists, if not use empty emotions object
        const emotions = mockAnalysis.emotions || { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0 };
        
        setEmotionHistory(prev => ({
          joy: [...prev.joy, emotions.joy],
          sadness: [...prev.sadness, emotions.sadness],
          anger: [...prev.anger, emotions.anger],
          fear: [...prev.fear, emotions.fear],
          surprise: [...prev.surprise, emotions.surprise],
        }));
      }, 1000);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('analysis-result', (result) => {
      setAnalysis(result);
      setIsAnalyzing(false);
      
      // Check if emotions property exists, if not use empty emotions object
      const emotions = result.emotions || { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0 };
      
      setEmotionHistory(prev => ({
        joy: [...prev.joy, emotions.joy],
        sadness: [...prev.sadness, emotions.sadness],
        anger: [...prev.anger, emotions.anger],
        fear: [...prev.fear, emotions.fear],
        surprise: [...prev.surprise, emotions.surprise],
      }));
    });

    return () => {
      socket.off('analysis-result');
    };
  }, [socket]);

  // Run face detection at intervals when camera is active
  useEffect(() => {
    let intervalId;
    
    const runFaceDetection = async () => {
      if (!isCameraActive || !videoRef.current || !canvasRef.current) return;
      
      const result = await detectFaces(videoRef.current, canvasRef.current);
      
      if (result) {
        setIsFaceDetected(result.isDetected);
        
        if (result.isDetected) {
          setFaceEmotion({
            dominant: result.dominantEmotion,
            expressions: result.expressions
          });
          
          // If socket is connected, send face emotion data
          if (socket) {
            socket.emit('analyze-face', { 
              emotion: result.dominantEmotion,
              expressions: result.expressions
            });
          }
        } else {
          setFaceEmotion(null);
        }
      }
    };
    
    if (isCameraActive && videoRef.current && canvasRef.current) {
      // Initial detection
      runFaceDetection();
      
      // Set up interval for continuous detection
      intervalId = setInterval(runFaceDetection, 500); // Detect every 500ms
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCameraActive, socket]);

  // Initialize video element when camera is activated
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
  }, [isCameraActive, cameraStream]);

  const toggleCamera = async () => {
    if (isCameraActive) {
      // Turn off camera
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setIsCameraActive(false);
      setCameraError('');
      setIsFaceDetected(false);
      setFaceEmotion(null);
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setCameraStream(stream);
        setIsCameraActive(true);
        setCameraError('');
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError('Could not access camera. Please check permissions.');
        setIsCameraActive(false);
      }
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognition) {
      setSpeechError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setSpeechError('');
    } else {
      try {
        // Check if we have a network connection
        if (!navigator.onLine) {
          setSpeechError('Speech recognition requires an internet connection. Please check your network.');
          return;
        }

        // Configure recognition settings
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Start recognition
        recognition.start();
        setIsListening(true);
        setSpeechError('');
        
        // Add event listeners for better handling
        recognition.onstart = () => {
          console.log('Speech recognition started');
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          // Restart if still supposed to be listening
          if (isListening) {
            try {
              recognition.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
              setSpeechError('Could not restart speech recognition. Please try again.');
              setIsListening(false);
            }
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          let errorMessage = 'Speech recognition error occurred.';
          
          // Provide more specific error messages
          switch (event.error) {
            case 'network':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
              break;
            case 'no-speech':
              errorMessage = 'No speech detected. Please speak louder or check your microphone.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone detected. Please connect a microphone and try again.';
              break;
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.';
              break;
            case 'service-not-allowed':
              errorMessage = 'Speech recognition service not allowed. Please check your browser settings.';
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }
          
          setSpeechError(errorMessage);
          setIsListening(false);
          
          // If it's a network error, try to reconnect after a delay
          if (event.error === 'network' && navigator.onLine) {
            setTimeout(() => {
              if (isListening) {
                try {
                  recognition.start();
                } catch (e) {
                  console.error('Error restarting recognition after network error:', e);
                }
              }
            }, 3000);
          }
        };
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          setText(prevText => {
            const newText = prevText + transcript;
            if (socket) {
              socket.emit('analyze-text', { text: newText });
            }
            return newText;
          });
        };
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setSpeechError('Could not start speech recognition. Please try again.');
        setIsListening(false);
      }
    }
  };

  const getSentimentIcon = (score) => {
    if (score > 0.5) return <SentimentSatisfiedIcon color="success" />;
    if (score > -0.2) return <SentimentSatisfiedIcon color="warning" />;
    if (score > -0.5) return <SentimentDissatisfiedIcon color="error" />;
    return <SentimentVeryDissatisfiedIcon color="error" />;
  };

  const getSentimentColor = (score) => {
    if (score > 0.5) return theme.palette.success.main;
    if (score > -0.2) return theme.palette.warning.main;
    if (score > -0.5) return theme.palette.error.light;
    return theme.palette.error.main;
  };

  const emotionChartData = {
    labels: Array(emotionHistory.joy.length).fill(''),
    datasets: [
      {
        label: 'Joy',
        data: emotionHistory.joy,
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1,
        fill: true,
        backgroundColor: alpha('rgb(255, 205, 86)', 0.1),
      },
      {
        label: 'Sadness',
        data: emotionHistory.sadness,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        fill: true,
        backgroundColor: alpha('rgb(54, 162, 235)', 0.1),
      },
      {
        label: 'Anger',
        data: emotionHistory.anger,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: true,
        backgroundColor: alpha('rgb(255, 99, 132)', 0.1),
      },
      {
        label: 'Fear',
        data: emotionHistory.fear,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: alpha('rgb(75, 192, 192)', 0.1),
      },
      {
        label: 'Surprise',
        data: emotionHistory.surprise,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
        fill: true,
        backgroundColor: alpha('rgb(153, 102, 255)', 0.1),
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -10,
          left: 0,
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: 1,
        }
      }}>
        <PsychologyIcon 
          sx={{ 
            fontSize: 40, 
            mr: 2, 
            color: theme.palette.primary.main,
            animation: `${float} 3s ease-in-out infinite`,
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Real-Time Conversation Analysis
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Chip 
            label={connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 
                   connectionStatus === 'error' ? 'Connection Error' : 
                   connectionStatus === 'fallback' ? 'Using Fallback Mode' : 'Disconnected'} 
            color={connectionStatus === 'connected' ? 'success' : 
                   connectionStatus === 'connecting' ? 'info' : 
                   connectionStatus === 'error' ? 'error' : 
                   connectionStatus === 'fallback' ? 'warning' : 'default'} 
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10],
              },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <RecordVoiceOverIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Input Text
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Type or speak your text here for analysis..."
                  value={text}
                  onChange={handleTextChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', gap: 1 }}>
                        <Tooltip title={isListening ? "Stop listening" : "Start speech recognition"}>
                          <IconButton 
                            color={isListening ? "primary" : "default"}
                            onClick={toggleSpeechRecognition}
                            disabled={!navigator.onLine}
                            sx={{ 
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                              animation: isListening ? `${pulse} 1.5s infinite` : 'none',
                            }}
                          >
                            {isListening ? <MicOffIcon /> : <MicIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isCameraActive ? "Turn off camera" : "Turn on camera"}>
                          <IconButton 
                            color={isCameraActive ? "primary" : "default"}
                            onClick={toggleCamera}
                            sx={{ 
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            {isCameraActive ? <VideocamOffIcon /> : <VideocamIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  }}
                />
                {cameraError && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {cameraError}
                  </Typography>
                )}
                {speechError && (
                  <Box sx={{ 
                    mt: 1, 
                    p: 1, 
                    borderRadius: 1, 
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <MicOffIcon color="error" fontSize="small" />
                    <Typography color="error" variant="caption">
                      {speechError}
                    </Typography>
                  </Box>
                )}
                {isListening && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 1,
                    color: theme.palette.primary.main,
                    animation: `${pulse} 1.5s infinite`,
                  }}>
                    <MicIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      Listening... Speak now
                    </Typography>
                  </Box>
                )}
                {isAnalyzing && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 1,
                    color: theme.palette.primary.main,
                  }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="caption">
                      Analyzing text...
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10],
              },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LiveTvIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                Camera Feed
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {isCameraActive ? (
                <Box sx={{ 
                  width: '100%', 
                  height: '240px', 
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: `inset 0 0 10px ${alpha(theme.palette.common.black, 0.1)}`,
                }}>
                  {isLoadingModels ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" color="text.secondary">
                        Loading face detection models...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: isCameraActive ? 'block' : 'none', // Show the video element when camera is active
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: isFaceDetected ? 'block' : 'none', // Only show canvas when face is detected
                        }}
                      />
                      {isFaceDetected && faceEmotion && (
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          left: 16,
                          backgroundColor: alpha(theme.palette.common.black, 0.6),
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: theme.palette.success.main,
                            animation: `${pulse} 1.5s infinite`,
                          }} />
                          Face Detected: {faceEmotion.dominant}
                        </Box>
                      )}
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: 16, 
                        right: 16,
                        backgroundColor: alpha(theme.palette.common.black, 0.6),
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: theme.palette.error.main,
                          animation: `${pulse} 1.5s infinite`,
                        }} />
                        Live
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  height: '240px', 
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  gap: 2,
                }}>
                  <VideocamIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
                  <Typography variant="body1" color="text.secondary">
                    Camera is inactive
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<VideocamIcon />}
                    onClick={toggleCamera}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[3],
                      },
                    }}
                  >
                    Activate Camera
                  </Button>
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {isCameraActive 
                  ? isFaceDetected 
                    ? "Face detected! Analyzing facial expressions in real-time."
                    : "Camera is active. Position your face in the frame for analysis."
                  : "Enable your camera to analyze facial expressions during your conversation."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {analysis && (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 2, display: 'flex', alignItems: 'center' }}>
                <PsychologyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Analysis Results
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={500}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <SentimentSatisfiedIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Sentiment Analysis
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(getSentimentColor(analysis.sentiment.score), 0.1),
                          color: getSentimentColor(analysis.sentiment.score),
                          mr: 2,
                        }}
                      >
                        {getSentimentIcon(analysis.sentiment.score)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Overall Sentiment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {analysis.sentiment.score > 0.5 ? 'Very Positive' : 
                           analysis.sentiment.score > 0 ? 'Positive' : 
                           analysis.sentiment.score > -0.2 ? 'Neutral' : 
                           analysis.sentiment.score > -0.5 ? 'Negative' : 'Very Negative'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        label={`Score: ${analysis.sentiment.score.toFixed(2)}`} 
                        color="primary" 
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip 
                        label={`Comparative: ${analysis.sentiment.comparative.toFixed(2)}`} 
                        color="secondary" 
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={700}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <TopicIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Context Analysis
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SecurityIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Formality
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {analysis.context.formality}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TopicIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Topic
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {analysis.context.topic}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TimerIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Urgency
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {analysis.context.urgency}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12}>
              <Zoom in={true} timeout={900}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <PsychologyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Emotion Trends
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ height: 300 }}>
                      <Line
                        data={emotionChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: alpha(theme.palette.divider, 0.1),
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                usePointStyle: true,
                                padding: 20,
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default RealTimeAnalysis; 