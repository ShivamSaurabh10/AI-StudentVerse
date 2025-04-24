import React from 'react';
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
  AppBar,
  Toolbar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  EmojiEmotions as EmojiIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Login as LoginIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  IntegrationInstructions as IntegrationIcon,
  Dashboard as DashboardIcon,
  AutoGraph as AutoGraphIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
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
  );
};

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

const FeaturesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Advanced NLP',
      description: 'State-of-the-art natural language processing for accurate conversation analysis',
    },
    {
      icon: <EmojiIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Emotion Recognition',
      description: 'Detect and analyze emotional patterns in conversations',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Analysis',
      description: 'Get instant insights as conversations happen',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fast & Efficient',
      description: 'Lightning-fast processing with minimal latency',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Privacy & Security',
      description: 'Enterprise-grade security with end-to-end encryption',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cloud Integration',
      description: 'Seamlessly integrate with your existing cloud infrastructure',
    },
    {
      icon: <IntegrationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'API & Integrations',
      description: 'Connect with your favorite tools through our extensive API',
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Custom Dashboards',
      description: 'Create personalized dashboards to visualize your data',
    },
  ];

  const detailedFeatures = {
    'AI & Analysis': [
      {
        title: 'Natural Language Processing',
        description: 'Our advanced NLP algorithms understand context, sentiment, and intent in conversations, providing deeper insights than traditional analysis tools.',
        icon: <AutoGraphIcon />,
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
        icon: <IntegrationIcon />,
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

  return (
    <Box>
      {/* App Bar with Back Button */}
      <AppBar position="absolute" color="transparent" elevation={0} sx={{ zIndex: 1 }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ color: 'text.primary' }}
          >
            Back to Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 20,
              px: 3,
              py: 1,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Discover how our platform transforms your conversations with advanced AI analysis
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/pricing')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                View Pricing Plans
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.svg"
                alt="Conversational Intelligence Features"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Overview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Core Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Detailed Features */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Explore Our Features in Detail
          </Typography>
          
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="AI & Analysis" />
              <Tab label="Performance & Integration" />
              <Tab label="Security & Compliance" />
            </Tabs>
            
            {Object.keys(detailedFeatures).map((category, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <Grid container spacing={4}>
                  {detailedFeatures[category].map((feature, featureIndex) => (
                    <Grid item xs={12} md={6} key={featureIndex}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ mr: 2, color: 'primary.main' }}>
                              {feature.icon}
                            </Box>
                            <Typography variant="h6" component="h3">
                              {feature.title}
                            </Typography>
                          </Box>
                          <Typography variant="body1" color="text.secondary">
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
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
          >
            Ready to Experience These Features?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Start your free trial today and see how our platform can transform your conversations
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/demo')}
            >
              Schedule Demo
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default FeaturesPage; 