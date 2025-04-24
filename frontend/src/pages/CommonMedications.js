import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Styled components for enhanced UI
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

// Styled search button with gradient background
const SearchButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: 'white',
  fontWeight: 'bold',
  padding: '10px 24px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
}));

// Result Card
const ResultCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-3px)',
  },
}));

const CommonMedications = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medicationSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to fetch search results
  const fetchSearchResults = async (term) => {
    setIsLoading(true);
    
    // Simulating an API call with a timeout
    setTimeout(() => {
      // Mock results based on search term
      const mockResults = [];
      
      // Generate mock results based on common terms
      const searchLower = term.toLowerCase();
      
      if (searchLower.includes('pain') || searchLower.includes('ache') || searchLower.includes('tylenol') || searchLower.includes('advil')) {
        mockResults.push({
          title: "Acetaminophen (Tylenol)",
          snippet: "Acetaminophen is used to treat mild to moderate pain and reduce fever. It's available over the counter and is the active ingredient in Tylenol. Standard adult dosage is 325-650mg every 4-6 hours, not exceeding 3000mg per day.",
          source: "National Library of Medicine"
        });
        
        mockResults.push({
          title: "Ibuprofen (Advil, Motrin)",
          snippet: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever. Common side effects include stomach pain and heartburn. Should be taken with food to minimize stomach irritation.",
          source: "Mayo Clinic"
        });
      }
      
      if (searchLower.includes('allerg') || searchLower.includes('claritin') || searchLower.includes('zyrtec')) {
        mockResults.push({
          title: "Loratadine (Claritin)",
          snippet: "Loratadine is an antihistamine that reduces symptoms of seasonal allergies like sneezing, runny nose, and itchy/watery eyes. It's a non-drowsy formula taken once daily. Avoid alcohol while taking this medication.",
          source: "American Academy of Allergy, Asthma & Immunology"
        });
        
        mockResults.push({
          title: "Cetirizine (Zyrtec)",
          snippet: "Cetirizine is a second-generation antihistamine used to treat allergies and hives. It may cause drowsiness in some people, so use caution when driving. Common dosage is 5-10mg once daily for adults.",
          source: "WebMD"
        });
      }
      
      if (searchLower.includes('blood pressure') || searchLower.includes('heart') || searchLower.includes('lisinopril')) {
        mockResults.push({
          title: "Lisinopril",
          snippet: "Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure. It works by relaxing blood vessels to improve blood flow. Common side effects include dry cough, dizziness, and headache. Requires prescription.",
          source: "American Heart Association"
        });
      }
      
      if (searchLower.includes('diabet') || searchLower.includes('sugar') || searchLower.includes('metformin')) {
        mockResults.push({
          title: "Metformin",
          snippet: "Metformin is the first-line medication for treating type 2 diabetes. It works by improving your body's response to insulin and decreasing sugar production in the liver. Common side effects include digestive issues that usually improve over time.",
          source: "American Diabetes Association"
        });
      }
      
      if (searchLower.includes('depress') || searchLower.includes('anxiety') || searchLower.includes('zoloft')) {
        mockResults.push({
          title: "Sertraline (Zoloft)",
          snippet: "Sertraline is an SSRI antidepressant used to treat depression, anxiety disorders, and other conditions. It may take several weeks to feel the full benefits. Common side effects include nausea, headache, and sleep changes.",
          source: "National Institute of Mental Health"
        });
      }

      if (searchLower.includes('antibiot') || searchLower.includes('infect') || searchLower.includes('amoxicillin')) {
        mockResults.push({
          title: "Amoxicillin",
          snippet: "Amoxicillin is a penicillin antibiotic used to treat bacterial infections like ear infections, pneumonia, and UTIs. It's not effective against viral infections like colds or flu. Always complete the full course of antibiotics even if you feel better.",
          source: "Centers for Disease Control and Prevention"
        });
      }
      
      // If no specific matches, provide general results
      if (mockResults.length === 0) {
        mockResults.push({
          title: "Common Over-the-Counter Medications",
          snippet: "Over-the-counter medications include pain relievers (acetaminophen, ibuprofen), antihistamines (loratadine, diphenhydramine), decongestants, cough suppressants, and acid reducers. Always read labels carefully and follow dosage instructions.",
          source: "U.S. Food and Drug Administration"
        });
        
        mockResults.push({
          title: "Prescription Medications",
          snippet: "Prescription medications require a doctor's authorization and are used to treat specific conditions. These include antibiotics, blood pressure medications, diabetes medications, and medications for mental health conditions.",
          source: "MedlinePlus"
        });
      }
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    
    // Add current search to history (avoid duplicates and keep most recent at top)
    const newHistory = [
      searchTerm,
      ...searchHistory.filter(term => term !== searchTerm)
    ].slice(0, 10); // Keep only the 10 most recent searches
    
    setSearchHistory(newHistory);
    
    // Fetch search results
    fetchSearchResults(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryItemClick = (term) => {
    setSearchTerm(term);
    // Move this term to the top of history
    const updatedHistory = [
      term,
      ...searchHistory.filter(item => item !== term)
    ];
    setSearchHistory(updatedHistory);
    
    // Automatically search with the clicked history term
    fetchSearchResults(term);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      backgroundImage: `radial-gradient(circle at 20% 90%, ${theme.palette.primary.light}30 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.light}30 0%, transparent 50%)`,
      pb: 5,
    }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="primary"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <GradientText variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Common Medications
            </GradientText>
            <Typography variant="body1" color="text.secondary">
              Search for medications to learn about their uses, dosages, and side effects
            </Typography>
          </Box>
        </Box>

        {/* Main Search Card */}
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            mb: 4,
          }}
        >
          {/* Search Box */}
          <Box 
            sx={{ 
              p: 4, 
              bgcolor: 'rgba(25, 118, 210, 0.03)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Find Information About Medications
            </Typography>
            
            <TextField
              placeholder="Search by medication name, category, or medical condition..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              fullWidth
              variant="outlined"
              size="large"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2,
                  p: 1,
                  bgcolor: 'white',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                  }
                }
              }}
            />
            
            {/* Search Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <SearchButton 
                variant="contained" 
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isLoading}
                sx={{ borderRadius: 28, px: 5 }}
              >
                {isLoading ? 'Searching...' : 'Search Medications'}
                {isLoading && <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />}
              </SearchButton>
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Try searching for:
              </Typography>
              {['Acetaminophen', 'Allergy', 'Antibiotics', 'Diabetes', 'Blood Pressure'].map(suggestion => (
                <Chip 
                  key={suggestion}
                  label={suggestion} 
                  size="small" 
                  onClick={() => {
                    setSearchTerm(suggestion);
                    fetchSearchResults(suggestion);
                  }}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Search History */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                Recent Searches
              </Typography>
              {searchHistory.length > 0 && (
                <Chip 
                  label="Clear History" 
                  size="small" 
                  onClick={handleClearHistory}
                  sx={{ 
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                />
              )}
            </Box>

            {searchHistory.length > 0 ? (
              <List sx={{ py: 0 }}>
                {searchHistory.map((term, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button 
                      onClick={() => handleHistoryItemClick(term)}
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon color="action" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={term} />
                    </ListItem>
                    {index < searchHistory.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No recent searches yet. Try searching for a medication or health condition.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Search Results */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress color="primary" />
            <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
              Searching for information...
            </Typography>
          </Box>
        ) : searchResults.length > 0 ? (
          <Box>
            <Box sx={{ mb: 3, px: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Results for "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {searchResults.map((result, index) => (
              <ResultCard key={index}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    {result.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {result.snippet}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Source: {result.source}
                    </Typography>
                    <Chip 
                      label="Medical Information" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                </CardContent>
              </ResultCard>
            ))}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                This information is for educational purposes only. Always consult with a healthcare professional.
              </Typography>
            </Box>
          </Box>
        ) : searchTerm && !isLoading && searchResults.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 2, 
            borderRadius: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No information found for "{searchTerm}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term or check the spelling
            </Typography>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default CommonMedications; 