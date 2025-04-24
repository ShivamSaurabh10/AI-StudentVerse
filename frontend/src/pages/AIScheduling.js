import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { keyframes } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { 
  CalendarMonth, 
  AccessTime, 
  ArrowBack, 
  Add, 
  CheckCircle, 
  Delete,
  Schedule,
  Event,
  EventAvailable,
  Business,
  Person,
  Work,
  School,
  FitnessCenter,
  MedicalServices,
  Healing,
  EditCalendar,
  MoreVert,
  Notifications,
  MeetingRoom,
  AlarmOn,
  DragIndicator,
  StarOutline,
  Star,
  Today,
  ViewWeek,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Description,
  Repeat,
  Psychology,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useThemeContext } from '../contexts/ThemeContext';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';

// Define animations
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

// Styled components
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
    transform: 'translateY(-5px)',
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

const TaskCard = styled(Paper)(({ theme, priority, completed }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '10px',
  backgroundColor: completed ? 'rgba(220, 220, 220, 0.7)' : 'rgba(255, 255, 255, 0.8)',
  borderLeft: `5px solid ${
    completed 
      ? theme.palette.grey[400] 
      : priority === 'high' 
        ? theme.palette.error.main 
        : priority === 'medium' 
          ? theme.palette.warning.main 
          : theme.palette.success.main
  }`,
  transition: 'all 0.2s ease',
  position: 'relative',
  opacity: completed ? 0.7 : 1,
  boxShadow: completed ? '0 3px 10px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.15)',
  textDecoration: completed ? 'line-through' : 'none',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  }
}));

const CalendarCell = styled(Box)(({ theme, isToday, isSelected, hasEvents }) => ({
  width: '100%',
  height: '100%',
  minHeight: '100px',
  padding: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: isSelected 
    ? `${theme.palette.primary.main}20` 
    : isToday 
      ? `${theme.palette.secondary.main}15` 
      : 'transparent',
  border: isToday 
    ? `2px solid ${theme.palette.secondary.main}` 
    : isSelected 
      ? `2px solid ${theme.palette.primary.main}` 
      : '1px solid rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}10`,
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  }
}));

const EventPill = styled(Box)(({ theme, eventType }) => {
  const getColor = () => {
    switch(eventType) {
      case 'meeting': return theme.palette.primary.main;
      case 'task': return theme.palette.success.main;
      case 'appointment': return theme.palette.error.main;
      case 'reminder': return theme.palette.warning.main;
      default: return theme.palette.info.main;
    }
  };
  
  return {
    backgroundColor: `${getColor()}20`,
    color: getColor(),
    border: `1px solid ${getColor()}`,
    borderRadius: '20px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '2px',
    maxWidth: '100%',
    '&:hover': {
      backgroundColor: `${getColor()}40`,
    }
  };
});

// Sample categories and event types 
const categories = [
  { id: 'healthcare', name: 'Healthcare', icon: <MedicalServices /> },
  { id: 'work', name: 'Work', icon: <Work /> },
  { id: 'personal', name: 'Personal', icon: <Person /> },
  { id: 'education', name: 'Education', icon: <School /> },
  { id: 'fitness', name: 'Fitness', icon: <FitnessCenter /> }
];

const eventTypes = [
  { id: 'meeting', name: 'Meeting', icon: <MeetingRoom /> },
  { id: 'task', name: 'Task', icon: <Work /> },
  { id: 'appointment', name: 'Appointment', icon: <Event /> },
  { id: 'reminder', name: 'Reminder', icon: <AlarmOn /> }
];

// Generate sample events
const generateSampleEvents = () => {
  const today = new Date();
  return [
    {
      id: '1',
      title: 'Team Standup Meeting',
      description: 'Daily team standup to discuss progress and blockers',
      startDate: addDays(today, 0).setHours(10, 0, 0),
      endDate: addDays(today, 0).setHours(10, 30, 0),
      category: 'work',
      type: 'meeting',
      priority: 'medium',
      completed: false
    },
    {
      id: '2',
      title: 'Annual Physical Checkup',
      description: 'Annual physical examination with Dr. Johnson',
      startDate: addDays(today, 2).setHours(14, 0, 0),
      endDate: addDays(today, 2).setHours(15, 0, 0),
      category: 'healthcare',
      type: 'appointment',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      title: 'Finish Project Proposal',
      description: 'Complete and submit the quarterly project proposal',
      startDate: addDays(today, 1).setHours(13, 0, 0),
      endDate: addDays(today, 1).setHours(17, 0, 0),
      category: 'work',
      type: 'task',
      priority: 'high',
      completed: false
    },
    {
      id: '4',
      title: 'Online Course Session',
      description: 'Attend online session for ML certification',
      startDate: addDays(today, 3).setHours(18, 0, 0),
      endDate: addDays(today, 3).setHours(19, 30, 0),
      category: 'education',
      type: 'meeting',
      priority: 'medium',
      completed: false
    },
    {
      id: '5',
      title: 'Gym Workout',
      description: 'Upper body workout session',
      startDate: addDays(today, 0).setHours(18, 0, 0),
      endDate: addDays(today, 0).setHours(19, 0, 0),
      category: 'fitness',
      type: 'appointment',
      priority: 'low',
      completed: false
    },
    {
      id: '6',
      title: 'Take Medication',
      description: 'Take prescribed medication after lunch',
      startDate: addDays(today, 0).setHours(13, 0, 0),
      endDate: addDays(today, 0).setHours(13, 15, 0),
      category: 'healthcare',
      type: 'reminder',
      priority: 'high',
      completed: false
    }
  ];
};

// Generate sample tasks
const generateSampleTasks = () => {
  return [
    {
      id: 't1',
      title: 'Review patient records',
      description: 'Review latest patient data and update records',
      dueDate: addDays(new Date(), 1).setHours(17, 0, 0),
      category: 'healthcare',
      priority: 'high',
      completed: false
    },
    {
      id: 't2',
      title: 'Prepare team presentation',
      description: 'Create slides for the upcoming team meeting',
      dueDate: addDays(new Date(), 2).setHours(14, 0, 0),
      category: 'work',
      priority: 'medium',
      completed: false
    },
    {
      id: 't3',
      title: 'Schedule appointments',
      description: 'Schedule follow-up appointments with patients',
      dueDate: addDays(new Date(), 0).setHours(16, 0, 0),
      category: 'healthcare',
      priority: 'medium',
      completed: true
    },
    {
      id: 't4',
      title: 'Order medical supplies',
      description: 'Place order for next month\'s medical supplies',
      dueDate: addDays(new Date(), 3).setHours(12, 0, 0),
      category: 'healthcare',
      priority: 'low',
      completed: false
    }
  ];
};

// AI Scheduling component
const AIScheduling = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Event state
  const [events, setEvents] = useState(generateSampleEvents());
  const [tasks, setTasks] = useState(generateSampleTasks());
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Dialog state
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  
  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // Add 1 hour
    category: 'work',
    type: 'meeting',
    priority: 'medium',
    completed: false
  });
  
  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(new Date().setHours(17, 0, 0)), // Today 5 PM
    category: 'work',
    priority: 'medium',
    completed: false
  });
  
  // Notification state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // AI assist state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  // Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  // Generate AI suggestions (simulated)
  useEffect(() => {
    // In a real app, this would call an AI service
    const suggestions = [
      {
        type: 'schedule_optimization',
        message: 'You have multiple high-priority tasks due soon. Would you like to optimize your schedule?',
        action: 'Optimize Schedule'
      },
      {
        type: 'smart_reminder',
        message: 'Based on your previous activity, you might need to take a break during extended meetings.',
        action: 'Add Break Reminder'
      },
      {
        type: 'conflict_detection',
        message: 'There is a potential schedule conflict on Thursday. Would you like to resolve it?',
        action: 'Resolve Conflict'
      }
    ];
    
    setAiSuggestions(suggestions);
  }, [events, tasks]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // View mode change handler
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  // Date change handlers
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const handlePrevPeriod = () => {
    if (viewMode === 'day') {
      setSelectedDate(addDays(selectedDate, -1));
    } else {
      setSelectedDate(addDays(selectedDate, -7));
    }
  };
  
  const handleNextPeriod = () => {
    if (viewMode === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else {
      setSelectedDate(addDays(selectedDate, 7));
    }
  };
  
  const handleToday = () => {
    setSelectedDate(new Date());
  };
  
  // Get appropriate title for the current view
  const getViewTitle = () => {
    if (viewMode === 'day') {
      return format(selectedDate, 'EEEE, MMMM d, yyyy');
    } else {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  };

  // Dialog handlers
  const handleOpenEventDialog = () => {
    setOpenEventDialog(true);
  };
  
  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setNewEvent({
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
      category: 'work',
      type: 'meeting',
      priority: 'medium',
      completed: false
    });
  };
  
  const handleOpenTaskDialog = () => {
    setOpenTaskDialog(true);
  };
  
  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date(new Date().setHours(17, 0, 0)),
      category: 'work',
      priority: 'medium',
      completed: false
    });
  };
  
  const handleViewItem = (item) => {
    setViewItem(item);
    setOpenViewDialog(true);
  };
  
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewItem(null);
  };
  
  // Form change handlers
  const handleEventChange = (field) => (event) => {
    setNewEvent({
      ...newEvent,
      [field]: event.target.value
    });
  };
  
  const handleEventDateChange = (field) => (date) => {
    setNewEvent({
      ...newEvent,
      [field]: date
    });
  };
  
  const handleTaskChange = (field) => (event) => {
    setNewTask({
      ...newTask,
      [field]: event.target.value
    });
  };
  
  const handleTaskDateChange = (date) => {
    setNewTask({
      ...newTask,
      dueDate: date
    });
  };
  
  // Save handlers
  const handleSaveEvent = () => {
    if (!newEvent.title) {
      showSnackbar('Please enter an event title', 'error');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const eventId = `e${events.length + 1}`;
      const createdEvent = {
        id: eventId,
        ...newEvent
      };
      
      setEvents([...events, createdEvent]);
      
      // Close dialog and show success message
      handleCloseEventDialog();
      showSnackbar('Event created successfully!', 'success');
      setLoading(false);
    }, 1000);
  };
  
  const handleSaveTask = () => {
    if (!newTask.title) {
      showSnackbar('Please enter a task title', 'error');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const taskId = `t${tasks.length + 1}`;
      const createdTask = {
        id: taskId,
        ...newTask
      };
      
      setTasks([...tasks, createdTask]);
      
      // Close dialog and show success message
      handleCloseTaskDialog();
      showSnackbar('Task created successfully!', 'success');
      setLoading(false);
    }, 1000);
  };
  
  // Delete handlers
  const handleDeleteEvent = (eventId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      
      if (openViewDialog && viewItem && viewItem.id === eventId) {
        handleCloseViewDialog();
      }
      
      showSnackbar('Event deleted successfully', 'info');
      setLoading(false);
    }, 800);
  };
  
  const handleDeleteTask = (taskId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      if (openViewDialog && viewItem && viewItem.id === taskId) {
        handleCloseViewDialog();
      }
      
      showSnackbar('Task deleted successfully', 'info');
      setLoading(false);
    }, 800);
  };
  
  // Toggle task completion
  const handleToggleTaskComplete = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    );
    
    setTasks(updatedTasks);
    
    // Update viewItem if it's currently viewed
    if (openViewDialog && viewItem && viewItem.id === taskId) {
      setViewItem({
        ...viewItem,
        completed: !viewItem.completed
      });
    }
  };
  
  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  
  // Handle AI suggestion actions (simulated)
  const handleAiSuggestion = (suggestion) => {
    switch(suggestion.type) {
      case 'schedule_optimization':
        // Simulate schedule optimization
        setLoading(true);
        setTimeout(() => {
          // Reorder tasks based on priority and due date (simplified)
          const optimizedTasks = [...tasks].sort((a, b) => {
            // Sort by priority first
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            
            // If same priority, sort by due date
            if (priorityDiff === 0) {
              return new Date(a.dueDate) - new Date(b.dueDate);
            }
            
            return priorityDiff;
          });
          
          setTasks(optimizedTasks);
          setLoading(false);
          showSnackbar('Schedule optimized based on priorities and deadlines', 'success');
        }, 1500);
        break;
        
      case 'smart_reminder':
        // Add a break reminder
        setLoading(true);
        setTimeout(() => {
          // Find meetings longer than 1 hour
          const longMeetings = events.filter(event => 
            event.type === 'meeting' && 
            (new Date(event.endDate) - new Date(event.startDate)) > 60 * 60 * 1000
          );
          
          if (longMeetings.length > 0) {
            // Add break reminders
            const updatedEvents = [...events];
            longMeetings.forEach(meeting => {
              const meetingStart = new Date(meeting.startDate);
              const breakTime = new Date(meetingStart.getTime() + 45 * 60 * 1000); // 45 minutes into meeting
              
              updatedEvents.push({
                id: `br${events.length + 1}`,
                title: 'Take a short break',
                description: 'AI-suggested break during extended meeting',
                startDate: breakTime,
                endDate: new Date(breakTime.getTime() + 5 * 60 * 1000), // 5 minute break
                category: 'personal',
                type: 'reminder',
                priority: 'medium',
                completed: false
              });
            });
            
            setEvents(updatedEvents);
            showSnackbar('Break reminders added to your schedule', 'success');
          } else {
            showSnackbar('No long meetings found to add breaks to', 'info');
          }
          
          setLoading(false);
        }, 1200);
        break;
        
      case 'conflict_detection':
        // Resolve conflicts (simulated)
        setLoading(true);
        setTimeout(() => {
          // Find overlapping events on Thursday
          const thursday = addDays(startOfWeek(new Date()), 4);
          const conflictingEvents = events.filter(event => 
            isSameDay(new Date(event.startDate), thursday)
          );
          
          if (conflictingEvents.length > 1) {
            // Suggest reordering events
            const updatedEvents = events.map(event => {
              if (isSameDay(new Date(event.startDate), thursday)) {
                // Add 30 minutes to second event
                const secondEvent = conflictingEvents[1];
                if (event.id === secondEvent.id) {
                  const newStart = new Date(secondEvent.startDate);
                  newStart.setMinutes(newStart.getMinutes() + 30);
                  
                  const newEnd = new Date(secondEvent.endDate);
                  newEnd.setMinutes(newEnd.getMinutes() + 30);
                  
                  return {
                    ...event,
                    startDate: newStart,
                    endDate: newEnd
                  };
                }
              }
              return event;
            });
            
            setEvents(updatedEvents);
            showSnackbar('Schedule conflicts resolved by adjusting event times', 'success');
          } else {
            showSnackbar('No conflicts found in your schedule', 'info');
          }
          
          setLoading(false);
        }, 1500);
        break;
        
      default:
        showSnackbar('Action not implemented', 'warning');
    }
  };
  
  // Filter events for the selected date or week
  const getFilteredEvents = () => {
    if (viewMode === 'day') {
      return events.filter(event => 
        isSameDay(new Date(event.startDate), selectedDate)
      );
    } else {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      
      return events.filter(event => 
        isWithinInterval(new Date(event.startDate), {
          start: weekStart,
          end: weekEnd
        })
      );
    }
  };
  
  // Get count of events for a specific day (for calendar view)
  const getEventCountForDay = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), date)
    ).length;
  };
  
  // Get icon for event/task category
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : <MedicalServices />;
  };
  
  // Get icon for event type
  const getEventTypeIcon = (typeId) => {
    const type = eventTypes.find(t => t.id === typeId);
    return type ? type.icon : <Event />;
  };
  
  // Get color for priority
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.info.main;
    }
  };
  
  // Render Day view
  const renderDayView = () => {
    const dayEvents = getFilteredEvents();
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Events for {format(selectedDate, 'EEEE, MMMM d')}
        </Typography>
        
        {dayEvents.length > 0 ? (
          <Box>
            {dayEvents.map(event => (
              <TaskCard 
                key={event.id}
                priority={event.priority}
                completed={event.completed}
                onClick={() => handleViewItem(event)}
                sx={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    mr: 2,
                    bgcolor: `${theme.palette.background.paper}60`,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getEventTypeIcon(event.type)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{event.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTime sx={{ fontSize: '0.875rem', mr: 0.5, color: theme.palette.text.secondary }} />
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={categories.find(c => c.id === event.category)?.name || event.category} 
                        sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </TaskCard>
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            py: 4,
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: 2,
          }}>
            <Schedule sx={{ fontSize: 60, color: theme.palette.text.secondary, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No events scheduled for this day
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the + button to add a new event
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<Add />}
              onClick={handleOpenEventDialog}
            >
              Add Event
            </Button>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <Grid container spacing={2}>
        {weekDays.map((day) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={day.toString()}>
            <CalendarCell 
              isToday={isSameDay(day, new Date())}
              isSelected={isSameDay(day, selectedDate)}
              onClick={() => setSelectedDate(day)}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                {format(day, 'EEE, MMM d')}
                {getEventCountForDay(day) > 0 && (
                  <Chip 
                    size="small" 
                    label={getEventCountForDay(day)} 
                    color="primary" 
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Typography>
              
              <Divider sx={{ mb: 1 }} />
              
              {events
                .filter(event => isSameDay(new Date(event.startDate), day))
                .map(event => (
                  <EventPill 
                    key={event.id}
                    eventType={event.type}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewItem(event);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {format(new Date(event.startDate), 'h:mm a')} - {event.title}
                  </EventPill>
                ))
              }
              
              {events.filter(event => isSameDay(new Date(event.startDate), day)).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', textAlign: 'center', mt: 2 }}>
                  No events
                </Typography>
              )}
            </CalendarCell>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render task list
  const renderTasks = () => {
    // Split tasks into completed and pending
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tasks
          <Chip 
            size="small" 
            label={`${pendingTasks.length} pending`} 
            color="primary" 
            sx={{ ml: 1 }}
          />
        </Typography>
        
        {/* Pending tasks */}
        {pendingTasks.length > 0 ? (
          <Box>
            {pendingTasks.map(task => (
              <TaskCard 
                key={task.id}
                priority={task.priority}
                completed={task.completed}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox 
                    checked={task.completed}
                    onChange={() => handleToggleTaskComplete(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ ml: -1 }}
                  />
                  <Box sx={{ flex: 1 }} onClick={() => handleViewItem(task)}>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTime sx={{ fontSize: '0.875rem', mr: 0.5, color: theme.palette.text.secondary }} />
                      <Typography variant="body2" color="textSecondary">
                        Due: {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={categories.find(c => c.id === task.category)?.name || task.category} 
                        sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                      />
                      <Chip 
                        size="small" 
                        label={task.priority} 
                        color={
                          task.priority === 'high' 
                            ? 'error' 
                            : task.priority === 'medium' 
                              ? 'warning' 
                              : 'success'
                        }
                        sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </TaskCard>
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            py: 3,
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            mb: 3
          }}>
            <Typography variant="body1" color="text.secondary">
              No pending tasks
            </Typography>
          </Box>
        )}
        
        {/* Completed tasks section */}
        {completedTasks.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Completed Tasks
              <Chip 
                size="small" 
                label={completedTasks.length} 
                color="success" 
                sx={{ ml: 1 }}
              />
            </Typography>
            <Box>
              {completedTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  priority={task.priority}
                  completed={task.completed}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox 
                      checked={task.completed}
                      onChange={() => handleToggleTaskComplete(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ ml: -1 }}
                    />
                    <Box sx={{ flex: 1 }} onClick={() => handleViewItem(task)}>
                      <Typography variant="subtitle1">{task.title}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TaskCard>
              ))}
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      position: 'relative',
      background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
      pt: 2,
    }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          position: 'relative',
        }}>
          <IconButton 
            onClick={() => navigate('/dashboard')} 
            sx={{
              mr: 2,
              backgroundColor: 'white',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <GradientText variant="h4">
            AI Schedule Planning
          </GradientText>
        </Box>

        {/* AI Suggestions and Helper */}
        {showAiSuggestions && (
          <GlassCard sx={{ mb: 4, overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
              }}>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Psychology sx={{ mr: 1, color: theme.palette.primary.main }} />
                  AI Suggestions
                </Typography>
                <IconButton size="small" onClick={() => setShowAiSuggestions(false)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {aiSuggestions.map((suggestion, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: 2,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 5,
                        height: '100%',
                        backgroundColor: theme.palette.primary.main,
                      }
                    }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {suggestion.message}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleAiSuggestion(suggestion)}
                        sx={{
                          '&:hover': {
                            backgroundColor: `${theme.palette.primary.main}10`,
                          }
                        }}
                      >
                        {suggestion.action}
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </GlassCard>
        )}

        {/* Main content area with tabs */}
        <GlassCard>
          <CardContent sx={{ p: 0 }}>
            {/* View controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handlePrevPeriod}>
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton onClick={handleToday}>
                  <Today />
                </IconButton>
                <IconButton onClick={handleNextPeriod}>
                  <KeyboardArrowRight />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {getViewTitle()}
                </Typography>
              </Box>
              
              <Box>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && handleViewModeChange(newMode)}
                  size="small"
                  sx={{ mr: 2 }}
                >
                  <ToggleButton value="day">
                    <Today fontSize="small" sx={{ mr: 0.5 }} />
                    Day
                  </ToggleButton>
                  <ToggleButton value="week">
                    <ViewWeek fontSize="small" sx={{ mr: 0.5 }} />
                    Week
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={tabValue === 0 ? handleOpenEventDialog : handleOpenTaskDialog}
                  sx={{
                    borderRadius: '20px',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    px: 3,
                  }}
                >
                  {tabValue === 0 ? 'New Event' : 'New Task'}
                </Button>
              </Box>
            </Box>
            
            {/* Tab navigation */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiTab-root': {
                  minWidth: 160,
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                },
                '& .Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }}
            >
              <Tab 
                label="Calendar" 
                icon={<CalendarMonth />} 
                iconPosition="start"
              />
              <Tab 
                label="Tasks" 
                icon={<Description />} 
                iconPosition="start"
                sx={{ '& .MuiBadge-badge': { top: -8, right: -8 } }}
              />
            </Tabs>
            
            {/* Tab panels */}
            <Box sx={{ minHeight: 400 }}>
              {tabValue === 0 && (
                <Box>
                  {viewMode === 'day' ? renderDayView() : renderWeekView()}
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  {renderTasks()}
                </Box>
              )}
            </Box>
          </CardContent>
        </GlassCard>
      </Container>
      
      {/* Create Event Dialog */}
      <Dialog 
        open={openEventDialog} 
        onClose={handleCloseEventDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2,
        }}>
          Create New Event
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={newEvent.title}
                onChange={handleEventChange('title')}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={newEvent.description}
                onChange={handleEventChange('description')}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newEvent.startDate}
                  onChange={handleEventDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={newEvent.startDate}
                  onChange={handleEventDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={newEvent.endDate}
                  onChange={handleEventDateChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newEvent.category}
                  onChange={handleEventChange('category')}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{category.icon}</Box>
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.type}
                  onChange={handleEventChange('type')}
                  label="Event Type"
                >
                  {eventTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{type.icon}</Box>
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newEvent.priority}
                  onChange={handleEventChange('priority')}
                  label="Priority"
                >
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      High
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.warning.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      Low
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleCloseEventDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEvent}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          >
            {loading ? 'Saving...' : 'Save Event'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Task Dialog */}
      <Dialog 
        open={openTaskDialog} 
        onClose={handleCloseTaskDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2,
        }}>
          Create New Task
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={newTask.title}
                onChange={handleTaskChange('title')}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={newTask.description}
                onChange={handleTaskChange('description')}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={newTask.dueDate}
                  onChange={handleTaskDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Due Time"
                  value={newTask.dueDate}
                  onChange={handleTaskDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTask.category}
                  onChange={handleTaskChange('category')}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{category.icon}</Box>
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={handleTaskChange('priority')}
                  label="Priority"
                >
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      High
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.warning.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                      <StarOutline sx={{ mr: 1 }} />
                      Low
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleCloseTaskDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTask}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          >
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View Item Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        {viewItem && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6">
                {viewItem.title}
              </Typography>
              <IconButton size="small" onClick={handleCloseViewDialog}>
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  icon={viewItem.type ? getEventTypeIcon(viewItem.type) : <Work />} 
                  label={viewItem.type ? eventTypes.find(t => t.id === viewItem.type)?.name || viewItem.type : 'Task'} 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  icon={getCategoryIcon(viewItem.category)} 
                  label={categories.find(c => c.id === viewItem.category)?.name || viewItem.category} 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label={viewItem.priority} 
                  color={
                    viewItem.priority === 'high' 
                      ? 'error' 
                      : viewItem.priority === 'medium' 
                        ? 'warning' 
                        : 'success'
                  }
                  sx={{ mb: 1 }}
                />
                {viewItem.completed !== undefined && (
                  <Chip 
                    icon={viewItem.completed ? <CheckCircle /> : <EditCalendar />} 
                    label={viewItem.completed ? 'Completed' : 'Pending'}
                    color={viewItem.completed ? 'success' : 'default'}
                    sx={{ ml: 1, mb: 1 }}
                  />
                )}
              </Box>
              
              {viewItem.description && (
                <Typography variant="body1" paragraph>
                  {viewItem.description}
                </Typography>
              )}
              
              <Typography variant="subtitle2" sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <AccessTime sx={{ mr: 1, fontSize: 18 }} />
                {viewItem.startDate ? (
                  <>
                    {format(new Date(viewItem.startDate), 'EEEE, MMMM d, yyyy')} at {format(new Date(viewItem.startDate), 'h:mm a')}
                    {viewItem.endDate && (
                      <> - {format(new Date(viewItem.endDate), 'h:mm a')}</>
                    )}
                  </>
                ) : (
                  <>
                    Due: {format(new Date(viewItem.dueDate), 'EEEE, MMMM d, yyyy')} at {format(new Date(viewItem.dueDate), 'h:mm a')}
                  </>
                )}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              {viewItem.dueDate && ( // It's a task
                <Button
                  onClick={() => handleToggleTaskComplete(viewItem.id)}
                  variant="outlined"
                  color={viewItem.completed ? 'error' : 'success'}
                  startIcon={viewItem.completed ? <EditCalendar /> : <CheckCircle />}
                  sx={{ mr: 'auto', borderRadius: 2 }}
                >
                  {viewItem.completed ? 'Mark as Pending' : 'Mark as Complete'}
                </Button>
              )}
              <Button 
                onClick={() => viewItem.startDate ? handleDeleteEvent(viewItem.id) : handleDeleteTask(viewItem.id)}
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                sx={{ borderRadius: 2 }}
              >
                Delete
              </Button>
              <Button 
                onClick={handleCloseViewDialog}
                variant="contained"
                sx={{ borderRadius: 2, px: 3 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIScheduling; 