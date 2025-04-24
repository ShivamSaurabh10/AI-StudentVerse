import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import {
  ArrowBack,
  SelfImprovement as MeditationIcon,
  Spa as StressIcon,
  Psychology as AnxietyIcon,
  Bedtime as SleepIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  VolumeUp as AudioIcon,
  FavoriteRounded as HeartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useThemeContext } from '../contexts/ThemeContext';

// Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 ${alpha('#3f51b5', 0.7)}; }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px ${alpha('#3f51b5', 0)}; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 ${alpha('#3f51b5', 0)}; }
`;

const breathe = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const gradientBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.25)',
  },
}));

const CategoryCard = styled(Card)(({ theme, color = 'primary' }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 16,
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  background: `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
  boxShadow: `0 10px 20px ${alpha(theme.palette[color].main, 0.3)}`,
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 15px 30px ${alpha(theme.palette[color].main, 0.4)}`,
    '& .MuiCardContent-root': {
      transform: 'translateY(5px)',
    },
    '& .category-icon': {
      transform: 'scale(1.1) rotate(5deg)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at 80% 20%, ${alpha(theme.palette[color].light, 0.6)}, transparent 70%)`,
    zIndex: 0,
  },
}));

const IconWrapper = styled(Box)(({ theme, color = 'primary' }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.background.paper, 0.2),
  backdropFilter: 'blur(5px)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  animation: `${float} 6s ease-in-out infinite`,
  '& .category-icon': {
    color: 'white',
    fontSize: 40,
    transition: 'all 0.3s ease',
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '5px',
    height: '100%',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

// Main component
const HealthManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mayoClinicContent, setMayoClinicContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // Category data
  const categories = [
    {
      id: 'stress',
      title: 'Stress Management',
      icon: <StressIcon className="category-icon" />,
      color: 'primary',
      description: 'Learn techniques to reduce stress and improve your mental wellbeing. Regular stress management practices can help lower blood pressure, reduce anxiety, and improve sleep quality.',
      tips: [
        'Practice deep breathing for 5 minutes daily',
        'Take short breaks during work to stretch',
        'Limit caffeine and alcohol intake',
        'Maintain a regular exercise routine',
        'Try progressive muscle relaxation before bed'
      ]
    },
    {
      id: 'meditation',
      title: 'Meditation',
      icon: <MeditationIcon className="category-icon" />,
      color: 'secondary',
      description: 'Discover the benefits of meditation for mental clarity and emotional balance. Regular meditation has been shown to reduce stress, improve concentration, and increase self-awareness.',
      tips: [
        'Start with just 10 minutes of meditation daily',
        'Focus on your breath as an anchor',
        'Try guided meditation apps for beginners',
        'Create a dedicated quiet space for practice',
        'Be patient with yourself as you develop the habit'
      ]
    },
    {
      id: 'anxiety',
      title: 'Overcoming Anxiety',
      icon: <AnxietyIcon className="category-icon" />,
      color: 'error',
      description: 'Find strategies to manage and reduce anxiety symptoms in daily life. Learning to cope with anxiety can improve your quality of life and help you respond better to stressful situations.',
      tips: [
        'Practice mindfulness to stay in the present moment',
        'Challenge negative thought patterns',
        'Maintain a consistent sleep schedule',
        'Limit exposure to triggering news and media',
        'Consider talking to a mental health professional'
      ]
    },
    {
      id: 'sleep',
      title: 'Healthy Sleep',
      icon: <SleepIcon className="category-icon" />,
      color: 'info',
      description: 'Improve your sleep quality with evidence-based techniques and habits. Quality sleep is essential for physical health, cognitive function, and emotional wellbeing.',
      tips: [
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Keep your bedroom cool, dark, and quiet',
        'Avoid screens 1 hour before bedtime',
        'Limit caffeine after noon and alcohol before bed'
      ]
    }
  ];

  // Mayo Clinic stress management content
  const stressManagementContent = {
    title: "Stress relievers: Tips to tame stress",
    source: "Mayo Clinic",
    sourceUrl: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-relievers/art-20047257",
    introduction: "Is stress making you angry and grouchy? Stress relievers can help bring back calm and peace to your busy life. You don't have to put a lot of time or thought into stress relievers. If your stress is getting out of control and you need quick relief, try one of these tips.",
    tips: [
      {
        title: "Get active",
        content: "Almost any form of physical activity can act as a stress reliever. Even if you're not an athlete or you're out of shape, exercise can still be a good stress reliever. Physical activity can pump up your feel-good endorphins and other natural neural chemicals that boost your sense of well-being. Exercise also can refocus your mind on your body's movements. This refocus can improve your mood and help the day's irritations fade away. So go on a walk, take a jog, work in your garden, clean your house, bike, swim, weight train, vacuum or do anything else that gets you active."
      },
      {
        title: "Eat a healthy diet",
        content: "Eating a healthy diet is an important part of taking care of yourself. Aim to eat many fruits, vegetables and whole grains."
      },
      {
        title: "Avoid unhealthy habits",
        content: "Some people may deal with stress with unhealthy habits. These may include drinking too much caffeine or alcohol, smoking, eating too much, or using illegal substances. These habits can harm your health and increase your stress levels."
      },
      {
        title: "Meditate",
        content: "During meditation, you focus your attention and quiet the stream of jumbled thoughts that may be crowding your mind and causing stress. Meditation can give you a sense of calm, peace and balance that can help both your emotional well-being and your overall health. Meditation can empower us to enhance our well-being. You can practice guided meditation, guided imagery, mindfulness, visualization and other forms of meditation anywhere at any time. For example, you could meditate when you're out for a walk, riding the bus to work or waiting at your health care provider's office. Try an app to show you how to do these exercises. And you can try deep breathing anywhere."
      },
      {
        title: "Laugh more",
        content: "A good sense of humor can't cure all ailments. But it can help you feel better, even if you have to force a fake laugh through your grumpiness. When you laugh, it lightens your mental load. It also causes positive physical changes in the body. Laughter fires up and then cools down your stress response. So read some jokes, tell some jokes, watch a comedy or hang out with your funny friends. Or give laughter yoga a try."
      },
      {
        title: "Connect with others",
        content: "When you're stressed and irritable, you may want to isolate yourself. Instead, reach out to family and friends and make social connections. Even one good friend who listens can make a difference. Social contact is a good stress reliever because it can offer distraction, give support, and help you put up with life's up and downs. So take a coffee break with a friend, email a relative or visit your place of worship. Got more time? Try volunteering for a charity and help yourself while helping others."
      },
      {
        title: "Assert yourself",
        content: "You might want to do it all, but you can't, at least not without paying a price. Learning to say no or being willing to delegate can help you manage your to-do list and your stress. Healthy boundaries are important in a wellness journey. Everyone has physical and emotional limits. Saying yes may seem like an easy way to keep the peace, prevent conflicts and get the job done right. But instead, it may cause you inner conflict because your needs and those of your family come second. Putting yourself second can lead to stress, anger, resentment and even the wish to take revenge. And that's not a very calm and peaceful reaction. Remember, you're a priority."
      },
      {
        title: "Try yoga",
        content: "With its series of postures and breathing exercises, yoga is a popular stress reliever. Yoga brings together physical and mental disciplines that may help you reach peace of body and mind. Yoga can help you relax and ease stress and anxiety. Try yoga on your own or find a class — you can find classes in many areas. Hatha yoga, especially, is a good stress reliever because of its slower pace and easier movements."
      },
      {
        title: "Get enough sleep",
        content: "Stress can cause you to have trouble falling asleep. When you have too much to do — and too much to think about — your sleep can suffer. But sleep is the time when your brain and body recharge. Most adults need about 7 to 9 hours of sleep each night. And how well and how long you sleep can affect your mood, energy level, focus and overall functioning. If you have sleep troubles, make sure that you have a quiet, relaxing bedtime routine. For example, listen to soothing music, make sure the area you sleep in is cool, dark and quiet, put phones and tablets away, and stick to a regular schedule."
      },
      {
        title: "Keep a journal",
        content: "Writing down your thoughts and feelings can be a good release for otherwise pent-up feelings. Don't think about what to write — let it happen. Write anything that comes to mind. No one else needs to read it. So don't aim for perfect grammar or spelling. Let your thoughts flow on paper, or on the computer screen. Once you're done, you can toss out what you wrote or save it to think about later."
      },
      {
        title: "Get musical and be creative",
        content: "Listening to or playing music is a good stress reliever. It can provide a mental distraction, lessen muscle tension and lower stress hormones. Turn up the volume and let your mind be absorbed by the music. If music isn't one of your interests, turn your attention to another hobby you enjoy. For example, try gardening, sewing, reading or sketching. Or try anything that makes you focus on what you're doing rather than what you think you should be doing."
      },
      {
        title: "Seek counseling",
        content: "If new stressors are making it hard for you to cope or if self-care measures aren't relieving your stress, you may want to think about therapy or counseling. Therapy also may be a good idea if you feel overwhelmed or trapped. You also may think about therapy if you worry a great deal, or if you have trouble carrying out daily routines or meeting duties at work, home or school. Professional counselors or therapists can help you find the sources of your stress and learn new coping tools."
      }
    ]
  };

  const handleCategoryClick = (category) => {
    if (category.id === 'stress') {
      // Show Mayo Clinic content for stress management
      setSelectedCategory(category);
      setMayoClinicContent(stressManagementContent);
      setOpenDialog(true);
    } else {
      // For other categories, show the regular dialog
      setSelectedCategory(category);
      setMayoClinicContent(null);
      setOpenDialog(true);
    }
  };

  const handleStartGuidedSession = () => {
    if (selectedCategory && selectedCategory.id === 'meditation') {
      setVideoOpen(true);
    } else if (selectedCategory && selectedCategory.id === 'anxiety') {
      setVideoOpen(true);
    } else if (selectedCategory && selectedCategory.id === 'sleep') {
      setVideoOpen(true);
    }
  };

  const handleCloseVideo = () => {
    setVideoOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setMayoClinicContent(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      position: 'relative',
      pt: 4, 
      pb: 8,
      background: isDarkMode 
        ? `linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)`
        : `linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)`,
      backgroundSize: '200% 200%',
      animation: `${gradientBg} 15s ease infinite`,
    }}>
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '5%', 
          left: '5%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, transparent 70%)`,
          zIndex: 0,
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '10%', 
          right: '5%',
          width: '250px', 
          height: '250px', 
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, transparent 70%)`,
          zIndex: 0,
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 6,
          position: 'relative',
        }}>
          <IconButton 
            onClick={() => navigate('/dashboard')} 
            sx={{
              mr: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(10px)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <GradientText variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Health Management
            </GradientText>
            <Typography variant="subtitle1" color="textSecondary">
              Improve your mental wellbeing with these evidence-based practices
            </Typography>
          </Box>
        </Box>

        {/* Quick Info Card */}
        <InfoCard sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <InfoIcon sx={{ color: theme.palette.info.main, fontSize: 40, mr: 2, mt: 1 }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                The Mind-Body Connection
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Mental health is a crucial component of your overall wellbeing. Research shows that practices like meditation, 
                stress management, and healthy sleep habits can significantly improve both mental and physical health outcomes.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <HeartIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.error.main }} />
                Taking care of your mental wellbeing can reduce risk of heart disease, lower blood pressure, and improve immune function.
              </Typography>
            </Box>
          </Box>
        </InfoCard>

        {/* Main Categories Grid */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Explore Health Management Categories
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {categories.map(category => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <CategoryCard color={category.color}>
                <CardActionArea 
                  onClick={() => handleCategoryClick(category)}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 3,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <IconWrapper color={category.color}>
                    {category.icon}
                  </IconWrapper>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center', mb: 1 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                    Click to explore
                  </Typography>
                </CardActionArea>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Section - Quick Tips */}
        <GlassCard sx={{ animation: `${breathe} 6s infinite ease-in-out` }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Daily Wellbeing Tip
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Practice the 5-5-5 breathing technique:</strong> Breathe in for 5 seconds, hold for 5 seconds, 
              and breathe out for 5 seconds. Repeat this cycle 5 times whenever you feel stressed or anxious.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This simple technique activates your parasympathetic nervous system, helping to reduce stress hormones 
              and bring your body into a more relaxed state.
            </Typography>
          </CardContent>
        </GlassCard>
      </Container>

      {/* Category Detail Dialog */}
      {selectedCategory && (
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }
          }}
        >
          <DialogTitle sx={{ 
            p: 3, 
            background: `linear-gradient(45deg, ${theme.palette[selectedCategory.color].main}, ${theme.palette[selectedCategory.color].dark})`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              mr: 2,
            }}>
              {selectedCategory.icon}
            </Box>
            <Typography variant="h5" component="div">
              {mayoClinicContent ? mayoClinicContent.title : selectedCategory.title}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {mayoClinicContent ? (
              <Box>
                <Typography variant="body1" paragraph>
                  {mayoClinicContent.introduction}
                </Typography>
                
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: theme.palette.text.secondary }}>
                  Source: <a href={mayoClinicContent.sourceUrl} target="_blank" rel="noopener noreferrer">{mayoClinicContent.source}</a>
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mt: 3 }}>
                  {mayoClinicContent.tips.map((tip, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 3,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette[selectedCategory.color].light, 0.1),
                        border: `1px solid ${alpha(theme.palette[selectedCategory.color].main, 0.2)}`,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1, color: theme.palette[selectedCategory.color].main }}>
                        {tip.title}
                      </Typography>
                      <Typography variant="body1">
                        {tip.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" paragraph>
                  {selectedCategory.description}
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
                  Top 5 Tips:
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {selectedCategory.tips.map((tip, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette[selectedCategory.color].light, 0.1),
                        border: `1px solid ${alpha(theme.palette[selectedCategory.color].main, 0.2)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette[selectedCategory.color].light, 0.2),
                          transform: 'translateX(5px)',
                        }
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        component="div" 
                        sx={{ 
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette[selectedCategory.color].main,
                          color: 'white',
                          fontSize: '0.875rem',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography variant="body1">
                        {tip}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ 
                  mt: 3, 
                  p: 3, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.info.light, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  <InfoIcon sx={{ color: theme.palette.info.main, mr: 2, mt: 0.5 }} />
                  <Typography variant="body2" color="textSecondary">
                    Remember that everyone's journey is different. It's okay to start small and build these practices 
                    gradually into your routine. Consistency is more important than intensity when developing 
                    healthy mental habits.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseDialog}
              sx={{ mr: 1 }}
            >
              Close
            </Button>
            {!mayoClinicContent && (
              <Button 
                variant="contained" 
                startIcon={<PlayIcon />}
                onClick={handleStartGuidedSession}
                sx={{ 
                  backgroundColor: theme.palette[selectedCategory.color].main,
                  '&:hover': {
                    backgroundColor: theme.palette[selectedCategory.color].dark,
                  }
                }}
              >
                Start Guided Session
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* YouTube Video Dialog */}
      <Dialog
        open={videoOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'black',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }
        }}
      >
        <Box sx={{ position: 'relative', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <IconButton
            onClick={handleCloseVideo}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={
              selectedCategory?.id === 'anxiety' 
                ? "https://www.youtube.com/embed/wvsAaZwzr6o?autoplay=1"
                : selectedCategory?.id === 'sleep'
                  ? "https://www.youtube.com/embed/fk-_SwHhLLc?autoplay=1" 
                  : "https://www.youtube.com/embed/ZToicYcHIOU?autoplay=1"
            }
            title={
              selectedCategory?.id === 'anxiety' 
                ? "Anxiety Relief Video" 
                : selectedCategory?.id === 'sleep'
                  ? "Sleep Meditation Video"
                  : "Meditation Video"
            }
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Box>
      </Dialog>
    </Box>
  );
};

export default HealthManagement; 