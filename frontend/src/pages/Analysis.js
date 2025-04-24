import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  InsertChart as ChartIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  CloudDownload as DownloadIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/DoctorLayout';
import { DoctorContext } from '../contexts/DoctorContext';

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Analysis = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { currentDoctorId } = useContext(DoctorContext) || { currentDoctorId: 1 };
  const [recentAnalysis, setRecentAnalysis] = useState([]);
  const [therapyEffectiveness, setTherapyEffectiveness] = useState([]);
  const [analysisStats, setAnalysisStats] = useState({
    totalAnalyses: 0,
    positiveTrends: 0,
    positiveTrendsChange: 0,
    concerningCases: 0,
    averageScore: 0,
    scoreChange: 0
  });
  
  // Doctor-specific analysis data
  const doctorAnalysisData = {
    1: { // Dr. Sarah Wilson - Psychologist
      recentAnalysis: [
        { id: 1, patientName: 'Lisa Adams', date: '2 hours ago', sentiment: 'positive', insights: 'Patient shows improved mood and engagement in therapy sessions. Demonstrating better coping mechanisms.', score: 0.85, therapyType: 'Cognitive Behavioral Therapy' },
        { id: 2, patientName: 'Robert Smith', date: 'Yesterday', sentiment: 'neutral', insights: 'No significant changes in emotional patterns. Maintaining consistent response to treatment.', score: 0.45, therapyType: 'Psychodynamic Therapy' },
        { id: 3, patientName: 'Jessica Miller', date: '2 days ago', sentiment: 'negative', insights: 'Detected increased anxiety levels. May need adjustment to treatment plan or medication review.', score: -0.65, therapyType: 'Exposure Therapy' },
        { id: 4, patientName: 'John Doe', date: '3 days ago', sentiment: 'positive', insights: 'Significant improvement in social interaction patterns. Decreased social anxiety markers.', score: 0.72, therapyType: 'Group Therapy' },
        { id: 5, patientName: 'Sara Wilson', date: '4 days ago', sentiment: 'negative', insights: 'Increasing signs of depression. Recommend intensifying support and considering medication adjustment.', score: -0.78, therapyType: 'Dialectical Behavior Therapy' },
      ],
      therapyEffectiveness: [
        { therapy: 'Cognitive Behavioral Therapy', successRate: 78, patients: 42, change: 5 },
        { therapy: 'Psychodynamic Therapy', successRate: 65, patients: 28, change: -2 },
        { therapy: 'Exposure Therapy', successRate: 72, patients: 19, change: 8 },
        { therapy: 'Group Therapy', successRate: 70, patients: 35, change: 4 },
        { therapy: 'Dialectical Behavior Therapy', successRate: 75, patients: 21, change: 10 },
      ],
      stats: {
        totalAnalyses: 152,
        positiveTrends: 68,
        positiveTrendsChange: 5,
        concerningCases: 8,
        averageScore: 0.72,
        scoreChange: 0.08
      }
    },
    2: { // Dr. Robert Chen - Psychiatrist
      recentAnalysis: [
        { id: 1, patientName: 'Kevin Moore', date: '1 hour ago', sentiment: 'positive', insights: 'Medication appears to be effectively stabilizing mood cycles. Patient reports fewer manic episodes.', score: 0.78, therapyType: 'Medication Management' },
        { id: 2, patientName: 'Rachel Green', date: 'Today', sentiment: 'neutral', insights: 'Patient maintaining stable condition with current medication regimen. No significant changes observed.', score: 0.32, therapyType: 'Supportive Therapy' },
        { id: 3, patientName: 'Thomas Baker', date: 'Yesterday', sentiment: 'negative', insights: 'Patient showing increased paranoid ideation. Consider adjusting antipsychotic medication dosage.', score: -0.82, therapyType: 'Cognitive Behavioral Therapy' },
        { id: 4, patientName: 'Jennifer Lopez', date: '2 days ago', sentiment: 'positive', insights: 'ADHD symptoms well-controlled with current medication. Improved focus reported at work and home.', score: 0.91, therapyType: 'Behavioral Therapy' },
        { id: 5, patientName: 'William Carter', date: '3 days ago', sentiment: 'positive', insights: 'OCD symptoms showing marked improvement. Exposure therapy combined with medication appears effective.', score: 0.67, therapyType: 'Exposure and Response Prevention' },
        { id: 6, patientName: 'Amanda Patel', date: '4 days ago', sentiment: 'negative', insights: 'Panic attacks increasing in frequency. Recommend reevaluation of anxiety medication.', score: -0.74, therapyType: 'Panic-Focused Psychodynamic Therapy' },
      ],
      therapyEffectiveness: [
        { therapy: 'Medication Management', successRate: 85, patients: 56, change: 8 },
        { therapy: 'Cognitive Behavioral Therapy', successRate: 72, patients: 38, change: 4 },
        { therapy: 'Supportive Therapy', successRate: 68, patients: 42, change: -1 },
        { therapy: 'Behavioral Therapy', successRate: 75, patients: 29, change: 6 },
        { therapy: 'Exposure and Response Prevention', successRate: 80, patients: 18, change: 12 },
        { therapy: 'Panic-Focused Psychodynamic Therapy', successRate: 62, patients: 15, change: -3 },
      ],
      stats: {
        totalAnalyses: 187,
        positiveTrends: 73,
        positiveTrendsChange: 7,
        concerningCases: 12,
        averageScore: 0.68,
        scoreChange: 0.12
      }
    },
    3: { // Dr. Emily Rodriguez - Neurologist
      recentAnalysis: [
        { id: 1, patientName: 'Christopher Miller', date: '3 hours ago', sentiment: 'positive', insights: 'EEG shows reduction in seizure activity. Current anticonvulsant regimen appears effective.', score: 0.76, therapyType: 'Epilepsy Management' },
        { id: 2, patientName: 'Olivia Parker', date: 'Yesterday', sentiment: 'neutral', insights: 'Migraine frequency unchanged after medication adjustment. Consider alternative preventive measures.', score: 0.22, therapyType: 'Headache Management' },
        { id: 3, patientName: 'George Washington', date: '2 days ago', sentiment: 'positive', insights: 'Steady improvement in motor function post-stroke. Physical therapy showing good results.', score: 0.63, therapyType: 'Neurorehabilitation' },
        { id: 4, patientName: 'Patricia Evans', date: '3 days ago', sentiment: 'negative', insights: 'MS symptoms worsening. New lesions detected on MRI. Recommend adjusting disease-modifying therapy.', score: -0.58, therapyType: 'Multiple Sclerosis Treatment' },
      ],
      therapyEffectiveness: [
        { therapy: 'Epilepsy Management', successRate: 82, patients: 24, change: 6 },
        { therapy: 'Headache Management', successRate: 65, patients: 31, change: -2 },
        { therapy: 'Neurorehabilitation', successRate: 78, patients: 18, change: 8 },
        { therapy: 'Multiple Sclerosis Treatment', successRate: 70, patients: 12, change: 3 },
        { therapy: 'Parkinson\'s Management', successRate: 75, patients: 10, change: 5 },
      ],
      stats: {
        totalAnalyses: 95,
        positiveTrends: 62,
        positiveTrendsChange: 4,
        concerningCases: 5,
        averageScore: 0.65,
        scoreChange: 0.06
      }
    }
  };

  // Update data when doctor changes
  useEffect(() => {
    const doctorData = doctorAnalysisData[currentDoctorId] || doctorAnalysisData[1];
    setRecentAnalysis(doctorData.recentAnalysis);
    setTherapyEffectiveness(doctorData.therapyEffectiveness);
    setAnalysisStats(doctorData.stats);
  }, [currentDoctorId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'neutral': return theme.palette.warning.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <DoctorLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Analysis & Insights</Typography>
            <Typography variant="body1" color="text.secondary">
              Review patient progress and therapy effectiveness
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: 2 }}
            >
              Download Reports
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PsychologyIcon />}
              sx={{ borderRadius: 2 }}
            >
              New Analysis
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Analyses</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <AssessmentIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analysisStats.totalAnalyses}</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> +12% this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Positive Trends</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analysisStats.positiveTrends}%</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> +{analysisStats.positiveTrendsChange}% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Concerning Cases</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
                    <TrendingDownIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analysisStats.concerningCases}</Typography>
                <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} /> Needs immediate attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Average Score</Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                    <TimelineIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analysisStats.averageScore}</Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> Up by {analysisStats.scoreChange}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField
          placeholder="Search analyses..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <FilterIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {/* Analysis Tabs */}
        <Card sx={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: 2, mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              px: 2,
              pt: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 100,
                fontWeight: 600,
              }
            }}
          >
            <Tab label="Recent Analysis" />
            <Tab label="Therapy Effectiveness" />
            <Tab label="Insights" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <List sx={{ width: '100%' }}>
              {recentAnalysis.map((analysis) => (
                <React.Fragment key={analysis.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 3 }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: getSentimentColor(analysis.sentiment),
                        mr: 2,
                        mt: 1
                      }} 
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            sx={{ mr: 1 }}
                          >
                            {analysis.patientName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 2 }}
                          >
                            {analysis.date}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.primary" gutterBottom>
                            <strong>Therapy:</strong> {analysis.therapyType}
                          </Typography>
                          <Typography variant="body2" color="text.primary" gutterBottom>
                            <strong>Sentiment:</strong> <span style={{ color: getSentimentColor(analysis.sentiment), fontWeight: 500 }}>
                              {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} ({analysis.score})
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Insights:</strong> {analysis.insights}
                          </Typography>
                        </>
                      }
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        minWidth: 120, 
                        alignSelf: 'center',
                        borderRadius: '20px',
                      }}
                    >
                      View Details
                    </Button>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Therapy Type</TableCell>
                    <TableCell align="right">Success Rate</TableCell>
                    <TableCell align="right">Active Patients</TableCell>
                    <TableCell align="right">Monthly Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {therapyEffectiveness.map((therapy) => (
                    <TableRow
                      key={therapy.therapy}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" fontWeight="medium">
                          {therapy.therapy}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {therapy.successRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{therapy.patients}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {therapy.change > 0 ? (
                            <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                          ) : (
                            <TrendingDownIcon fontSize="small" sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                          )}
                          <Typography 
                            variant="body2" 
                            color={therapy.change > 0 ? 'success.main' : 'error.main'}
                            fontWeight="medium"
                          >
                            {therapy.change > 0 ? `+${therapy.change}%` : `${therapy.change}%`}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, flexDirection: 'column' }}>
              <ChartIcon fontSize="large" sx={{ mb: 2, color: theme.palette.primary.main, fontSize: 60, opacity: 0.7 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Advanced insights visualization coming soon
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500 }}>
                Our team is working on advanced data visualization tools to help you better understand patient trends and therapy outcomes.
              </Typography>
            </Box>
          </TabPanel>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <AssessmentIcon sx={{ mb: 1 }} />
                Run Analysis
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <TimelineIcon sx={{ mb: 1 }} />
                View Trends
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <DownloadIcon sx={{ mb: 1 }} />
                Export Data
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <PsychologyIcon sx={{ mb: 1 }} />
                Patient Insights
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DoctorLayout>
  );
};

export default Analysis; 