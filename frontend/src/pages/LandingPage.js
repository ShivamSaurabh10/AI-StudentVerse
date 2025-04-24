import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Link,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slide,
  Fade,
  Grow,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  EmojiEmotions as EmojiIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  AccessTime as AccessTimeIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Explore as ExploreIcon,
  AutoGraph as AutoGraphIcon,
  Api as ApiIcon,
  Cloud as CloudIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { keyframes } from '@mui/system';
import { alpha } from '@mui/material/styles';

// Animation keyframes
const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, 15px) rotate(5deg); }
  50% { transform: translate(0, 30px) rotate(0deg); }
  75% { transform: translate(-10px, 15px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const runningLine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// RunningLine component for animated accents
const RunningLine = ({ color, duration = 3, delay = 0 }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '2px',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          height: '100%',
          width: '50%',
          background: `linear-gradient(90deg, transparent, ${color || theme.palette.primary.main}, transparent)`,
          animation: `${runningLine} ${duration}s linear ${delay}s infinite`,
        },
      }}
    />
  );
};

// Enhanced Bubble component with more dynamic animations
const Bubble = ({ size, color, top, left, delay, duration, opacity = 0.6 }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color || theme.palette.primary.light}, transparent)`,
        opacity: opacity,
        top: `${top}%`,
        left: `${left}%`,
        animation: `${float} ${duration || 15}s ease-in-out ${delay || 0}s infinite`,
        zIndex: 0,
        backdropFilter: 'blur(5px)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          background: 'inherit',
          borderRadius: '50%',
          filter: 'blur(10px)',
          animation: `${pulse} ${duration / 2 || 7.5}s ease-in-out ${delay || 0}s infinite`,
        },
      }}
    />
  );
};

// Enhanced BubbleContainer with more dynamic bubbles
const BubbleContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const bubbles = Array.from({ length: isMobile ? 8 : 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    color: i % 3 === 0 
      ? theme.palette.primary.light 
      : i % 3 === 1 
        ? theme.palette.secondary.light 
        : theme.palette.success.light,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.3 + 0.3,
  }));
  
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          size={bubble.size}
          color={bubble.color}
          top={bubble.top}
          left={bubble.left}
          delay={bubble.delay}
          duration={bubble.duration}
          opacity={bubble.opacity}
        />
      ))}
    </Box>
  );
};

// Enhanced FeatureCard with animations
const FeatureCard = ({ icon, title, description, index }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Grow in={isVisible} timeout={500}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: theme.shadows[8],
          },
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          overflow: 'hidden',
        }}
      >
        <RunningLine color={theme.palette.primary.main} duration={4} delay={index} />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              animation: `${float} 3s ease-in-out infinite`,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h3" align="center" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Enhanced PricingCard with animations
const PricingCard = ({ title, price, period, features, isPopular, onSelect, index }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <Slide direction="up" in={isVisible} timeout={500}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          border: isPopular ? `2px solid ${theme.palette.primary.main}` : '1px solid',
          borderColor: isPopular ? 'primary.main' : 'divider',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: theme.shadows[8],
          },
          overflow: 'hidden',
        }}
      >
        <RunningLine color={theme.palette.secondary.main} duration={5} delay={index} />
        {isPopular && (
          <Chip
            label="Most Popular"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontWeight: 'bold',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center" fontWeight="bold">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 3 }}>
            <Typography variant="h3" component="span" fontWeight="bold">
              ${price}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
              /{period}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <List sx={{ mb: 3 }}>
            {features.map((feature, idx) => (
              <Fade in={true} timeout={500 + idx * 100} key={idx}>
                <ListItem disableGutters sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              </Fade>
            ))}
          </List>
          <Button
            variant={isPopular ? "contained" : "outlined"}
            fullWidth
            size="large"
            onClick={onSelect}
            sx={{
              mt: 'auto',
              py: 1.5,
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
                animation: `${runningLine} 2s linear infinite`,
              },
            }}
          >
            {isPopular ? "Get Started" : "Select Plan"}
          </Button>
        </CardContent>
      </Card>
    </Slide>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [activeSlide, setActiveSlide] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    pricing: false,
    cta: false,
    detailedFeatures: false,
    reviews: false,
  });

  // Avatar images for reviews
  const avatarImages = [
    "https://mui.com/static/images/avatar/1.jpg", // Female professional
    "https://mui.com/static/images/avatar/2.jpg", // Male professional
    "https://mui.com/static/images/avatar/3.jpg", // Female casual
    "https://mui.com/static/images/avatar/4.jpg", // Male casual
    "https://mui.com/static/images/avatar/5.jpg", // Female business
    "https://mui.com/static/images/avatar/6.jpg", // Male business
  ];

  useEffect(() => {
    // Trigger visibility animations on mount
    setIsVisible({
      hero: true,
      features: true,
      pricing: true,
      cta: true,
      detailedFeatures: true,
      reviews: true,
    });

    // Auto-slide feature highlights
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBillingPeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setBillingPeriod(newPeriod);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const pricingPlans = [
    {
      title: 'Starter',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 1,000 conversations/month',
        'Basic sentiment analysis',
        'Standard response time',
        'Email support',
        '1 user account',
      ],
      isPopular: false,
    },
    {
      title: 'Professional',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Up to 10,000 conversations/month',
        'Advanced sentiment analysis',
        'Priority response time',
        'Email & chat support',
        '5 user accounts',
        'API access',
        'Custom dashboards',
      ],
      isPopular: true,
    },
    {
      title: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unlimited conversations',
        'AI-powered insights',
        '24/7 priority support',
        'Unlimited user accounts',
        'Advanced API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      isPopular: false,
    },
  ];

  const detailedFeatures = {
    'AI & Analysis': [
      {
        title: 'Natural Language Processing',
        description: 'Our advanced NLP algorithms understand context, sentiment, and intent in conversations, providing deeper insights than traditional analysis tools.',
        icon: <PsychologyIcon />,
      },
      {
        title: 'Emotion Recognition',
        description: 'Detect and track emotional patterns across conversations to understand customer satisfaction and identify potential issues before they escalate.',
        icon: <EmojiIcon />,
      },
      {
        title: 'Sentiment Analysis',
        description: 'Gauge the overall sentiment of conversations to quickly identify positive and negative trends in customer interactions.',
        icon: <AutoGraphIcon />,
      },
      {
        title: 'Intent Classification',
        description: 'Automatically categorize conversations based on customer intent to streamline routing and response processes.',
        icon: <PsychologyIcon />,
      },
    ],
    'Performance & Integration': [
      {
        title: 'Real-time Processing',
        description: 'Analyze conversations as they happen with our lightning-fast processing engine, providing immediate insights and alerts.',
        icon: <SpeedIcon />,
      },
      {
        title: 'API Access',
        description: 'Integrate our powerful analysis tools into your existing systems with our comprehensive REST API and SDKs.',
        icon: <ApiIcon />,
      },
      {
        title: 'Cloud Infrastructure',
        description: 'Built on scalable cloud architecture to handle conversations of any volume, from small businesses to enterprise-level operations.',
        icon: <CloudIcon />,
      },
      {
        title: 'Custom Dashboards',
        description: 'Create personalized dashboards to visualize the metrics that matter most to your organization.',
        icon: <DashboardIcon />,
      },
    ],
    'Security & Compliance': [
      {
        title: 'End-to-End Encryption',
        description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols to ensure maximum security.',
        icon: <SecurityIcon />,
      },
      {
        title: 'Data Retention Controls',
        description: 'Configure how long your data is stored with flexible retention policies that comply with your regulatory requirements.',
        icon: <StorageIcon />,
      },
      {
        title: 'Role-Based Access',
        description: 'Control who can access your conversation data with granular permission settings and role-based access controls.',
        icon: <GroupIcon />,
      },
      {
        title: 'Compliance Certifications',
        description: 'Our platform maintains compliance with major regulatory frameworks including GDPR, CCPA, and SOC 2.',
        icon: <SettingsIcon />,
      },
    ],
  };

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Marketing Director",
      image: avatarImages[0],
      comment: "This platform has transformed how we understand customer interactions. The AI insights are incredibly accurate and have helped us improve our communication strategy significantly.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Customer Success Manager",
      image: avatarImages[1],
      comment: "The emotion recognition feature is a game-changer. We can now identify issues before they escalate and address customer concerns proactively. This has improved our satisfaction scores by 22%.",
      rating: 4.5
    },
    {
      id: 3,
      name: "David Williams",
      position: "Sales Director",
      image: avatarImages[3],
      comment: "Since implementing this platform, our sales team's communication effectiveness has improved by 35%. The real-time insights have helped us close deals faster and build stronger relationships.",
      rating: 5
    },
    {
      id: 4,
      name: "Emma Davis",
      position: "Support Team Lead",
      image: avatarImages[2],
      comment: "The sentiment analysis helps us prioritize urgent cases and has improved our response time significantly. Our team is more efficient and our customers are happier. Highly recommend.",
      rating: 4.5
    },
    {
      id: 5,
      name: "Thomas Rodriguez",
      position: "CEO, TechStart Inc.",
      image: avatarImages[5],
      comment: "Worth every penny. The insights we've gained have directly contributed to improved customer satisfaction and retention rates. The platform has paid for itself within the first quarter.",
      rating: 5
    },
    {
      id: 6,
      name: "Olivia Wilson",
      position: "UX Researcher",
      image: avatarImages[4],
      comment: "The analysis tools have given us unprecedented insight into how users respond emotionally to our products. Essential for any user-focused team looking to create better experiences.",
      rating: 4
    },
  ];

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Get visible reviews (current, previous, next)
  const getVisibleReviews = () => {
    const total = reviews.length;
    const prev = activeReviewIndex === 0 ? total - 1 : activeReviewIndex - 1;
    const next = activeReviewIndex === total - 1 ? 0 : activeReviewIndex + 1;
    
    return {
      prev: reviews[prev],
      current: reviews[activeReviewIndex],
      next: reviews[next]
    };
  };

  // Star Rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
        ))}
        {hasHalfStar && <StarHalfIcon sx={{ color: theme.palette.warning.main, mr: 0.5 }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarBorderIcon key={`empty-${i}`} sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Slide direction="down" in={isVisible.hero} timeout={1000}>
        <Box
          id="hero-section"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            mt: '64px',
          }}
        >
          <BubbleContainer />
          <RunningLine color="rgba(255,255,255,0.2)" duration={8} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Fade in={isVisible.hero} timeout={1500}>
                  <Box>
                    <Typography
                      variant="h2"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: '80px',
                          height: '4px',
                          background: theme.palette.secondary.main,
                          animation: `${runningLine} 3s linear infinite`,
                        },
                      }}
                    >
                      Conversational Intelligence Platform
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ 
                        mb: 4, 
                        opacity: 0.9,
                        background: `linear-gradient(90deg, ${theme.palette.common.white}, ${alpha(theme.palette.common.white, 0.8)})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Transform your conversations with advanced AI analysis
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-3px)',
                          },
                          position: 'relative',
                          zIndex: 1,
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
                            animation: `${runningLine} 2s linear infinite`,
                          },
                        }}
                      >
                        Try Real-time Analysis
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ExploreIcon />}
                        onClick={() => navigate('/features')}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-3px)',
                          },
                          position: 'relative',
                          zIndex: 1,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Explore Features
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Fade in={isVisible.hero} timeout={2000}>
                  <Box
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '120%',
                        height: '120%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%)',
                        animation: `${pulse} 3s ease-in-out infinite`,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/hero-image.svg"
                      alt="Conversational Intelligence"
                      sx={{
                        width: '100%',
                        maxWidth: 600,
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1,
                        animation: `${float} 6s ease-in-out infinite`,
                      }}
                    />
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Slide>

      {/* Feature Highlights Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative' }}>
        <BubbleContainer />
        <RunningLine color={alpha(theme.palette.primary.main, 0.2)} duration={5} />
        <Fade in={isVisible.features} timeout={1000}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: theme.palette.primary.main,
                  borderRadius: '2px',
                },
              }}
            >
              Key Capabilities
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<PsychologyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
                  title="Advanced NLP"
                  description="State-of-the-art natural language processing for accurate conversation analysis"
                  index={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<EmojiIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />}
                  title="Emotion Recognition"
                  description="Detect and analyze emotional patterns in conversations"
                  index={1}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<TimelineIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />}
                  title="Real-time Analysis"
                  description="Get instant insights as conversations happen"
                  index={2}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<SpeedIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />}
                  title="Fast & Efficient"
                  description="Lightning-fast processing with minimal latency"
                  index={3}
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* Features Section */}
      <Box
        id="features-section"
        sx={{
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BubbleContainer />
        <RunningLine color={alpha(theme.palette.secondary.main, 0.2)} duration={6} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible.features} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                component="h2"
                align="center"
                gutterBottom
                sx={{ 
                  mb: 6,
                  fontWeight: 700,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: theme.palette.primary.main,
                    borderRadius: '2px',
                  },
                }}
              >
                Explore Our Features in Detail
              </Typography>
              
              <Paper 
                sx={{ 
                  mb: 4,
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={isMobile ? "fullWidth" : "standard"}
                  centered={!isMobile}
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    '& .MuiTab-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <Tab 
                    label="AI & Analysis" 
                    sx={{ 
                      fontWeight: tabValue === 0 ? 600 : 400,
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Tab 
                    label="Performance & Integration" 
                    sx={{ 
                      fontWeight: tabValue === 1 ? 600 : 400,
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Tab 
                    label="Security & Compliance" 
                    sx={{ 
                      fontWeight: tabValue === 2 ? 600 : 400,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Tabs>
                
                {Object.keys(detailedFeatures).map((category, index) => (
                  <TabPanel key={index} value={tabValue} index={index}>
                    <Grid container spacing={4}>
                      {detailedFeatures[category].map((feature, featureIndex) => (
                        <Grid item xs={12} md={6} key={featureIndex}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: theme.shadows[8],
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box 
                                  sx={{ 
                                    mr: 2, 
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'rotate(15deg)',
                                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                  }}
                                >
                                  {feature.icon}
                                </Box>
                                <Typography 
                                  variant="h6" 
                                  component="h3"
                                  sx={{ 
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ 
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    color: 'text.primary',
                                  },
                                }}
                              >
                                {feature.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                ))}
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/features')}
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    boxShadow: theme.shadows[3],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  View All Features
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box 
        id="pricing-section"
        sx={{ py: 8, bgcolor: 'grey.50', position: 'relative' }}
      >
        <BubbleContainer />
        <RunningLine color={alpha(theme.palette.secondary.main, 0.2)} duration={6} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible.pricing} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 6,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: theme.palette.secondary.main,
                    borderRadius: '2px',
                  },
                }}
              >
                Simple, Transparent Pricing
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                <ToggleButtonGroup
                  value={billingPeriod}
                  exclusive
                  onChange={handleBillingPeriodChange}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[1],
                    borderRadius: 2,
                    '& .MuiToggleButton-root': {
                      px: 4,
                      py: 1,
                      border: 'none',
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="annual">Annual (Save 20%)</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Grid container spacing={4} alignItems="center">
                {pricingPlans.map((plan, index) => (
                  <Grid item xs={12} md={4} key={plan.title}>
                    <PricingCard
                      title={plan.title}
                      price={billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                      period={billingPeriod === 'monthly' ? 'month' : 'year'}
                      features={plan.features}
                      isPopular={plan.isPopular}
                      onSelect={() => navigate('/signup', { state: { plan: plan.title, billing: billingPeriod } })}
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        id="cta-section"
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BubbleContainer />
        <RunningLine color="rgba(255,255,255,0.2)" duration={4} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible.cta} timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: `linear-gradient(90deg, ${theme.palette.common.white}, ${alpha(theme.palette.common.white, 0.8)})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Transform Your Conversations Today
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Start analyzing your conversations in real-time or explore historical data
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
                      animation: `${runningLine} 2s linear infinite`,
                    },
                  }}
                >
                  Try Real-time Analysis
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/history')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  View History
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Box
        id="reviews-section"
        sx={{
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <BubbleContainer />
        <RunningLine color={alpha(theme.palette.success.main, 0.2)} duration={7} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isVisible.reviews} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '4px',
                    background: theme.palette.success.main,
                    borderRadius: '2px',
                  },
                }}
              >
                Student's Reviews
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
              >
                See what our customers are saying about their experience with our conversation intelligence platform
              </Typography>
              
              {/* Average Rating */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                <Paper 
                  sx={{ 
                    py: 2, 
                    px: 4, 
                    borderRadius: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: theme.shadows[3],
                    backgroundColor: alpha(theme.palette.success.light, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <StarRating rating={4.8} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      ml: 2, 
                      fontWeight: 'bold',
                      color: theme.palette.success.dark,
                    }}
                  >
                    4.8 out of 5
                  </Typography>
                </Paper>
              </Box>
              
              {/* Reviews Carousel */}
              <Box sx={{ 
                position: 'relative', 
                height: { xs: 400, md: 300 },
                mb: 4,
              }}>
                {/* Previous and Next buttons */}
                <IconButton
                  onClick={handlePrevReview}
                  sx={{
                    position: 'absolute',
                    left: { xs: '50%', md: -20 },
                    top: { xs: 'auto', md: '50%' },
                    bottom: { xs: -60, md: 'auto' },
                    transform: { 
                      xs: 'translateX(-60px)', 
                      md: 'translateY(-50%)' 
                    },
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: 'all 0.3s ease',
                    animation: `${float} 3s infinite ease-in-out`,
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                
                <IconButton
                  onClick={handleNextReview}
                  sx={{
                    position: 'absolute',
                    right: { xs: '50%', md: -20 },
                    top: { xs: 'auto', md: '50%' },
                    bottom: { xs: -60, md: 'auto' },
                    transform: { 
                      xs: 'translateX(60px)', 
                      md: 'translateY(-50%)' 
                    },
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: 'all 0.3s ease',
                    animation: `${float} 3s infinite ease-in-out 1s`,
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
                
                {/* Reviews */}
                <Box sx={{ 
                  position: 'relative', 
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden',
                }}>
                  {/* Current Review */}
                  <Fade key={`review-${activeReviewIndex}`} in={true} timeout={500}>
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: { xs: '100%', md: '70%' },
                        height: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 4,
                        zIndex: 5,
                        boxShadow: theme.shadows[10],
                        borderRadius: 4,
                        transition: 'all 0.5s ease',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: { xs: 100, md: 120 },
                          height: { xs: 100, md: 120 },
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: `4px solid ${theme.palette.primary.main}`,
                          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                          animation: `${pulse} 3s infinite`,
                        }}
                      >
                        <Box
                          component="img"
                          src={getVisibleReviews().current.image}
                          alt={getVisibleReviews().current.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            // Fallback if image doesn't load
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getVisibleReviews().current.name)}&background=random`;
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <StarRating rating={getVisibleReviews().current.rating} />
                        </Box>
                        <Typography 
                          variant="body1" 
                          paragraph 
                          sx={{ 
                            fontStyle: 'italic',
                            mb: 2,
                            position: 'relative',
                            pl: 2,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              fontSize: '2rem',
                              top: -15,
                              left: -5,
                              color: alpha(theme.palette.primary.main, 0.3),
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              fontSize: '2rem',
                              bottom: -20,
                              color: alpha(theme.palette.primary.main, 0.3),
                            }
                          }}
                        >
                          {getVisibleReviews().current.comment}
                        </Typography>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {getVisibleReviews().current.name}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            {getVisibleReviews().current.position}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                  
                  {/* Previous Review (partially visible) */}
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      left: { xs: '50%', md: '5%' },
                      transform: { 
                        xs: 'translateX(-50%) scale(0.85)', 
                        md: 'translateX(0) scale(0.85)' 
                      },
                      width: { xs: '80%', md: '30%' },
                      height: '70%',
                      p: 3,
                      opacity: 0.7,
                      filter: 'blur(1px)',
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 1,
                      boxShadow: theme.shadows[3],
                      borderRadius: 4,
                      transition: 'all 0.5s ease',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
                      backdropFilter: 'blur(5px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${theme.palette.primary.main}`,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={getVisibleReviews().prev.image}
                        alt={getVisibleReviews().prev.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getVisibleReviews().prev.name)}&background=random`;
                        }}
                      />
                    </Box>
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                      {getVisibleReviews().prev.name}
                    </Typography>
                  </Paper>
                  
                  {/* Next Review (partially visible) */}
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      right: { xs: '50%', md: '5%' },
                      transform: { 
                        xs: 'translateX(50%) scale(0.85)', 
                        md: 'translateX(0) scale(0.85)' 
                      },
                      width: { xs: '80%', md: '30%' },
                      height: '70%',
                      p: 3,
                      opacity: 0.7,
                      filter: 'blur(1px)',
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 1,
                      boxShadow: theme.shadows[3],
                      borderRadius: 4,
                      transition: 'all 0.5s ease',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`,
                      backdropFilter: 'blur(5px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${theme.palette.primary.main}`,
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={getVisibleReviews().next.image}
                        alt={getVisibleReviews().next.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getVisibleReviews().next.name)}&background=random`;
                        }}
                      />
                    </Box>
                    <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                      {getVisibleReviews().next.name}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
              
              {/* Review Navigation Indicators */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {reviews.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setActiveReviewIndex(index)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: index === activeReviewIndex ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        bgcolor: alpha(theme.palette.primary.main, 0.7),
                      },
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/testimonials')}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderWidth: 2,
                    },
                  }}
                >
                  View All Reviews
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.grey[900],
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BubbleContainer />
        <RunningLine color={alpha(theme.palette.primary.main, 0.3)} duration={6} />
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Conversational Intelligence
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
                Transform your conversations with advanced AI analysis and real-time insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Home
                  </Button>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/features')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Features
                  </Button>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/pricing')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Pricing
                  </Button>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/about')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    About Us
                  </Button>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/contact')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Contact
                  </Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.light }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    info@conversationalintelligence.com
                  </Typography>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.light }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    +1 (555) 123-4567
                  </Typography>
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <LocationIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.light }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    123 AI Street, Tech City, TC 12345
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: alpha(theme.palette.common.white, 0.1) }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Conversational Intelligence. All rights reserved. 
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    color: theme.palette.primary.light,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    color: theme.palette.primary.light,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    color: theme.palette.primary.light,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// TabPanel component for the detailed features section
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feature-tabpanel-${index}`}
      aria-labelledby={`feature-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default LandingPage; 