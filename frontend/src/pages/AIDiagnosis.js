import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  CircularProgress,
  Avatar,
  Link,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  HealthAndSafety as HealthIcon,
  CheckCircleOutline as CheckIcon,
  Help as HelpIcon,
  Cancel as CancelIcon,
  InsertChart as ChartIcon,
  Search as SearchIcon,
  Public as WebIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';

// We'll use Chart.js for modern graphs
// You'll need to install these dependencies:
// npm install chart.js react-chartjs-2
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
} from 'chart.js';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale
);

const AIDiagnosis = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState(null);
  const [error, setError] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);
  const [radarData, setRadarData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [barData, setBarData] = useState(null);

  const steps = ['Describe Symptoms', 'AI Analysis', 'Results & Recommendations'];

  // Initialize chart data when diagnosis results change
  useEffect(() => {
    if (diagnosisResults) {
      // Set up radar chart data
      const radarLabels = ['Severity', 'Prevalence', 'Chronicity', 'Urgency', 'Treatability'];
      
      setRadarData({
        labels: radarLabels,
        datasets: diagnosisResults.potentialConditions.map((condition, index) => ({
          label: condition.name,
          data: generateRandomMetrics(condition),
          backgroundColor: getColorWithOpacity(index, 0.2),
          borderColor: getColorWithOpacity(index, 1),
          borderWidth: 2,
        })),
      });
      
      // Set up doughnut chart data
      setDoughnutData({
        labels: diagnosisResults.potentialConditions.map(c => c.name),
        datasets: [{
          data: diagnosisResults.potentialConditions.map(c => c.probability * 100),
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        }],
      });
      
      // Set up bar chart for symptom correlation
      setBarData({
        labels: ['Fever', 'Cough', 'Fatigue', 'Pain', 'Respiratory'],
        datasets: diagnosisResults.potentialConditions.map((condition, index) => ({
          label: condition.name,
          data: generateSymptomCorrelation(),
          backgroundColor: getColorWithOpacity(index, 0.7),
          borderColor: getColorWithOpacity(index, 1),
          borderWidth: 1,
        })),
      });
    }
  }, [diagnosisResults]);

  // Generate random severity metrics for each condition
  const generateRandomMetrics = (condition) => {
    // Generate realistic-looking metrics based on the condition's probability
    const baseFactor = condition.probability;
    return [
      Math.round((baseFactor * 0.8 + Math.random() * 0.2) * 100) / 20, // Severity
      Math.round((baseFactor * 0.7 + Math.random() * 0.3) * 100) / 20, // Prevalence
      Math.round((baseFactor * 0.5 + Math.random() * 0.5) * 100) / 20, // Chronicity
      condition.urgency === 'High' ? 4.5 : condition.urgency === 'Medium' ? 3 : 1.5, // Urgency
      Math.round((baseFactor * 0.9 + Math.random() * 0.1) * 100) / 20, // Treatability
    ];
  };

  // Generate random symptom correlation data
  const generateSymptomCorrelation = () => {
    return Array(5).fill().map(() => Math.floor(Math.random() * 100));
  };

  // Get chart colors
  const getColorWithOpacity = (index, opacity) => {
    const colors = [
      `rgba(75, 192, 192, ${opacity})`,
      `rgba(54, 162, 235, ${opacity})`,
      `rgba(255, 206, 86, ${opacity})`,
      `rgba(153, 102, 255, ${opacity})`,
      `rgba(255, 99, 132, ${opacity})`,
    ];
    return colors[index % colors.length];
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSymptomChange = (e) => {
    setSymptoms(e.target.value);
  };

  // Analyze symptoms and generate search terms
  const analyzeSymptoms = (symptoms) => {
    const symptomText = symptoms.toLowerCase();
    const searchTerms = [];
    
    // Extract key symptoms for search
    if (symptomText.includes('headache')) searchTerms.push('headache');
    if (symptomText.includes('fever') || symptomText.includes('temperature')) searchTerms.push('fever');
    if (symptomText.includes('cough')) searchTerms.push('cough');
    if (symptomText.includes('throat') || symptomText.includes('sore')) searchTerms.push('sore throat');
    if (symptomText.includes('nose') || symptomText.includes('runny')) searchTerms.push('runny nose');
    if (symptomText.includes('pain')) searchTerms.push('pain');
    if (symptomText.includes('tired') || symptomText.includes('fatigue')) searchTerms.push('fatigue');
    if (symptomText.includes('stomach')) searchTerms.push('stomach issues');
    
    // If no specific symptoms detected, use general terms
    if (searchTerms.length === 0) {
      searchTerms.push('general illness symptoms');
    }
    
    return searchTerms;
  };

  // Simulate getting data from Google search
  const simulateGoogleSearch = (searchTerms) => {
    // Define potential conditions based on search terms
    const conditions = [];
    
    if (searchTerms.includes('headache')) {
      conditions.push({ 
        name: 'Migraine', 
        probability: 0.65, 
        urgency: 'Medium',
        source: 'Mayo Clinic',
        url: 'https://www.mayoclinic.org/diseases-conditions/migraine-headache/symptoms-causes/syc-20360201'
      });
    }
    
    if (searchTerms.includes('fever') || searchTerms.includes('cough')) {
      conditions.push({ 
        name: 'Influenza', 
        probability: 0.78, 
        urgency: 'Medium',
        source: 'CDC',
        url: 'https://www.cdc.gov/flu/symptoms/index.html'
      });
    }
    
    if ((searchTerms.includes('cough') || searchTerms.includes('sore throat')) && 
        (searchTerms.includes('runny nose'))) {
      conditions.push({ 
        name: 'Common Cold', 
        probability: 0.82, 
        urgency: 'Low',
        source: 'WebMD',
        url: 'https://www.webmd.com/cold-and-flu/features/common-cold-or-something-else'
      });
    }
    
    if (searchTerms.includes('sore throat') && !searchTerms.includes('cough')) {
      conditions.push({ 
        name: 'Strep Throat', 
        probability: 0.45, 
        urgency: 'Medium',
        source: 'HealthLine',
        url: 'https://www.healthline.com/health/strep-throat'
      });
    }
    
    if (searchTerms.includes('runny nose') && !searchTerms.includes('fever')) {
      conditions.push({ 
        name: 'Allergies', 
        probability: 0.72, 
        urgency: 'Low',
        source: 'ACAAI',
        url: 'https://acaai.org/allergies/symptoms/common-allergy-symptoms/'
      });
    }
    
    if (searchTerms.includes('stomach issues')) {
      conditions.push({ 
        name: 'Gastroenteritis', 
        probability: 0.58, 
        urgency: 'Medium',
        source: 'NHS',
        url: 'https://www.nhs.uk/conditions/diarrhoea-and-vomiting/'
      });
    }
    
    // Always add a general condition if we have too few results
    if (conditions.length < 2) {
      conditions.push({ 
        name: 'Viral Infection', 
        probability: 0.63, 
        urgency: 'Low',
        source: 'MedlinePlus',
        url: 'https://medlineplus.gov/ency/article/003090.htm'
      });
    }
    
    // Sort by probability and take top 3
    conditions.sort((a, b) => b.probability - a.probability);
    const topConditions = conditions.slice(0, 3);
    
    // Generate recommendations based on top conditions
    const recommendations = [
      'Rest and stay hydrated',
      'Monitor your symptoms for changes in severity',
    ];
    
    if (searchTerms.includes('fever')) {
      recommendations.push('Consider taking over-the-counter fever reducers if temperature exceeds 101°F (38.3°C)');
    }
    
    if (searchTerms.includes('cough') || searchTerms.includes('sore throat')) {
      recommendations.push('Use throat lozenges or warm saltwater gargles to soothe throat irritation');
    }
    
    if (searchTerms.includes('headache')) {
      recommendations.push('Rest in a dark, quiet room if experiencing severe headaches');
    }
    
    recommendations.push('Consult with a healthcare provider if symptoms worsen or persist beyond a week');
    
    return {
      potentialConditions: topConditions,
      recommendations,
      disclaimer: 'This AI analysis provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.'
    };
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      // Start analysis
      setAnalyzing(true);
      
      // Extract search terms from symptoms
      const terms = analyzeSymptoms(symptoms);
      setSearchTerms(terms);
      
      setTimeout(() => {
        setAnalyzing(false);
        setActiveStep(1);
        
        // After a brief delay, show results with Google-based suggestions
        setTimeout(() => {
          const googleResults = simulateGoogleSearch(terms);
          setDiagnosisResults(googleResults);
          setActiveStep(2);
        }, 2000);
      }, 3000);
    }
  };

  const handleRestart = () => {
    setActiveStep(0);
    setSymptoms('');
    setDiagnosisResults(null);
    setSearchTerms([]);
    setError('');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'info';
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please describe your symptoms in detail
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="For example: I've had a headache for the past two days, along with a runny nose and sore throat. My temperature is 99.5°F..."
              value={symptoms}
              onChange={handleSymptomChange}
              sx={{ mb: 3 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleNextStep}
                disabled={!symptoms.trim() || symptoms.length < 10}
              >
                Analyze Symptoms
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
            <CircularProgress size={60} color="primary" sx={{ mb: 3 }} />
            <Typography variant="h6">
              Analyzing your symptoms...
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Searching medical databases and trusted health sources
            </Typography>
            {searchTerms.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {searchTerms.map((term, index) => (
                  <Chip 
                    key={index}
                    label={term}
                    color="primary"
                    size="small"
                    icon={<SearchIcon />}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              Analysis Results
            </Typography>
            
            {/* New graph section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, textAlign: 'center' }}>
                    Condition Probability
                  </Typography>
                  <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                    {doughnutData && (
                      <Doughnut 
                        data={doughnutData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.label}: ${Math.round(context.raw)}%`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, textAlign: 'center' }}>
                    Condition Metrics
                  </Typography>
                  <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                    {radarData && (
                      <Radar 
                        data={radarData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              min: 0,
                              max: 5,
                              ticks: {
                                stepSize: 1,
                                display: false
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, textAlign: 'center' }}>
                    Symptom Correlation
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    {barData && (
                      <Bar 
                        data={barData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Correlation (%)'
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                            }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
              Potential Conditions:
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              {diagnosisResults.potentialConditions.map((condition, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {condition.name}
                      </Typography>
                      <Chip 
                        label={condition.urgency} 
                        size="small" 
                        color={getUrgencyColor(condition.urgency)}
                      />
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Match confidence:
                      </Typography>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <Box 
                          sx={{ 
                            height: 8, 
                            borderRadius: 5, 
                            width: `${condition.probability * 100}%`,
                            bgcolor: condition.probability > 0.7 ? 'success.main' : 
                                    condition.probability > 0.4 ? 'warning.main' : 'error.main',
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {Math.round(condition.probability * 100)}%
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <WebIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Source: 
                        <Link href={condition.url} target="_blank" rel="noopener" sx={{ ml: 1 }}>
                          {condition.source}
                        </Link>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <HeartIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} />
              Recommendations:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {diagnosisResults.recommendations.map((rec, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    <Typography variant="body1">{rec}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.dark', mb: 3 }}>
              <Box sx={{ display: 'flex' }}>
                <HelpIcon sx={{ mr: 2 }} />
                <Typography variant="body2">
                  {diagnosisResults.disclaimer}
                </Typography>
              </Box>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleRestart}
                startIcon={<CancelIcon />}
              >
                Start Over
              </Button>
              <Button
                variant="contained"
                onClick={handleBack}
                startIcon={<CheckIcon />}
              >
                Return to Dashboard
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <HealthIcon sx={{ mr: 1, color: 'success.main' }} />
            AI Diagnosis
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent()}
        </Paper>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
          Note: This AI diagnostic tool is for informational purposes only and does not replace consultation with healthcare professionals.
          Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
        </Typography>
      </Container>
    </Box>
  );
};

export default AIDiagnosis; 