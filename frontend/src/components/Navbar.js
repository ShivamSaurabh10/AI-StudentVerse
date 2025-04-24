import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  NightsStay as NightIcon,
  WbSunny as SunIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useThemeContext } from '../contexts/ThemeContext';
import { auth } from '../firebase';

// Animation keyframes
const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(2deg); }
  50% { transform: translate(0, 10px) rotate(0deg); }
  75% { transform: translate(-5px, 5px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideIn = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const underline = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

// Sun/moon rotation animation
const sunMoonRotate = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.6) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
`;

// Glow effect animation
const glow = keyframes`
  0% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073, 0 0 20px #e60073; }
  50% { box-shadow: 0 0 10px #fff, 0 0 15px #ff4da6, 0 0 25px #ff4da6, 0 0 30px #ff4da6; }
  100% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073, 0 0 20px #e60073; }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isDarkMode, toggleThemeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [shouldRender, setShouldRender] = useState(true);
  
  // List of routes where navbar should not be displayed
  const hideNavbarRoutes = [
    '/dashboard',
    '/doctor-dashboard',
    '/realtime',
    '/history',
    '/ai-diagnosis',
    '/video-consultation',
    '/medicine-timer',
    '/symptom-analysis',
    '/common-medications',
    '/bmi-calculator',
    '/ai-scheduling',
    '/health-management'
  ];
  
  // Check if the current path is the login page
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Effect to check auth state and determine if navbar should be visible
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      // Check if current route is in the list of protected routes
      const isProtectedRoute = hideNavbarRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      // Update rendering state - hide navbar if user is logged in and on protected route
      // or if on login/signup page
      setShouldRender(!(currentUser && isProtectedRoute) && !isLoginPage);
    });
    
    return () => unsubscribe();
  }, [location.pathname, isLoginPage]);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar appearance based on scroll position
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Detect which section is currently in view
      if (location.pathname === '/') {
        const sections = ['hero', 'features', 'pricing', 'cta'];
        const sectionElements = sections.map(id => document.getElementById(`${id}-section`));
        
        // Find the section that is most visible in the viewport
        let maxVisibility = 0;
        let mostVisibleSection = 'home';
        
        sectionElements.forEach((element, index) => {
          if (element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;
            
            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              mostVisibleSection = sections[index];
            }
          }
        });
        
        if (maxVisibility > 0.3 && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, activeSection, location.pathname]);

  // Location effect for scrollTo behavior
  useEffect(() => {
    const handleLocationChange = () => {
      if (location.pathname === '/' && window.history.state?.scrollTo) {
        // Wait for the page to render before scrolling
        setTimeout(() => {
          scrollToSection(window.history.state.scrollTo);
        }, 100);
      }
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [location.pathname]);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
      // Calculate offset to account for fixed navbar
      const navbarHeight = 64; // Approximate height of navbar
      const sectionTop = section.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
      
      // Update active section
      setActiveSection(sectionId);
    }
  };
  
  const handleFeaturesClick = () => {
    // If we're on the landing page, scroll to the features section
    if (location.pathname === '/') {
      scrollToSection('features');
    } else {
      // If we're not on the landing page, navigate to the features page
      navigate('/features');
    }
    
    handleMenuClose();
  };
  
  const handlePricingClick = () => {
    // If we're on the landing page, scroll to the pricing section
    if (location.pathname === '/') {
      scrollToSection('pricing');
    } else {
      // If we're not on the landing page, navigate to the pricing page
      navigate('/pricing');
    }
    
    handleMenuClose();
  };
  
  const handleHomeClick = () => {
    // If we're on the landing page, scroll to the top
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      // If we're not on the landing page, navigate to it
      navigate('/');
    }
    
    handleMenuClose();
  };
  
  const handleCTAClick = () => {
    // If we're on the landing page, scroll to the CTA section
    if (location.pathname === '/') {
      scrollToSection('cta');
    } else {
      // If we're not on the landing page, navigate to the landing page and then to CTA
      navigate('/', { state: { scrollTo: 'cta' } });
    }
    
    handleMenuClose();
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleThemeMode();
    handleMenuClose();
  };
  
  // If shouldRender is false, don't render the navbar
  if (!shouldRender) {
    return null;
  }
  
  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={scrolled ? 4 : 0} 
      sx={{ 
        zIndex: 1200,
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        backgroundColor: scrolled ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
        transition: 'all 0.3s ease-in-out',
        borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              color: 'primary.main',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                '&::after': {
                  width: '100%',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: activeSection === 'home' ? '100%' : '0%',
                height: '2px',
                backgroundColor: theme.palette.primary.main,
                transition: 'width 0.3s ease',
              },
            }}
            onClick={handleHomeClick}
          >
            Conversational Intelligence
          </Typography>
          
          {isMobile ? (
            <>
              {/* Theme Toggle Button for Mobile */}
              <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  color="inherit"
                  onClick={handleThemeToggle}
                  sx={{
                    mr: 1.5,
                    width: 40,
                    height: 40,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'scale(1.1)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    '& .MuiSvgIcon-root': {
                      transition: 'all 0.5s ease',
                      animation: `${pulse} 2s infinite ease-in-out`,
                    },
                    '&:active .MuiSvgIcon-root': {
                      animation: `${sunMoonRotate} 0.5s forwards`,
                    },
                  }}
                >
                  {isDarkMode ? (
                    <SunIcon sx={{ color: '#FFD700' }} /> 
                  ) : (
                    <NightIcon sx={{ color: '#3f51b5' }} />
                  )}
                </IconButton>
              </Tooltip>
              
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    boxShadow: theme.shadows[8],
                    overflow: 'visible',
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                TransitionProps={{
                  enter: true,
                  enterTimeout: 200,
                  exit: true,
                  exitTimeout: 200,
                }}
              >
                <MenuItem 
                  onClick={handleHomeClick}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    backgroundColor: activeSection === 'home' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  Home
                </MenuItem>
                <MenuItem 
                  onClick={handleFeaturesClick}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    backgroundColor: activeSection === 'features' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  Features
                </MenuItem>
                <MenuItem 
                  onClick={handlePricingClick}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    backgroundColor: activeSection === 'pricing' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  Pricing
                </MenuItem>
                <MenuItem 
                  onClick={handleCTAClick}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    backgroundColor: activeSection === 'cta' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  Get Started
                </MenuItem>
                <MenuItem 
                  onClick={() => handleNavigation('/about')}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  About
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem 
                  onClick={handleThemeToggle}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  {isDarkMode ? (
                    <>
                      <SunIcon fontSize="small" sx={{ mr: 1, color: '#FFD700' }} />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <NightIcon fontSize="small" sx={{ mr: 1, color: '#3f51b5' }} />
                      Dark Mode
                    </>
                  )}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleNavigation('/login')}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                  Login
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                onClick={handleHomeClick}
                sx={{ 
                  mx: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  color: activeSection === 'home' ? theme.palette.primary.main : 'inherit',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'home' ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                onClick={handleFeaturesClick}
                sx={{ 
                  mx: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  color: activeSection === 'features' ? theme.palette.primary.main : 'inherit',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'features' ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                Features
              </Button>
              <Button 
                color="inherit" 
                onClick={handlePricingClick}
                sx={{ 
                  mx: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  color: activeSection === 'pricing' ? theme.palette.primary.main : 'inherit',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'pricing' ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                Pricing
              </Button>
              <Button 
                color="inherit" 
                onClick={handleCTAClick}
                sx={{ 
                  mx: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  color: activeSection === 'cta' ? theme.palette.primary.main : 'inherit',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'cta' ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                Get Started
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/about')}
                sx={{ 
                  mx: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease',
                  },
                }}
              >
                About
              </Button>
              
              {/* Theme Toggle Button for Desktop */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  position: 'relative',
                  borderRadius: '50%',
                  mx: 2,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.5s ease',
                  boxShadow: isDarkMode 
                    ? '0 0 10px #FFD700' 
                    : '0 0 10px rgba(25, 118, 210, 0.5)',
                  '&:hover': {
                    boxShadow: isDarkMode 
                      ? '0 0 15px #FFD700, 0 0 30px #FFD700' 
                      : '0 0 15px rgba(25, 118, 210, 0.8), 0 0 30px rgba(25, 118, 210, 0.5)',
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
                onClick={handleThemeToggle}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDarkMode 
                      ? 'linear-gradient(45deg, #121212 0%, #3a3a3a 100%)' 
                      : 'linear-gradient(45deg, #90caf9 0%, #1976d2 100%)',
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box 
                    sx={{ 
                      transition: 'all 0.5s ease',
                      animation: `${sunMoonRotate} 0.5s`,
                    }}
                  >
                    {isDarkMode ? (
                      <SunIcon sx={{ color: '#FFD700', fontSize: 24 }} />
                    ) : (
                      <NightIcon sx={{ color: '#ffffff', fontSize: 24 }} />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => handleNavigation('/login')}
                sx={{
                  ml: 2,
                  borderRadius: 20,
                  px: 3,
                  py: 1,
                  boxShadow: theme.shadows[2],
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `${float} 3s ease-in-out infinite`,
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-3px)',
                    '&::after': {
                      opacity: 1,
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 