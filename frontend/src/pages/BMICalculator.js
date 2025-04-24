import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Slider,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
  CardContent,
  Divider,
  styled,
  useTheme,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  LocalDining as DiningIcon,
  DirectionsRun as RunningIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';

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

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
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
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px)',
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

const CircularProgressWithLabel = styled(Box)(({ theme, value, bmiCategory }) => {
  let color;
  if (bmiCategory === 'Underweight') color = theme.palette.info.main;
  else if (bmiCategory === 'Normal') color = theme.palette.success.main;
  else if (bmiCategory === 'Overweight') color = theme.palette.warning.main;
  else color = theme.palette.error.main;

  return {
    position: 'relative',
    display: 'inline-flex',
    '& .MuiCircularProgress-root': {
      color: color,
    },
    '& .MuiTypography-root': {
      color: color,
    }
  };
});

const BMICalculator = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Form state
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70); // kg
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  
  // Results state
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [calories, setCalories] = useState(0);
  const [proteinNeeds, setProteinNeeds] = useState(0);
  const [carbsNeeds, setCarbsNeeds] = useState(0);
  const [fatNeeds, setFatNeeds] = useState(0);
  
  // UI state
  const [calculated, setCalculated] = useState(false);
  const [calculating, setCalculating] = useState(false);
  
  // Activity factor mapping
  const activityFactors = {
    sedentary: { label: 'Sedentary (little or no exercise)', factor: 1.2 },
    light: { label: 'Lightly active (light exercise 1-3 days/week)', factor: 1.375 },
    moderate: { label: 'Moderately active (moderate exercise 3-5 days/week)', factor: 1.55 },
    active: { label: 'Very active (hard exercise 6-7 days/week)', factor: 1.725 },
    extreme: { label: 'Extremely active (very hard exercise, physical job or training twice a day)', factor: 1.9 },
  };
  
  // BMI Categories
  const bmiCategories = {
    underweight: { range: [0, 18.5], name: 'Underweight', color: theme.palette.info.main },
    normal: { range: [18.5, 24.9], name: 'Normal', color: theme.palette.success.main },
    overweight: { range: [25, 29.9], name: 'Overweight', color: theme.palette.warning.main },
    obese: { range: [30, 100], name: 'Obese', color: theme.palette.error.main },
  };
  
  // Calculate BMI, category and calories
  const calculateResults = () => {
    setCalculating(true);
    
    // Simulate calculation taking some time
    setTimeout(() => {
      // Calculate BMI
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
      
      // Determine BMI category
      let category;
      if (bmiValue < 18.5) category = 'Underweight';
      else if (bmiValue < 25) category = 'Normal';
      else if (bmiValue < 30) category = 'Overweight';
      else category = 'Obese';
      setBmiCategory(category);
      
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      // Calculate daily calorie needs
      const dailyCalories = bmr * activityFactors[activityLevel].factor;
      setCalories(Math.round(dailyCalories));
      
      // Calculate macronutrient needs
      // Protein: 1.2g per kg of body weight
      const protein = weight * 1.2;
      setProteinNeeds(Math.round(protein));
      
      // Fat: 30% of calories
      const fat = (dailyCalories * 0.3) / 9; // 9 calories per gram of fat
      setFatNeeds(Math.round(fat));
      
      // Carbs: remaining calories
      const carbs = (dailyCalories - (protein * 4) - (fat * 9)) / 4; // 4 calories per gram of carbs
      setCarbsNeeds(Math.round(carbs));
      
      setCalculated(true);
      setCalculating(false);
    }, 1000);
  };
  
  // Reset calculator
  const handleReset = () => {
    setHeight(170);
    setWeight(70);
    setAge(30);
    setGender('male');
    setActivityLevel('moderate');
    setCalculated(false);
  };
  
  // Handle go back
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  // Get color for BMI category
  const getBmiColor = () => {
    if (bmiCategory === 'Underweight') return theme.palette.info.main;
    if (bmiCategory === 'Normal') return theme.palette.success.main;
    if (bmiCategory === 'Overweight') return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  // Get progress value for circular indicator (0-100)
  const getBmiProgress = () => {
    if (bmi <= 15) return 10;
    if (bmi >= 35) return 100;
    return ((bmi - 15) / 20) * 100;
  };
  
  // Calculate visual position for BMI marker
  const getBmiMarkerPosition = () => {
    // Range from 15 to 35 BMI mapped to 0-100%
    if (bmi <= 15) return '0%';
    if (bmi >= 35) return 'calc(100% - 12px)';
    const position = ((bmi - 15) / 20) * 100;
    return `calc(${position}% - 6px)`;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 4,
      backgroundImage: `radial-gradient(circle at 20% 90%, ${theme.palette.primary.light}30 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${theme.palette.secondary.light}30 0%, transparent 50%)`,
      backgroundColor: theme.palette.background.default,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleGoBack} 
            sx={{ mr: 2, bgcolor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <GradientText variant="h4" component="h1" fontWeight="bold">
            BMI Calculator & Calorie Counter
          </GradientText>
        </Box>

        <Grid container spacing={4}>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FitnessCenterIcon sx={{ mr: 1 }} /> Your Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Height (cm)"
                      type="number"
                      fullWidth
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      variant="outlined"
                      InputProps={{ inputProps: { min: 100, max: 250 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      fullWidth
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      variant="outlined"
                      InputProps={{ inputProps: { min: 30, max: 300 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Age"
                      type="number"
                      fullWidth
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      variant="outlined"
                      InputProps={{ inputProps: { min: 18, max: 120 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <Typography variant="subtitle2" gutterBottom>Gender</Typography>
                      <RadioGroup
                        row
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <FormControlLabel 
                          value="male" 
                          control={<Radio />} 
                          label="Male" 
                        />
                        <FormControlLabel 
                          value="female" 
                          control={<Radio />} 
                          label="Female" 
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Activity Level</InputLabel>
                      <Select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        label="Activity Level"
                      >
                        {Object.entries(activityFactors).map(([key, value]) => (
                          <MenuItem key={key} value={key}>{value.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={calculateResults}
                      disabled={calculating}
                      sx={{ 
                        py: 1.5, 
                        mt: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'rotate(30deg)',
                          transition: 'all 0.6s ease',
                        },
                        '&:hover::before': {
                          transform: 'rotate(30deg) translate(80%, 80%)',
                        },
                      }}
                    >
                      {calculating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Calculate'
                      )}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={handleReset}
                      sx={{ mt: 2, width: '100%' }}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </GlassCard>
          </Grid>
          
          {/* Results */}
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ 
              height: '100%', 
              opacity: calculated ? 1 : 0.5,
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <DiningIcon sx={{ mr: 1 }} /> Your Results
                </Typography>
                
                {bmi > 0 && (
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <CircularProgressWithLabel 
                        value={getBmiProgress()} 
                        bmiCategory={bmiCategory}
                      >
                        <CircularProgress 
                          variant="determinate" 
                          value={getBmiProgress()} 
                          size={120} 
                          thickness={4} 
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant="h4" fontWeight="bold">{bmi}</Typography>
                          <Typography variant="caption">BMI</Typography>
                        </Box>
                      </CircularProgressWithLabel>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mt: 2, 
                          color: getBmiColor(), 
                          fontWeight: 'bold' 
                        }}
                      >
                        {bmiCategory}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>BMI Scale</Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        height: 24, 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        {/* BMI scale colors */}
                        <Box sx={{ width: '25%', bgcolor: theme.palette.info.main }} />
                        <Box sx={{ width: '25%', bgcolor: theme.palette.success.main }} />
                        <Box sx={{ width: '25%', bgcolor: theme.palette.warning.main }} />
                        <Box sx={{ width: '25%', bgcolor: theme.palette.error.main }} />
                        
                        {/* BMI marker */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: -3,
                          left: getBmiMarkerPosition(),
                          width: 12,
                          height: 12,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          border: `3px solid ${getBmiColor()}`,
                          zIndex: 10,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease',
                        }} />
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mt: 0.5,
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                      }}>
                        <span>15</span>
                        <span>20</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35+</span>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <RunningIcon sx={{ mr: 1 }} /> Daily Calorie Needs
                      <Tooltip title="This is an estimation based on your age, gender, weight, height and activity level using the Mifflin-St Jeor Equation">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      mt: 2,
                      mb: 3,
                    }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                        {calories}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        calories/day
                      </Typography>
                    </Box>
                    
                    {/* Macronutrients distribution */}
                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Macronutrient Distribution:
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Card sx={{ 
                          textAlign: 'center', 
                          bgcolor: `${theme.palette.primary.main}20`,
                          height: '100%',
                        }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                              {proteinNeeds}g
                            </Typography>
                            <Typography variant="caption">Protein</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Card sx={{ 
                          textAlign: 'center', 
                          bgcolor: `${theme.palette.secondary.main}20`,
                          height: '100%',
                        }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="secondary.main">
                              {carbsNeeds}g
                            </Typography>
                            <Typography variant="caption">Carbs</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Card sx={{ 
                          textAlign: 'center', 
                          bgcolor: `${theme.palette.warning.main}20`,
                          height: '100%',
                        }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
                              {fatNeeds}g
                            </Typography>
                            <Typography variant="caption">Fat</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                      Note: These calculations provide estimates only. For personalized health advice, please consult with a healthcare professional.
                    </Typography>
                  </Box>
                )}
                
                {!calculated && !calculating && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '80%',
                    flexDirection: 'column',
                    opacity: 0.7,
                  }}>
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                      Enter your details and click Calculate to see your BMI and daily calorie needs
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BMICalculator; 