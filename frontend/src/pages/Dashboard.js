import React, { useState, useEffect, useRef } from 'react';
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
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Fab,
  Zoom,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Chip,
  Alert,
  Collapse,
  styled,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Medication as MedicationIcon,
  Videocam as VideocamIcon,
  HealthAndSafety as HealthIcon,
  AccessAlarm as AlarmIcon,
  SmartToy as ChatbotIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  WarningAmber as WarningIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  AddPhotoAlternate as AddPhotoIcon,
  MedicalServices as MedicalServicesIcon,
  DarkMode,
  LightMode,
  Person as PersonIcon,
  Science as ScienceIcon,
  Schedule,
  Psychology,
} from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { keyframes } from '@mui/system';
import { useThemeContext } from '../contexts/ThemeContext';
import { loadFaceDetectionModels, analyzeStaticImage } from '../utils/faceDetection';
import ImageAnalysisDisplay from '../components/ImageAnalysisDisplay';

// Define pulse animation for the chatbot button
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

// Define a more pronounced ripple animation for icons
const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Enhanced floating animation
const floating = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

// Enhanced spinning animation
const spinning = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Add new animations
const glowing = keyframes`
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

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
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

// Enhanced styled components with glowing effects
const EnhancedIconButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'scale(1.15) rotate(5deg)',
    backgroundColor: theme.palette[color]?.light || theme.palette.primary.light,
    boxShadow: `0 0 15px ${theme.palette[color]?.main || theme.palette.primary.main}80`,
  },
  '&:active': {
    animation: `${ripple} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
    transform: 'scale(0.95)',
  },
}));

const LiveIconWrapper = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5),
  borderRadius: '50%',
  backgroundColor: active ? 'rgba(0, 255, 0, 0.15)' : 'transparent',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    backgroundColor: active ? 'rgba(0, 255, 0, 0.25)' : 'rgba(0, 0, 0, 0.08)',
    transform: 'scale(1.1)',
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 0, 0.05)',
    animation: `${pulse} 2s infinite`,
  } : {},
}));

const PulsatingIcon = styled(Box)(({ theme, pulseColor = 'primary' }) => ({
  animation: `${pulse} 2.5s infinite`,
  color: theme.palette[pulseColor]?.main || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  filter: `drop-shadow(0 0 3px ${theme.palette[pulseColor]?.main || theme.palette.primary.main})`,
}));

// Square-shaped container for service icons with enhanced glowing effect
const SquareIconContainer = styled(Box)(({ theme, color = 'primary', active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  backgroundColor: `${theme.palette[color]?.light || theme.palette.primary.light}70`,
  boxShadow: active ? `0 0 20px ${theme.palette[color]?.main || theme.palette.primary.main}` : 'none',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  animation: active ? `${floating} 5s ease infinite` : 'none',
  border: `2px solid ${theme.palette[color]?.main || theme.palette.primary.main}70`,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) rotate(3deg)',
    boxShadow: `0 10px 25px ${theme.palette[color]?.main || theme.palette.primary.main}70`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundColor: `${theme.palette[color]?.main || theme.palette.primary.main}20`,
    backgroundImage: `radial-gradient(circle, ${theme.palette[color]?.light || theme.palette.primary.light}30, transparent 70%)`,
    animation: active ? `${spinning} 8s linear infinite` : 'none',
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: `${theme.palette[color]?.main || theme.palette.primary.main}50`,
    filter: 'blur(5px)',
    top: '10%',
    left: '10%',
  } : {},
}));

// Add new styled components for enhanced UI
const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  animation: `${shimmer} 3s linear infinite`,
}));

const GlowingButton = styled(Button)(({ theme, color = 'primary' }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(45deg, ${theme.palette[color]?.dark || theme.palette.primary.dark}, ${theme.palette[color]?.main || theme.palette.primary.main})`,
  boxShadow: `0 5px 15px ${theme.palette[color]?.main || theme.palette.primary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px ${theme.palette[color]?.main || theme.palette.primary.main}70`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundColor: `${theme.palette[color]?.light || theme.palette.primary.light}20`,
    transform: 'rotate(45deg)',
    transition: 'all 0.6s ease',
  },
  '&:hover::before': {
    transform: 'rotate(45deg) translate(80%, 80%)',
  },
}));

// Add styled component for the theme toggle button
const ThemeToggleWrapper = styled(Box)(({ theme, isdark }) => ({
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5),
  borderRadius: '50%',
  backgroundColor: isdark === 'true' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    backgroundColor: isdark === 'true' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
    transform: 'scale(1.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: isdark === 'true' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    animation: `${glowing} 2s infinite`,
  },
}));

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm your AI health assistant. How can I help you today? You can ask me about medical symptoms or health concerns.", isBot: true }
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleThemeMode } = useThemeContext();

  // New state for icon activity including skin diagnosis
  const [iconsActive, setIconsActive] = useState({
    dashboard: true,
    health: false,
    video: false,
    medication: false,
    commonMedications: false,
    bmiCalc: false,
    aiScheduling: false,
    healthManagement: false,
  });

  // Medical information database
  const medicalDatabase = {
    headache: {
      title: "Headache Information",
      description: "Headaches are a common condition that can cause pain and discomfort in your head, scalp, or neck. There are different types of headaches, such as tension, migraine, and cluster headaches.",
      symptoms: ["Pain in head or face", "Throbbing or pulsing sensation", "Sensitivity to light or sound", "Nausea"],
      treatments: ["Over-the-counter pain relievers", "Rest in a quiet, dark room", "Hydration", "Stress management", "Regular exercise"],
      whenToSeeDoctor: "Seek immediate medical attention if your headache is sudden and severe, follows a head injury, or is accompanied by fever, stiff neck, confusion, seizures, weakness, or vision problems."
    },
    fever: {
      title: "Fever Information",
      description: "A fever is a temporary increase in your body temperature, often due to an illness. Having a fever is a sign that something out of the ordinary is going on in your body.",
      symptoms: ["Elevated body temperature above 100.4°F (38°C)", "Sweating", "Chills and shivering", "Headache", "Muscle aches"],
      treatments: ["Rest", "Hydration", "Over-the-counter fever reducers", "Light clothing"],
      whenToSeeDoctor: "Contact your doctor if your temperature is 103°F (39.4°C) or higher, lasts more than three days, or is accompanied by severe symptoms."
    },
    cough: {
      title: "Cough Information",
      description: "A cough is your body's way of responding to irritants in your throat and airways. It's a common symptom of many medical conditions, from minor irritations to serious diseases.",
      symptoms: ["Dry or productive (mucus) cough", "Tickling in throat", "Chest discomfort", "Postnasal drip"],
      treatments: ["Staying hydrated", "Cough drops", "Humidifier", "Honey (for adults and children over 1 year)"],
      whenToSeeDoctor: "See a doctor if your cough lasts more than three weeks, brings up bloody or discolored mucus, or is accompanied by fever, wheezing, or shortness of breath."
    },
    diabetes: {
      title: "Diabetes Information",
      description: "Diabetes is a chronic health condition that affects how your body turns food into energy. With diabetes, your body either doesn't make enough insulin or can't use it as well as it should.",
      symptoms: ["Increased thirst", "Frequent urination", "Extreme hunger", "Unexplained weight loss", "Fatigue", "Blurred vision"],
      treatments: ["Regular blood sugar monitoring", "Insulin therapy (for Type 1)", "Oral medications (for Type 2)", "Healthy diet", "Regular exercise"],
      whenToSeeDoctor: "Contact your doctor if you experience any diabetes symptoms, especially if you have risk factors such as family history, obesity, or age over 45."
    },
    hypertension: {
      title: "High Blood Pressure (Hypertension) Information",
      description: "Hypertension is a common condition where the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.",
      symptoms: ["Most people have no symptoms, which is why it's called the 'silent killer'", "In severe cases: headaches, shortness of breath, nosebleeds"],
      treatments: ["Regular exercise", "Heart-healthy diet", "Limiting sodium and alcohol", "Maintaining a healthy weight", "Prescription medications"],
      whenToSeeDoctor: "Have your blood pressure checked regularly, at least once every two years if it's normal, or more frequently if you have risk factors."
    },
    anxiety: {
      title: "Anxiety Information",
      description: "Anxiety is a normal emotion that causes increased alertness, fear, and physical signs such as rapid heart rate. However, when anxiety reactions become excessive, it can develop into an anxiety disorder.",
      symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Rapid heartbeat", "Trembling"],
      treatments: ["Psychotherapy (talk therapy)", "Cognitive-behavioral therapy", "Relaxation techniques", "Mindfulness practices", "Medications in some cases"],
      whenToSeeDoctor: "Consult a healthcare provider if anxiety interferes with daily activities, causes significant distress, or if you're using substances to manage your symptoms."
    }
  };

  // Load face detection models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      await loadFaceDetectionModels();
    };
    loadModels();
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleResetChat = () => {
    setChatMessages([
      { text: "Chat has been reset. How can I help you today? You can ask me about medical symptoms or health concerns.", isBot: true }
    ]);
    setMessage('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (!permissionGranted) {
        // Show permission alert if permission not granted yet
        setShowPermissionAlert(true);
        // Store file temporarily
        setImageFile(e.target.files[0]);
        return;
      }
      
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (file) => {
    // Create a URL for the image preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Add a message with the image to the chat
    setChatMessages([
      ...chatMessages,
      {
        text: `I've uploaded an image for analysis.`,
        isBot: false,
        image: objectUrl
      }
    ]);
    
    // Start loading state
    setIsSearching(true);
    
    // Create image and canvas elements for analysis
    const img = new Image();
    img.src = objectUrl;
    
    img.onload = async () => {
      // Create a temporary canvas for face analysis
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      document.body.appendChild(tempCanvas);
      
      try {
        // Analyze the image using face-api.js
        const analysisResult = await analyzeStaticImage(img, tempCanvas);
        
        // Generate response based on analysis
        let responseText = '';
        
        if (analysisResult && analysisResult.isDetected) {
          const { dominantEmotion, expressions, skinAnalysis } = analysisResult;
          
          // Format emotions for display
          const emotions = Object.entries(expressions)
            .map(([emotion, score]) => `${emotion}: ${Math.round(score * 100)}%`)
            .join(', ');
          
          responseText = `I've analyzed your image. I detected a face with the following emotional expressions: ${emotions}. The dominant emotion appears to be ${dominantEmotion}.`;
          
          if (skinAnalysis) {
            responseText += ` The skin texture appears to be ${skinAnalysis.texture}.`;
          }
          
          responseText += ` Would you like to discuss specific symptoms or concerns related to this image?`;
        } else {
          responseText = "I've analyzed your image, but couldn't detect any faces. This might be a medical scan or another type of image. Would you like to discuss specific symptoms or concerns related to this image?";
        }
        
        // Clean up temporary canvas
        document.body.removeChild(tempCanvas);
        
        // Add response message
        setIsSearching(false);
        setChatMessages(prev => [
          ...prev,
          {
            text: responseText,
            isBot: true
          }
        ]);
      } catch (error) {
        console.error('Error analyzing image:', error);
        
        // Clean up temporary canvas
        if (document.body.contains(tempCanvas)) {
          document.body.removeChild(tempCanvas);
        }
        
        // Add fallback response message
        setIsSearching(false);
        setChatMessages(prev => [
          ...prev,
          {
            text: "I've analyzed your image, but encountered an error during processing. Would you like to discuss specific symptoms or concerns related to this image?",
            isBot: true
          }
        ]);
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      setIsSearching(false);
      setChatMessages(prev => [
        ...prev,
        {
          text: "I had trouble loading your image. Could you try uploading it again?",
          isBot: true
        }
      ]);
    };
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageFile(null);
  };

  const handlePermissionResponse = (granted) => {
    setPermissionGranted(granted);
    setShowPermissionAlert(false);
    
    if (granted && imageFile) {
      // Process the image now that permission is granted
      handleImageUpload(imageFile);
    } else {
      // Clear stored file if permission denied
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Cleanup function for object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleGoogleSearch = () => {
    if (message.trim() === '') return;
    
    const query = encodeURIComponent(message.trim());
    const searchUrl = `https://www.google.com/search?q=${query}+medical+information`;
    
    // Open Google search in a new tab
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    
    // Add a message to the chat indicating the search was performed
    setChatMessages([
      ...chatMessages, 
      { text: `I've searched Google for "${message}" in a new tab.`, isBot: true }
    ]);
  };

  const getMedicalInfo = async (query) => {
    setIsSearching(true);
    
    // Add a message showing we're processing the query
    setChatMessages(prev => [...prev, { 
      text: `Searching for information about "${query}"...`, 
      isBot: true 
    }]);
    
    // Simulate a delay to mimic processing (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert query to lowercase for matching
    const queryLower = query.toLowerCase();
    
    // Check if query matches any of our medical topics
    let matchedCondition = null;
    
    Object.keys(medicalDatabase).forEach(condition => {
      if (queryLower.includes(condition)) {
        matchedCondition = condition;
      }
    });
    
    // If we have a match, return structured information
    if (matchedCondition) {
      const info = medicalDatabase[matchedCondition];
      
      const response = {
        text: `Here's what I know about ${matchedCondition}:`,
        isBot: true,
        medicalInfo: info
      };
      
      setIsSearching(false);
      setChatMessages(prev => [...prev, response]);
    } 
    // No direct match found, provide a general response
    else {
      const generalResponses = [
        {
          text: "I couldn't find specific information about that. Could you provide more details about your symptoms?",
          isBot: true,
          suggestions: ["Headache", "Fever", "Cough", "Diabetes", "Anxiety"]
        },
        {
          text: "I don't have specific information on that query. Here are some common health topics you can ask about:",
          isBot: true,
          suggestions: ["Headache", "Fever", "Cough", "Diabetes", "Anxiety"]
        },
        {
          text: "I'm not finding a match for your query. You might try one of these common health topics:",
          isBot: true,
          suggestions: ["Headache", "Hypertension", "Cough", "Diabetes", "Anxiety"]
        }
      ];
      
      const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      
      setIsSearching(false);
      setChatMessages(prev => [...prev, randomResponse]);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    setChatMessages([...chatMessages, { text: message, isBot: false }]);
    
    const userQuery = message.trim();
    setMessage('');
    
    // Get medical information for the query
    getMedicalInfo(userQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Add user message with the suggestion
    setChatMessages(prev => [...prev, { text: suggestion, isBot: false }]);
    
    // Get medical information for the suggestion
    getMedicalInfo(suggestion);
  };

  // Navigation handlers for healthcare services
  const handleAIDiagnosisClick = () => {
    navigate('/ai-diagnosis');
  };

  const handleVideoConsultationClick = () => {
    navigate('/video-consultation');
  };

  const handleMedicineTimerClick = () => {
    navigate('/medicine-timer');
  };

  const handleSymptomAnalysisClick = () => {
    navigate('/symptom-analysis');
  };

  // Add new navigation handler for Common Medications
  const handleCommonMedicationsClick = () => {
    navigate('/common-medications');
  };

  // Add new navigation handler for BMI Calculator
  const handleBmiCalcClick = () => {
    navigate('/bmi-calculator');
  };

  // Add navigation handler for AI Scheduling
  const handleAISchedulingClick = () => {
    navigate('/ai-scheduling');
  };

  // Add navigation handler for Health Management
  const handleHealthManagementClick = () => {
    navigate('/health-management');
  };

  // Toggle icon active state
  const toggleIconActive = (iconName) => {
    setIconsActive(prev => ({
      ...prev,
      [iconName]: !prev[iconName]
    }));
  };

  // Modified StatCard with animated icons and glass effect
  const StatCard = ({ title, value, icon, color }) => (
    <GlassCard sx={{ 
      height: '100%', 
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 25px ${theme.palette[color]?.main || theme.palette.primary.main}40`,
      },
      animation: `${breathe} 6s infinite ease-in-out`,
      animationDelay: Math.random() + 's',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
              transition: 'all 0.3s ease',
              animation: `${pulse} 3s infinite`,
              '&:hover': {
                transform: 'rotate(10deg) scale(1.1)',
                boxShadow: `0 0 20px ${theme.palette[color]?.light || theme.palette.primary.light}`,
              },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <GradientText variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </GradientText>
      </CardContent>
    </GlassCard>
  );

  // Add a handler function for theme toggle
  const handleThemeToggle = () => {
    toggleThemeMode();
  };

  if (!user) {
    return null; // Don't render anything while checking auth state
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      position: 'relative',
      backgroundImage: `radial-gradient(circle at 20% 90%, ${theme.palette.primary.light}30 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.light}30 0%, transparent 50%)`,
      backgroundColor: theme.palette.background.default,
    }}>
      {/* App Bar with glass effect */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          color: isDarkMode ? 'white' : 'inherit'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <PulsatingIcon pulseColor="primary" sx={{ mr: 1 }}>
              <DashboardIcon />
            </PulsatingIcon>
            <GradientText variant="h6" component="div">
              Conversational Intelligence
            </GradientText>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <EnhancedIconButton
                color="inherit"
                onClick={handleThemeToggle}
                sx={{ mr: 1 }}
              >
                <ThemeToggleWrapper isdark={isDarkMode.toString()}>
                  {isDarkMode ? <LightMode /> : <DarkMode />}
                </ThemeToggleWrapper>
              </EnhancedIconButton>
            </Tooltip>
            <EnhancedIconButton
              edge="end"
              color="inherit"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{
                position: 'relative',
                '&::after': iconsActive?.notifications ? {
                  content: '""',
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'error.main',
                  boxShadow: '0 0 5px rgba(244, 67, 54, 0.8)',
                  animation: `${pulse} 1.5s infinite`,
                } : {},
              }}
            >
              {user.photoURL ? (
                <Avatar 
                  alt={user.displayName} 
                  src={user.photoURL}
                  sx={{ 
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 0 10px rgba(25, 118, 210, 0.4)'
                  }} 
                />
              ) : (
                <LiveIconWrapper active={true}>
                  <AccountIcon />
                </LiveIconWrapper>
              )}
            </EnhancedIconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <LiveIconWrapper active={true}>
                <AccountIcon sx={{ mr: 2, color: 'primary.main' }} />
              </LiveIconWrapper>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <LiveIconWrapper>
                <SettingsIcon sx={{ mr: 2, color: 'info.main' }} />
              </LiveIconWrapper>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LiveIconWrapper>
                <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
              </LiveIconWrapper>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ 
          mb: 4, 
          position: 'relative', 
          padding: 3, 
          borderRadius: 4,
          background: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
        }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              background: `radial-gradient(circle, ${theme.palette.primary.light}40, transparent)`,
              top: '-50px',
              right: '-50px',
              zIndex: 0,
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <GradientText variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome, {user.displayName || user.email}
            </GradientText>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your conversational intelligence platform
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Conversations"
              value="128"
              icon={<PulsatingIcon pulseColor="primary"><DashboardIcon fontSize="large" /></PulsatingIcon>}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Positive Sentiment"
              value="78%"
              icon={<PulsatingIcon pulseColor="success"><TimelineIcon fontSize="large" /></PulsatingIcon>}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Historical Data"
              value="45"
              icon={<PulsatingIcon pulseColor="info"><HistoryIcon fontSize="large" /></PulsatingIcon>}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value="12"
              icon={<PulsatingIcon pulseColor="warning"><AccountIcon fontSize="large" /></PulsatingIcon>}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Action Buttons with glass effect */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4,
          background: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <GradientText variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quick Actions
          </GradientText>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <GlowingButton
              variant="contained"
              startIcon={<TimelineIcon />}
              onClick={() => navigate('/realtime')}
              color="primary"
            >
              Start Real-time Analysis
            </GlowingButton>
            <GlowingButton
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => navigate('/history')}
              color="info"
              sx={{
                background: 'transparent',
                border: `1px solid ${theme.palette.info.main}`,
                color: theme.palette.info.main,
              }}
            >
              View Historical Data
            </GlowingButton>
            <GlowingButton
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/settings')}
              color="secondary"
              sx={{
                background: 'transparent',
                border: `1px solid ${theme.palette.secondary.main}`,
                color: theme.palette.secondary.main,
              }}
            >
              Configure Settings
            </GlowingButton>
            
            <GlowingButton
              variant="outlined"
              startIcon={<MedicationIcon />}
              onClick={() => {
                toggleIconActive('medication');
                handleSymptomAnalysisClick();
              }}
              color="error"
              sx={{
                background: 'transparent',
                border: `1px solid ${theme.palette.error.main}`,
                color: theme.palette.error.main,
              }}
            >
              Symptom History
            </GlowingButton>
          </Box>
          
          <Divider sx={{ my: 3, opacity: 0.5 }} />
          
          <GradientText variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Healthcare Services
          </GradientText>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                toggleIconActive('health');
                handleAIDiagnosisClick();
              }}
              sx={{ 
                bgcolor: theme.palette.success.main,
                '&:hover': { 
                  bgcolor: theme.palette.success.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="success" active={iconsActive.health}>
                <HealthIcon sx={{ fontSize: 32, color: 'success.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                AI Diagnosis
              </Typography>
            </Button>
            
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                toggleIconActive('video');
                handleVideoConsultationClick();
              }}
              sx={{ 
                bgcolor: theme.palette.info.main,
                '&:hover': { 
                  bgcolor: theme.palette.info.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="info" active={iconsActive.video}>
                <VideocamIcon sx={{ fontSize: 32, color: 'info.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                Video Consultation
              </Typography>
            </Button>
            
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                toggleIconActive('timer');
                handleMedicineTimerClick();
              }}
              sx={{ 
                bgcolor: theme.palette.warning.main,
                '&:hover': { 
                  bgcolor: theme.palette.warning.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="warning" active={iconsActive.timer}>
                <AlarmIcon sx={{ fontSize: 32, color: 'warning.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                Medicine Timer
              </Typography>
            </Button>
            
            {/* AI Scheduling Button */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                toggleIconActive('aiScheduling');
                handleAISchedulingClick();
              }}
              sx={{ 
                bgcolor: theme.palette.error.main,
                '&:hover': { 
                  bgcolor: theme.palette.error.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="error" active={iconsActive.aiScheduling}>
                <Schedule sx={{ fontSize: 32, color: 'error.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                AI Scheduling
              </Typography>
            </Button>
            
            {/* New BMI Calculator and Calorie Count Button */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                toggleIconActive('bmiCalc');
                handleBmiCalcClick();
              }}
              sx={{ 
                bgcolor: theme.palette.error.main,
                '&:hover': { 
                  bgcolor: theme.palette.error.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="error" active={iconsActive.bmiCalc}>
                <HealthIcon sx={{ fontSize: 32, color: 'error.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                BMI Calculator
              </Typography>
            </Button>
            
            {/* Common Medications Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                toggleIconActive('commonMedications');
                handleCommonMedicationsClick();
              }}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                '&:hover': { 
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="primary" active={iconsActive.commonMedications}>
                <MedicalServicesIcon sx={{ fontSize: 32, color: 'primary.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                Common Medications
              </Typography>
            </Button>
            
            {/* Health Management Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                toggleIconActive('healthManagement');
                handleHealthManagementClick();
              }}
              sx={{ 
                bgcolor: theme.palette.secondary.main,
                '&:hover': { 
                  bgcolor: theme.palette.secondary.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                minWidth: '160px',
                height: '160px',
                borderRadius: '16px'
              }}
            >
              <SquareIconContainer color="secondary" active={iconsActive.healthManagement}>
                <Psychology sx={{ fontSize: 32, color: 'secondary.contrastText' }} />
              </SquareIconContainer>
              <Typography variant="button" sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
                Health Management
              </Typography>
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Conversational Intelligence Platform. All rights reserved.
                Designed By Shivam Saurabh , J.Pavani , Vivek Baxla , Reshma.
          </Typography>
        </Container>
      </Box>

      {/* AI Chatbot Floating Button with enhanced animation */}
      <Tooltip title={chatOpen ? "Close chat" : "AI Health Assistant"} placement="left">
        <Zoom in={true}>
          <Fab 
            color="primary"
            aria-label="AI Assistant"
            onClick={handleChatToggle}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              animation: chatOpen ? 'none' : `${pulse} 2s infinite`,
              boxShadow: theme.shadows[8],
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(10deg)',
                boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
              }
            }}
          >
            {chatOpen ? <CloseIcon /> : <ChatbotIcon />}
          </Fab>
        </Zoom>
      </Tooltip>

      {/* AI Chat Dialog with glass morphism */}
      <Dialog
        open={chatOpen}
        onClose={handleChatToggle}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 90,
            right: 24,
            m: 0,
            width: { xs: '95%', sm: 400 },
            maxWidth: 400,
            maxHeight: 500,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            overflow: 'hidden',
          }
        }}
        BackdropProps={{
          sx: { backgroundColor: 'transparent' }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.light}50 0%, transparent 50%)`,
            opacity: 0.3,
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PulsatingIcon 
              pulseColor={theme.palette.mode === 'dark' ? 'primary' : 'white'} 
              sx={{ 
                mr: 1,
                color: 'white',
                filter: 'drop-shadow(0 0 3px white)'
              }}
            >
              <ChatbotIcon sx={{ color: 'white' }} />
            </PulsatingIcon>
            <Typography variant="h6" fontWeight="bold">
              AI Health Assistant
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Reset conversation">
              <IconButton 
                size="small" 
                edge="end" 
                sx={{ 
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
                onClick={handleResetChat}
                className="mr-1"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton 
              size="small" 
              edge="end" 
              sx={{ 
                color: 'white', 
                ml: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(90deg)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }} 
              onClick={handleChatToggle}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Permission Alert */}
          <Collapse in={showPermissionAlert}>
            <Alert 
              severity="info"
              icon={<InfoIcon sx={{ animation: `${pulse} 2s infinite` }} />}
              action={
                <Box>
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => handlePermissionResponse(false)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    Deny
                  </Button>
                  <Button 
                    color="primary" 
                    size="small"
                    onClick={() => handlePermissionResponse(true)}
                    variant="contained"
                    sx={{ 
                      ml: 1,
                      animation: `${glowing} 2s infinite`,
                    }}
                  >
                    Allow
                  </Button>
                </Box>
              }
              sx={{ 
                borderRadius: 0,
                background: 'rgba(229, 246, 253, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 182, 246, 0.2)',
              }}
            >
              Allow AI Health Assistant to analyze your uploaded image?
            </Alert>
          </Collapse>
          
          <Box sx={{ 
            p: 2, 
            overflowY: 'auto', 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundImage: `radial-gradient(circle at 10% 90%, ${theme.palette.primary.light}15 0%, transparent 50%)`,
          }}>
            {chatMessages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  maxWidth: msg.medicalInfo || msg.suggestions ? '100%' : '80%',
                  p: 1.5,
                  borderRadius: msg.isBot ? '18px 18px 18px 0' : '18px 18px 0 18px',
                  bgcolor: msg.isBot 
                    ? 'rgba(240, 240, 240, 0.8)' 
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: msg.isBot ? 'text.primary' : 'white',
                  boxShadow: msg.isBot 
                    ? '0 2px 10px rgba(0,0,0,0.05)' 
                    : `0 4px 15px ${theme.palette.primary.main}40`,
                  width: msg.medicalInfo || msg.suggestions ? '100%' : 'auto',
                  backdropFilter: 'blur(10px)',
                  border: msg.isBot ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  animation: `${breathe} 5s infinite`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <Typography variant="body2">
                  {msg.text}
                </Typography>
                
                {/* Display uploaded image */}
                {msg.image && (
                  <Box sx={{ mt: 1, mb: 1, maxWidth: '100%' }}>
                    <ImageAnalysisDisplay 
                      imageUrl={msg.image} 
                      onAnalysisComplete={(result) => {
                        // Optionally handle the analysis result here
                        console.log('Image analysis complete:', result);
                      }}
                    />
                  </Box>
                )}
                
                {/* Display medical information */}
                {msg.medicalInfo && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                      {msg.medicalInfo.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {msg.medicalInfo.description}
                    </Typography>
                    
                    {/* Symptoms */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Common Symptoms:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {msg.medicalInfo.symptoms.map((symptom, i) => (
                          <Chip 
                            key={i} 
                            label={symptom} 
                            size="small" 
                            sx={{ bgcolor: theme.palette.info.light, color: theme.palette.info.dark }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Treatments */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Common Treatments:</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                        {msg.medicalInfo.treatments.map((treatment, i) => (
                          <Typography key={i} variant="body2">• {treatment}</Typography>
                        ))}
                      </Box>
                    </Box>
                    
                    {/* When to see doctor */}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-start', bgcolor: theme.palette.warning.light, p: 1, borderRadius: 1 }}>
                      <WarningIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="caption">
                        <strong>When to see a doctor: </strong> 
                        {msg.medicalInfo.whenToSeeDoctor}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2, bgcolor: theme.palette.grey[200], p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        This information is for educational purposes only. Always consult with a healthcare professional for medical advice.
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Display suggestions */}
                {msg.suggestions && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>You can ask me about:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {msg.suggestions.map((suggestion, i) => (
                        <Chip 
                          key={i}
                          label={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          clickable
                          color="primary"
                          variant="outlined"
                          sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
            
            {isSearching && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress 
                  size={24} 
                  color="primary" 
                  sx={{ animation: `${glowing} 1.5s infinite` }} 
                />
              </Box>
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 1,
            background: 'rgba(250, 250, 250, 0.8)',
            backdropFilter: 'blur(10px)',
          }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <Tooltip title="Upload image">
              <IconButton
                color="primary"
                onClick={handleImageButtonClick}
                disabled={isSearching}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  color: 'white',
                  boxShadow: `0 2px 10px ${theme.palette.primary.main}40`,
                  '&:hover': { 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${theme.palette.primary.main}60`,
                  },
                  '&.Mui-disabled': { opacity: 0.7 },
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <AddPhotoIcon />
              </IconButton>
            </Tooltip>
            <TextField
              fullWidth
              placeholder="Ask about health conditions..."
              variant="outlined"
              size="small"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
            <Tooltip title="Search on Google">
              <IconButton
                color="secondary"
                onClick={handleGoogleSearch}
                disabled={!message.trim() || isSearching}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  boxShadow: `0 2px 10px ${theme.palette.secondary.main}40`,
                  '&:hover': { 
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${theme.palette.secondary.main}60`,
                  },
                  '&.Mui-disabled': { opacity: 0.7 },
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
            <IconButton 
              color="primary" 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isSearching}
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                boxShadow: `0 2px 10px ${theme.palette.primary.main}40`,
                '&:hover': { 
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px) scale(1.05)',
                  boxShadow: `0 4px 15px ${theme.palette.primary.main}60`,
                },
                '&.Mui-disabled': { opacity: 0.7 },
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 