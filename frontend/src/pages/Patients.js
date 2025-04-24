import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Fade,
  Grow,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import DoctorLayout from '../components/DoctorLayout';
import { DoctorContext } from '../contexts/DoctorContext';
import { keyframes } from '@mui/system';

// Glowing animation keyframes
const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(66, 133, 244, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(66, 133, 244, 0.3);
  }
`;

// Styled components
const GlowingCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  },
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 16,
  padding: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${alpha(theme.palette[color].main, 0.15)} 100%)`,
  border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    animation: `${glowAnimation} 2s infinite`,
    transform: 'translateY(-3px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette[color].main, 0.12)})`,
    transform: 'skewX(-15deg)',
  }
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
}));

const AnimatedRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'scale(1.01)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
}));

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

const Patients = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { currentDoctorId } = useContext(DoctorContext) || { currentDoctorId: 1 };
  const [patients, setPatients] = useState([]);
  
  // Doctor-specific patient datasets
  const doctorPatients = {
    1: [ // Dr. Sarah Wilson - Psychologist
      { id: 1, name: 'John Doe', age: 35, gender: 'Male', phone: '(555) 123-4567', lastVisit: '2023-10-12', status: 'active', avatar: '/avatar1.jpg', condition: 'Anxiety' },
      { id: 2, name: 'Sara Wilson', age: 28, gender: 'Female', phone: '(555) 234-5678', lastVisit: '2023-10-10', status: 'active', avatar: '/avatar2.jpg', condition: 'Depression' },
      { id: 3, name: 'Michael Johnson', age: 42, gender: 'Male', phone: '(555) 345-6789', lastVisit: '2023-09-28', status: 'inactive', avatar: '/avatar3.jpg', condition: 'PTSD' },
      { id: 4, name: 'Emily Davis', age: 24, gender: 'Female', phone: '(555) 456-7890', lastVisit: '2023-10-05', status: 'active', avatar: '/avatar4.jpg', condition: 'Bipolar Disorder' },
      { id: 5, name: 'Robert Smith', age: 55, gender: 'Male', phone: '(555) 567-8901', lastVisit: '2023-09-15', status: 'inactive', avatar: '/avatar5.jpg', condition: 'Insomnia' },
      { id: 6, name: 'Lisa Adams', age: 31, gender: 'Female', phone: '(555) 678-9012', lastVisit: '2023-10-08', status: 'active', avatar: '/avatar6.jpg', condition: 'Grief' },
      { id: 7, name: 'Jessica Miller', age: 29, gender: 'Female', phone: '(555) 789-0123', lastVisit: '2023-10-01', status: 'active', avatar: '/avatar7.jpg', condition: 'Stress' },
    ],
    2: [ // Dr. Robert Chen - Psychiatrist
      { id: 1, name: 'Kevin Moore', age: 33, gender: 'Male', phone: '(555) 111-2222', lastVisit: '2023-10-11', status: 'active', avatar: '/avatar8.jpg', condition: 'Bipolar Disorder' },
      { id: 2, name: 'Rachel Green', age: 27, gender: 'Female', phone: '(555) 222-3333', lastVisit: '2023-10-08', status: 'active', avatar: '/avatar9.jpg', condition: 'Schizophrenia' },
      { id: 3, name: 'Thomas Baker', age: 47, gender: 'Male', phone: '(555) 333-4444', lastVisit: '2023-09-20', status: 'inactive', avatar: '/avatar10.jpg', condition: 'Clinical Depression' },
      { id: 4, name: 'Jennifer Lopez', age: 31, gender: 'Female', phone: '(555) 444-5555', lastVisit: '2023-10-02', status: 'active', avatar: '/avatar11.jpg', condition: 'ADHD' },
      { id: 5, name: 'William Carter', age: 52, gender: 'Male', phone: '(555) 555-6666', lastVisit: '2023-10-01', status: 'active', avatar: '/avatar12.jpg', condition: 'OCD' },
      { id: 6, name: 'Amanda Patel', age: 38, gender: 'Female', phone: '(555) 666-7777', lastVisit: '2023-09-10', status: 'inactive', avatar: '/avatar13.jpg', condition: 'Panic Disorder' },
    ],
    3: [ // Dr. Emily Rodriguez - Neurologist
      { id: 1, name: 'Christopher Miller', age: 41, gender: 'Male', phone: '(555) 777-8888', lastVisit: '2023-10-09', status: 'active', avatar: '/avatar14.jpg', condition: 'Epilepsy' },
      { id: 2, name: 'Olivia Parker', age: 29, gender: 'Female', phone: '(555) 888-9999', lastVisit: '2023-10-05', status: 'active', avatar: '/avatar15.jpg', condition: 'Migraine' },
      { id: 3, name: 'George Washington', age: 62, gender: 'Male', phone: '(555) 999-0000', lastVisit: '2023-09-18', status: 'active', avatar: '/avatar16.jpg', condition: 'Parkinson\'s' },
      { id: 4, name: 'Patricia Evans', age: 58, gender: 'Female', phone: '(555) 123-9876', lastVisit: '2023-09-25', status: 'inactive', avatar: '/avatar17.jpg', condition: 'Multiple Sclerosis' },
      { id: 5, name: 'James Franklin', age: 45, gender: 'Male', phone: '(555) 234-8765', lastVisit: '2023-08-30', status: 'inactive', avatar: '/avatar18.jpg', condition: 'Stroke Recovery' },
    ]
  };

  // Update patients when doctor changes
  useEffect(() => {
    const doctorSpecificPatients = doctorPatients[currentDoctorId] || doctorPatients[1];
    setPatients(doctorSpecificPatients);
  }, [currentDoctorId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter active patients for the "Active" tab
  const activePatients = patients.filter(patient => patient.status === 'active');
  // Filter inactive patients for the "Inactive" tab
  const inactivePatients = patients.filter(patient => patient.status === 'inactive');

  return (
    <DoctorLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header with Search */}
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Patients
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your patient records and information
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search patients..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    '&:hover': {
                      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    transition: 'box-shadow 0.3s ease-in-out',
                  }
                }}
                sx={{ width: 250 }}
              />
              <GlowingButton 
                variant="contained" 
                color="primary"
                startIcon={<PersonAddIcon />}
              >
                Add New Patient
              </GlowingButton>
            </Box>
          </Box>
        </Fade>

        {/* Patients Tabs */}
        <Grow in={true} timeout={600}>
          <GlowingCard sx={{ mb: 4, overflow: 'hidden' }}>
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
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.2s ease',
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    color: theme.palette.primary.main,
                  },
                },
                '& .Mui-selected': {
                  background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                  color: theme.palette.primary.main,
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <Tab label={`All (${patients.length})`} />
              <Tab label={`Active (${activePatients.length})`} />
              <Tab label={`Inactive (${inactivePatients.length})`} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ 
                      background: alpha(theme.palette.primary.main, 0.03),
                      '& .MuiTableCell-root': {
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                      }
                    }}>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Last Visit</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient, index) => (
                      <Fade key={patient.id} in={true} timeout={300 + index * 100}>
                        <AnimatedRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={patient.avatar}
                                sx={{ 
                                  width: 45, 
                                  height: 45, 
                                  mr: 2,
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              />
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {patient.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.condition}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.gender}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            <Chip 
                              label={patient.status} 
                              size="small"
                              sx={{ 
                                bgcolor: patient.status === 'active' 
                                  ? alpha(theme.palette.success.main, 0.1) 
                                  : alpha(theme.palette.error.main, 0.1),
                                color: patient.status === 'active' 
                                  ? theme.palette.success.main 
                                  : theme.palette.error.main,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                borderRadius: '12px',
                                boxShadow: patient.status === 'active' 
                                  ? `0 0 10px ${alpha(theme.palette.success.main, 0.3)}` 
                                  : `0 0 10px ${alpha(theme.palette.error.main, 0.3)}`,
                                border: patient.status === 'active' 
                                  ? `1px solid ${alpha(theme.palette.success.main, 0.3)}` 
                                  : `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.error.main, 0.1),
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.grey[500], 0.1),
                                  }
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </AnimatedRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ 
                      background: alpha(theme.palette.primary.main, 0.03),
                      '& .MuiTableCell-root': {
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                      }
                    }}>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Last Visit</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activePatients.map((patient, index) => (
                      <Fade key={patient.id} in={true} timeout={300 + index * 100}>
                        <AnimatedRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={patient.avatar}
                                sx={{ 
                                  width: 45, 
                                  height: 45, 
                                  mr: 2,
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              />
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {patient.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.condition}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.gender}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            <Chip 
                              label={patient.status} 
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                borderRadius: '12px',
                                boxShadow: `0 0 10px ${alpha(theme.palette.success.main, 0.3)}`,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.error.main, 0.1),
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.grey[500], 0.1),
                                  }
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </AnimatedRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ 
                      background: alpha(theme.palette.primary.main, 0.03),
                      '& .MuiTableCell-root': {
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                      }
                    }}>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Last Visit</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inactivePatients.map((patient, index) => (
                      <Fade key={patient.id} in={true} timeout={300 + index * 100}>
                        <AnimatedRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={patient.avatar}
                                sx={{ 
                                  width: 45, 
                                  height: 45, 
                                  mr: 2,
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              />
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {patient.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.condition}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.gender}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            <Chip 
                              label={patient.status} 
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                color: theme.palette.error.main,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                borderRadius: '12px',
                                boxShadow: `0 0 10px ${alpha(theme.palette.error.main, 0.3)}`,
                                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.error.main, 0.1),
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                sx={{ 
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    background: alpha(theme.palette.grey[500], 0.1),
                                  }
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </AnimatedRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </GlowingCard>
        </Grow>

        {/* Statistics Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40%',
                height: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                borderRadius: 2,
              }
            }}
          >
            Patient Statistics
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            <Grow in={true} timeout={300}>
              <StatsCard color="primary">
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">{patients.length}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: alpha(theme.palette.primary.main, 0.8) }}>Total Patients</Typography>
                </CardContent>
              </StatsCard>
            </Grow>
            
            <Grow in={true} timeout={500}>
              <StatsCard color="success">
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">{activePatients.length}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: alpha(theme.palette.success.main, 0.8) }}>Active Patients</Typography>
                </CardContent>
              </StatsCard>
            </Grow>
            
            <Grow in={true} timeout={700}>
              <StatsCard color="error">
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="error.main">{inactivePatients.length}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: alpha(theme.palette.error.main, 0.8) }}>Inactive Patients</Typography>
                </CardContent>
              </StatsCard>
            </Grow>
            
            <Grow in={true} timeout={900}>
              <StatsCard color="warning">
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">12</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: alpha(theme.palette.warning.main, 0.8) }}>Pending Follow-ups</Typography>
                </CardContent>
              </StatsCard>
            </Grow>
          </Box>
        </Box>
      </Container>
    </DoctorLayout>
  );
};

export default Patients; 