import React, { useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Login as LoginIcon,
  ExpandMore as ExpandMoreIcon,
  Support as SupportIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const PricingCard = ({ title, price, period, features, isPopular, onSelect }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        border: isPopular ? `2px solid ${theme.palette.primary.main}` : '1px solid',
        borderColor: isPopular ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
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
          {features.map((feature, index) => (
            <ListItem key={index} disableGutters sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
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
          }}
        >
          {isPopular ? "Get Started" : "Select Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [expanded, setExpanded] = useState(false);

  const handleBillingPeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setBillingPeriod(newPeriod);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for annual plans. For Enterprise customers, we also offer invoice-based billing.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all plans come with a 14-day free trial. No credit card is required to start your trial. You can cancel at any time during the trial period without being charged.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.',
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'If you exceed your monthly conversation limit, you\'ll be notified and given the option to upgrade your plan or purchase additional capacity. We won\'t automatically charge you for overages without your consent.',
    },
  ];

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
                Simple, Transparent Pricing
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Choose the plan that's right for you. All plans include a 14-day free trial.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/features')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Explore Features
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.svg"
                alt="Conversational Intelligence Pricing"
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

      {/* Pricing Toggle */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={billingPeriod}
            exclusive
            onChange={handleBillingPeriodChange}
            aria-label="billing period"
            size="large"
            sx={{
              '& .MuiToggleButton-root': {
                px: 4,
                py: 1,
                borderRadius: 2,
              },
            }}
          >
            <ToggleButton value="monthly" aria-label="monthly billing">
              Monthly
            </ToggleButton>
            <ToggleButton value="annual" aria-label="annual billing">
              Annual <Chip label="Save 20%" color="success" size="small" sx={{ ml: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PricingCard
                title={plan.title}
                price={billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                period={billingPeriod}
                features={plan.features}
                isPopular={plan.isPopular}
                onSelect={() => navigate('/signup', { state: { plan: plan.title, billing: billingPeriod } })}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Custom Solution */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Need a custom solution?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Contact our sales team for a tailored plan that meets your specific requirements. We can customize features, pricing, and support to fit your organization's needs.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SupportIcon />}
                    onClick={() => navigate('/contact')}
                  >
                    Contact Sales
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AccessTimeIcon />}
                    onClick={() => navigate('/demo')}
                  >
                    Schedule Demo
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.contrastText',
                  }}
                >
                  <SupportIcon sx={{ fontSize: 60 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Frequently Asked Questions
        </Typography>
        
        {faqs.map((faq, index) => (
          <Accordion 
            key={index} 
            expanded={expanded === `panel${index}`} 
            onChange={handleAccordionChange(`panel${index}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
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
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Join thousands of businesses using our platform to transform their conversations
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage; 