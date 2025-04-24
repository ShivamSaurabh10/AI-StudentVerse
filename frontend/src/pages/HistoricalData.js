import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Fade,
  Grow,
  Tooltip,
  styled,
  Divider,
  Badge,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { keyframes } from '@mui/system';

// Define animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  animation: `${shimmer} 3s linear infinite`,
}));

const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.25)',
  },
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'scale(1.005)',
  },
}));

const SentimentChip = styled(Chip)(({ sentiment, theme }) => {
  let color;
  switch (sentiment.toLowerCase()) {
    case 'positive':
      color = theme.palette.success.main;
      break;
    case 'negative':
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.warning.main;
  }
  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: 'bold',
    borderRadius: '20px',
    border: `1px solid ${alpha(color, 0.3)}`,
    '&:hover': {
      backgroundColor: alpha(color, 0.2),
    },
  };
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.1)',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.05),
  borderLeft: `4px solid ${theme.palette[color].main}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette[color].main, 0.15)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 30px ${alpha(theme.palette[color].main, 0.25)}`,
  },
}));

const HistoricalData = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);

  // Sample data - in a real app, this would come from your backend
  const historicalData = [
    {
      id: 1,
      date: '2024-03-15',
      conversation: 'Product launch discussion',
      sentiment: 'Positive',
      confidence: 0.92,
      trend: 'up',
      duration: '45 min',
      participants: 8,
    },
    {
      id: 2,
      date: '2024-03-14',
      conversation: 'Customer feedback session',
      sentiment: 'Neutral',
      confidence: 0.85,
      trend: 'flat',
      duration: '32 min',
      participants: 5,
    },
    {
      id: 3,
      date: '2024-03-13',
      conversation: 'Team meeting',
      sentiment: 'Negative',
      confidence: 0.78,
      trend: 'down',
      duration: '58 min',
      participants: 12,
    },
    {
      id: 4,
      date: '2024-03-12',
      conversation: 'Sales call with prospect',
      sentiment: 'Positive',
      confidence: 0.88,
      trend: 'up',
      duration: '25 min',
      participants: 3,
    },
    {
      id: 5,
      date: '2024-03-11',
      conversation: 'Support ticket resolution',
      sentiment: 'Positive',
      confidence: 0.91,
      trend: 'up',
      duration: '18 min',
      participants: 2,
    },
  ];

  // Simulating data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Animate items appearing in sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      const items = [];
      historicalData.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => [...prev, index]);
        }, index * 150);
      });
      return () => clearTimeout(timer);
    }, 500);
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlatIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setAnimatedItems([]);
    setTimeout(() => {
      setIsLoading(false);
      historicalData.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => [...prev, index]);
        }, index * 150);
      });
    }, 1000);
  };

  // Calculate stats
  const stats = {
    positive: historicalData.filter(item => item.sentiment === 'Positive').length,
    neutral: historicalData.filter(item => item.sentiment === 'Neutral').length,
    negative: historicalData.filter(item => item.sentiment === 'Negative').length,
    total: historicalData.length,
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundImage: `radial-gradient(circle at 20% 90%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.15)} 0%, transparent 50%)`,
        pb: 6
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            sx={{ 
              borderRadius: '20px', 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(-5px)',
              }
            }}
          >
            Back to Dashboard
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh data">
              <StyledIconButton 
                onClick={handleRefresh}
                sx={{ animation: isLoading ? `${pulse} 1.5s infinite` : 'none' }}
              >
                <RefreshIcon />
              </StyledIconButton>
            </Tooltip>
            <Tooltip title="Filter results">
              <StyledIconButton>
                <FilterListIcon />
              </StyledIconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <StyledIconButton>
                <DownloadIcon />
              </StyledIconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mb: 5 }}>
          <GradientText variant="h3" component="h1" gutterBottom fontWeight="bold">
            Historical Analysis
          </GradientText>
          <Typography variant="subtitle1" color="text.secondary">
            View past conversation analyses and discover insights from your communication patterns
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grow in={!isLoading} timeout={800}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="primary">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Total Analyses</Typography>
                    <AssessmentIcon color="primary" />
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 30 days
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="success">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Positive Tone</Typography>
                    <TrendingUpIcon color="success" />
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {Math.round((stats.positive / stats.total) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.positive} conversations
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="warning">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Neutral Tone</Typography>
                    <TrendingFlatIcon color="warning" />
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {Math.round((stats.neutral / stats.total) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.neutral} conversations
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="error">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">Negative Tone</Typography>
                    <TrendingDownIcon color="error" />
                  </Box>
                  <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {Math.round((stats.negative / stats.total) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.negative} conversations
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>
        </Grow>

        <GlassCard>
          <CardContent sx={{ p: 0 }}>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ opacity: 0.7, animation: `${pulse} 1.5s infinite` }}>
                  Loading historical data...
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Conversation</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Sentiment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Confidence</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historicalData.map((row, index) => (
                      <Grow
                        key={row.id}
                        in={animatedItems.includes(index)}
                        timeout={(index + 1) * 200}
                        style={{ transformOrigin: '0 0 0' }}
                      >
                        <AnimatedTableRow 
                          onClick={() => handleRowClick(row.id)}
                          selected={selectedRow === row.id}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'primary.light' }} />
                              {row.date}
                            </Box>
                          </TableCell>
                          <TableCell>{row.conversation}</TableCell>
                          <TableCell>
                            <SentimentChip 
                              label={row.sentiment} 
                              sentiment={row.sentiment} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              position: 'relative', 
                              width: '100%', 
                              maxWidth: 100,
                              height: 8, 
                              bgcolor: 'grey.100',
                              borderRadius: 5,
                              overflow: 'hidden',
                            }}>
                              <Box 
                                sx={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  height: '100%',
                                  width: `${row.confidence * 100}%`,
                                  bgcolor: row.sentiment === 'Positive' 
                                    ? 'success.main' 
                                    : row.sentiment === 'Negative'
                                      ? 'error.main'
                                      : 'warning.main',
                                  borderRadius: 5,
                                  transition: 'width 1s ease-in-out',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              {(row.confidence * 100).toFixed(0)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              animation: `${float} ${2 + index * 0.5}s ease-in-out infinite`
                            }}>
                              {getTrendIcon(row.trend)}
                            </Box>
                          </TableCell>
                        </AnimatedTableRow>
                      </Grow>
                    ))}
                    {selectedRow && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ p: 0 }}>
                          <Fade in={Boolean(selectedRow)} timeout={300}>
                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Additional Details
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Duration: {historicalData.find(row => row.id === selectedRow)?.duration}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Participants: {historicalData.find(row => row.id === selectedRow)?.participants}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                    <Button size="small" variant="outlined">View Details</Button>
                                    <Button size="small" variant="contained">Generate Report</Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Fade>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </GlassCard>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="outlined" 
            endIcon={<TrendingUpIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              borderRadius: 28, 
              px: 3,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HistoricalData; 