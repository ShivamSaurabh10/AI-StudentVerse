import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  TextField,
  Button,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  InsertEmoticon as EmojiIcon,
  Circle as CircleIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/DoctorLayout';
import { DoctorContext } from '../contexts/DoctorContext';

const Messages = () => {
  const theme = useTheme();
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState('');
  const { currentDoctorId } = useContext(DoctorContext) || { currentDoctorId: 1 };
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  // Doctor-specific chat data
  const doctorChats = {
    1: { // Dr. Sarah Wilson - Psychologist
      chats: [
        { id: 1, name: 'John Doe', lastMessage: 'Thank you for your help, Doctor.', time: '10:42 AM', avatar: '/avatar1.jpg', unread: 2, online: true },
        { id: 2, name: 'Sara Wilson', lastMessage: 'When should I schedule my next appointment?', time: 'Yesterday', avatar: '/avatar2.jpg', unread: 0, online: false },
        { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ve been feeling much better this week', time: 'Yesterday', avatar: '/avatar3.jpg', unread: 3, online: true },
        { id: 4, name: 'Emily Davis', lastMessage: 'The new meditation techniques are helping', time: 'Mon', avatar: '/avatar4.jpg', unread: 0, online: false },
        { id: 5, name: 'Robert Smith', lastMessage: 'Thanks for sending over the resources', time: 'Oct 15', avatar: '/avatar5.jpg', unread: 0, online: false },
      ],
      messages: {
        1: [
          { id: 1, sender: 'patient', text: 'Hello Dr. Wilson, I wanted to ask about the meditation techniques you mentioned last time.', time: '10:30 AM' },
          { id: 2, sender: 'doctor', text: 'Hi John, of course. What specific questions do you have?', time: '10:32 AM' },
          { id: 3, sender: 'patient', text: 'I\'ve been having trouble clearing my mind during the exercises. Do you have any tips?', time: '10:35 AM' },
          { id: 4, sender: 'doctor', text: 'That\'s very common. Try focusing on your breathing instead of trying to clear your mind completely. Count each breath and when your mind wanders, gently bring it back to counting.', time: '10:37 AM' },
          { id: 5, sender: 'patient', text: 'I\'ll try that approach. Should I still aim for 20 minutes each session?', time: '10:38 AM' },
          { id: 6, sender: 'doctor', text: 'Start with whatever feels comfortable, even if it\'s just 5 minutes. Consistency is more important than duration at first. You can gradually increase the time as it becomes easier.', time: '10:40 AM' },
          { id: 7, sender: 'patient', text: 'Thank you for your help, Doctor.', time: '10:42 AM' },
        ],
        2: [
          { id: 1, sender: 'patient', text: 'Hi Dr. Wilson, I\'ve completed the CBT exercises you recommended.', time: 'Yesterday, 2:30 PM' },
          { id: 2, sender: 'doctor', text: 'That\'s great to hear, Sara. How did you find them?', time: 'Yesterday, 3:15 PM' },
          { id: 3, sender: 'patient', text: 'They were challenging but helpful. I\'ve started noticing my negative thought patterns.', time: 'Yesterday, 3:20 PM' },
          { id: 4, sender: 'doctor', text: 'That\'s excellent progress! Recognition is the first step to changing those patterns.', time: 'Yesterday, 3:25 PM' },
          { id: 5, sender: 'patient', text: 'When should I schedule my next appointment?', time: 'Yesterday, 4:15 PM' },
        ]
      }
    },
    2: { // Dr. Robert Chen - Psychiatrist
      chats: [
        { id: 1, name: 'Kevin Moore', lastMessage: 'The new dosage seems to be working well', time: '9:15 AM', avatar: '/avatar8.jpg', unread: 1, online: true },
        { id: 2, name: 'Rachel Green', lastMessage: 'Should I continue with the same medication?', time: 'Yesterday', avatar: '/avatar9.jpg', unread: 0, online: false },
        { id: 3, name: 'Thomas Baker', lastMessage: 'I\'ve noticed some side effects we should discuss', time: '2 days ago', avatar: '/avatar10.jpg', unread: 2, online: false },
        { id: 4, name: 'Jennifer Lopez', lastMessage: 'My focus has improved significantly', time: 'Mon', avatar: '/avatar11.jpg', unread: 0, online: true },
        { id: 5, name: 'William Carter', lastMessage: 'Thank you for adjusting my prescription', time: 'Oct 18', avatar: '/avatar12.jpg', unread: 0, online: false },
      ],
      messages: {
        1: [
          { id: 1, sender: 'patient', text: 'Good morning Dr. Chen, I wanted to update you on the new medication.', time: '9:00 AM' },
          { id: 2, sender: 'doctor', text: 'Hi Kevin, I appreciate the update. How are you feeling on the new dosage?', time: '9:05 AM' },
          { id: 3, sender: 'patient', text: 'The new dosage seems to be working well. I\'m feeling more stable than before.', time: '9:15 AM' },
        ],
        2: [
          { id: 1, sender: 'doctor', text: 'Hi Rachel, how are you doing with the current medication?', time: 'Yesterday, 10:00 AM' },
          { id: 2, sender: 'patient', text: 'I\'m feeling better, but still have some anxiety in social situations.', time: 'Yesterday, 10:30 AM' },
          { id: 3, sender: 'doctor', text: 'That\'s good progress. The medication might need more time to reach full effectiveness.', time: 'Yesterday, 10:45 AM' },
          { id: 4, sender: 'patient', text: 'Should I continue with the same medication?', time: 'Yesterday, 11:15 AM' },
        ]
      }
    },
    3: { // Dr. Emily Rodriguez - Neurologist
      chats: [
        { id: 1, name: 'Christopher Miller', lastMessage: 'The seizure frequency has decreased', time: '1 hour ago', avatar: '/avatar15.jpg', unread: 0, online: true },
        { id: 2, name: 'Olivia Parker', lastMessage: 'My headaches are less intense now', time: 'Yesterday', avatar: '/avatar16.jpg', unread: 1, online: false },
        { id: 3, name: 'George Washington', lastMessage: 'The physical therapy exercises are helping', time: '3 days ago', avatar: '/avatar17.jpg', unread: 0, online: false },
        { id: 4, name: 'Patricia Evans', lastMessage: 'When should I schedule my next MRI?', time: 'Mon', avatar: '/avatar18.jpg', unread: 3, online: true },
      ],
      messages: {
        1: [
          { id: 1, sender: 'patient', text: 'Hello Dr. Rodriguez, I wanted to give you an update on my condition.', time: '12:15 PM' },
          { id: 2, sender: 'doctor', text: 'Hi Christopher, I\'m glad to hear from you. How have things been since our last appointment?', time: '12:20 PM' },
          { id: 3, sender: 'patient', text: 'The seizure frequency has decreased from 3-4 per week to just 1 this past week.', time: '1:05 PM' },
        ],
        2: [
          { id: 1, sender: 'patient', text: 'Dr. Rodriguez, I\'ve been tracking my migraines as you suggested.', time: 'Yesterday, 9:10 AM' },
          { id: 2, sender: 'doctor', text: 'That\'s excellent, Olivia. What patterns have you noticed?', time: 'Yesterday, 9:30 AM' },
          { id: 3, sender: 'patient', text: 'They seem to be triggered by lack of sleep and stress at work.', time: 'Yesterday, 10:00 AM' },
          { id: 4, sender: 'doctor', text: 'Those are common triggers. How are the preventive medications working?', time: 'Yesterday, 10:15 AM' },
          { id: 5, sender: 'patient', text: 'My headaches are less intense now, though still occurring about once a week.', time: 'Yesterday, 10:45 AM' },
        ]
      }
    }
  };

  // Update chats when doctor changes
  useEffect(() => {
    const doctorData = doctorChats[currentDoctorId] || doctorChats[1];
    setChats(doctorData.chats);
    
    // Reset selected chat to first chat in the list
    if (doctorData.chats.length > 0) {
      const firstChatId = doctorData.chats[0].id;
      setSelectedChat(firstChatId);
      setChatMessages(doctorData.messages[firstChatId] || []);
    } else {
      setSelectedChat(null);
      setChatMessages([]);
    }
  }, [currentDoctorId]);

  // Update messages when selected chat changes
  useEffect(() => {
    const doctorData = doctorChats[currentDoctorId] || doctorChats[1];
    setChatMessages(doctorData.messages[selectedChat] || []);
  }, [selectedChat, currentDoctorId]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Create a new message from the doctor
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'doctor',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add the new message to the chat messages
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      
      // Update the last message in the chat list
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat) {
          return {
            ...chat,
            lastMessage: messageText,
            time: 'Just now'
          };
        }
        return chat;
      });
      setChats(updatedChats);
      
      // Clear the input field
      setMessageText('');
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
  };

  return (
    <DoctorLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          Messages
        </Typography>
        
        <Grid container spacing={3}>
          {/* Chat List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2, height: '75vh', display: 'flex', flexDirection: 'column' }}>
              {/* Search Bar */}
              <Box sx={{ p: 2 }}>
                <TextField
                  placeholder="Search conversations..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <FilterIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Divider />
              
              {/* Chat List */}
              <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                {chats.map((chat) => (
                  <React.Fragment key={chat.id}>
                    <ListItem 
                      alignItems="flex-start"
                      onClick={() => handleChatSelect(chat.id)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedChat === chat.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        '&:hover': {
                          bgcolor: selectedChat === chat.id ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                        },
                        py: 1.5,
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            chat.online ? 
                              <CircleIcon sx={{ color: 'success.main', fontSize: 12, bgcolor: 'white', borderRadius: '50%' }} /> : 
                              null
                          }
                        >
                          <Avatar 
                            src={chat.avatar}
                            alt={chat.name}
                            sx={{ width: 50, height: 50 }}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {chat.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {chat.time}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                maxWidth: '180px'
                              }}
                            >
                              {chat.lastMessage}
                            </Typography>
                            {chat.unread > 0 && (
                              <Badge 
                                badgeContent={chat.unread} 
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
          
          {/* Chat Window */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2, height: '75vh', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      chats.find(c => c.id === selectedChat)?.online ? 
                        <CircleIcon sx={{ color: 'success.main', fontSize: 12, bgcolor: 'white', borderRadius: '50%' }} /> : 
                        null
                    }
                  >
                    <Avatar 
                      src={chats.find(c => c.id === selectedChat)?.avatar}
                      alt={chats.find(c => c.id === selectedChat)?.name}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                  </Badge>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {chats.find(c => c.id === selectedChat)?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton color="primary">
                    <PhoneIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <VideocamIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Messages */}
              <Box sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}>
                {chatMessages.map((message) => (
                  <Box 
                    key={message.id}
                    sx={{ 
                      alignSelf: message.sender === 'doctor' ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: message.sender === 'doctor' ? theme.palette.primary.main : alpha(theme.palette.grey[100], 0.95),
                        color: message.sender === 'doctor' ? 'white' : 'text.primary',
                        borderRadius: 2,
                        p: 1.5,
                        boxShadow: message.sender === 'doctor' ? '0 2px 5px rgba(0, 0, 0, 0.1)' : 'none',
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {message.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {/* Message Input */}
              <Box sx={{ 
                p: 2, 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <EmojiIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DoctorLayout>
  );
};

export default Messages; 