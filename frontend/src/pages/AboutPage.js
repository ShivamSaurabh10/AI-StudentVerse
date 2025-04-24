import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Lightbulb,
  Psychology,
  VerifiedUser,
  Speed,
  People,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

// Animation keyframes
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

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [inView, setInView] = useState({
    hero: false,
    story: false,
    values: false,
    team: false,
    cta: false
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Company values with enhanced animations
  const values = [
    {
      id: 1,
      title: 'Innovation',
      description: 'We push the boundaries of AI to create tools that transform how we understand communication.',
      icon: <Lightbulb fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      id: 2,
      title: 'Intelligence',
      description: 'Our solutions are built on cutting-edge machine learning models that provide meaningful insights.',
      icon: <Psychology fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      id: 3,
      title: 'Trust',
      description: 'We maintain the highest standards of data security and ethical AI development.',
      icon: <VerifiedUser fontSize="large" />,
      color: '#5e35b1',
    },
    {
      id: 4,
      title: 'Efficiency',
      description: 'We create tools that save time and improve outcomes in every conversation.',
      icon: <Speed fontSize="large" />,
      color: '#00897b',
    },
    {
      id: 5,
      title: 'Community',
      description: 'We believe in the power of connection and building solutions that bring people together.',
      icon: <People fontSize="large" />,
      color: '#d81b60',
    },
  ];

  // Team members with enhanced visuals
  const team = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Previously led AI research at Stanford NLP Lab. PhD in Computational Linguistics with a focus on conversational analysis.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Former tech lead at OpenAI. Specializes in building scalable AI systems and natural language processing models.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      role: 'Chief Medical Officer',
      bio: 'Board-certified psychiatrist with 15 years of clinical experience. Leads our healthcare applications research.',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'VP of Product',
      bio: 'Product leader with experience at Google and Amazon. Passionate about creating intuitive and impactful user experiences.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #040d21 0%, #0a2342 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BubbleContainer />

      <Navbar />
      
      {/* Hero Section */}
      <Box
        component="section"
        id="hero"
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textGlow} 3s infinite alternate`,
                  letterSpacing: 1,
                }}
              >
                Transforming Conversations with AI
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  opacity: 0.9,
                  color: alpha('#fff', 0.9),
                }}
              >
                We're on a mission to unlock the insights hidden in every conversation, empowering individuals and organizations to communicate better.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Box
        component="section"
        id="story"
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={inView.story} timeout={1000}>
                <Box>
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    fontWeight="bold"
                    sx={{
                      position: 'relative',
                      background: `linear-gradient(90deg, #ffffff, ${theme.palette.secondary.light})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: `${textGlow} 3s infinite alternate`,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '60px',
                        height: '4px',
                        background: theme.palette.secondary.main,
                        boxShadow: `0 0 10px ${theme.palette.secondary.main}`,
                      },
                    }}
                  >
                    Our Story
                  </Typography>
                  <Typography paragraph>
                    Founded in 2020, our journey began when our founders recognized a critical gap in how we understand and improve communication. With backgrounds spanning linguistics, psychology, and artificial intelligence, we set out to build a platform that could analyze conversations in ways that were previously impossible.
                  </Typography>
                  <Typography paragraph>
                    What started as a research project at Stanford University has evolved into a cutting-edge AI platform used by healthcare providers, businesses, and individuals around the world. Our technology has been refined through partnerships with leading institutions and extensive real-world testing.
                  </Typography>
                  <Typography>
                    Today, we're a team of 50+ researchers, engineers, and communication specialists dedicated to making every conversation count. We believe that better communication leads to better outcomes - whether that's in healthcare, business, or personal relationships.
                  </Typography>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in={inView.story} timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '300px', md: '400px' },
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                    animation: `${pulse} 6s infinite ease-in-out`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      borderRadius: '20px',
                      animation: `${borderGlow} 4s infinite ease-in-out`,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Our team collaborating"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.8)',
                      transition: 'transform 0.5s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values Section */}
      <Box
        component="section"
        id="values"
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Fade in={inView.values} timeout={1000}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textGlow} 3s infinite alternate`,
                }}
              >
                Our Values
              </Typography>
            </Fade>
            <Fade in={inView.values} timeout={1000} style={{ transitionDelay: '150ms' }}>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: '700px',
                  margin: '0 auto',
                  opacity: 0.9,
                }}
              >
                These principles guide everything we do - from product development to customer interactions
              </Typography>
            </Fade>
          </Box>

          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={value.id}>
                <Zoom in={inView.values} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: `rgba(13, 25, 54, 0.7)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(value.color, 0.3)}`,
                      boxShadow: `0 10px 30px ${alpha(value.color, 0.2)}`,
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: value.color,
                        boxShadow: `0 0 20px ${value.color}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          background: alpha(value.color, 0.1),
                          border: `2px solid ${alpha(value.color, 0.3)}`,
                          color: value.color,
                          animation: `${pulse} 4s infinite ease-in-out`,
                          boxShadow: `0 0 20px ${alpha(value.color, 0.5)}`,
                        }}
                      >
                        {value.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                          color: value.color,
                          textShadow: `0 0 10px ${alpha(value.color, 0.5)}`,
                        }}
                      >
                        {value.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ color: alpha('#fff', 0.7) }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box
        component="section"
        id="team"
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Fade in={inView.team} timeout={1000}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.secondary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textGlow} 3s infinite alternate`,
                }}
              >
                Our Team
              </Typography>
            </Fade>
            <Fade in={inView.team} timeout={1000} style={{ transitionDelay: '150ms' }}>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: '700px',
                  margin: '0 auto',
                  opacity: 0.9,
                }}
              >
                Meet the experts leading the way in conversational intelligence
              </Typography>
            </Fade>
          </Box>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Zoom in={inView.team} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -10 }}
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      background: `rgba(13, 25, 54, 0.7)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      boxShadow: `0 10px 30px rgba(0,0,0,0.3)`,
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        pt: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={member.image}
                        alt={member.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ position: 'relative' }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        fontWeight="bold"
                        sx={{ 
                          color: theme.palette.primary.light,
                          textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                          color: theme.palette.secondary.light,
                          fontWeight: 500,
                        }}
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        component="section"
        id="cta"
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Zoom in={inView.cta || true} timeout={1000}>
            <Box
              sx={{
                p: { xs: 4, md: 8 },
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.7)} 0%, ${alpha(theme.palette.secondary.dark, 0.7)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                animation: `${borderGlow} 4s infinite ease-in-out`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                  zIndex: -1,
                },
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, #ffffff, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${textGlow} 3s infinite alternate`,
                }}
              >
                Ready to transform your conversations?
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 4,
                  color: alpha('#fff', 0.9),
                }}
              >
                Join thousands of users who are discovering new insights in their daily communications
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<KeyboardArrowRight />}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${alpha(theme.palette.primary.main, 0.7)}`,
                  transition: 'all 0.3s',
                  animation: `${pulse} 3s infinite ease-in-out`,
                  '&:hover': {
                    boxShadow: `0 15px 40px rgba(0,0,0,0.4), 0 0 30px ${alpha(theme.palette.primary.main, 0.9)}`,
                  },
                }}
              >
                Get Started Free
              </Button>
            </Box>
          </Zoom>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 