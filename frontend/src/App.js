import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import RealTimeAnalysis from './pages/RealTimeAnalysis';
import HistoricalData from './pages/HistoricalData';
import DoctorDashboard from './pages/DoctorDashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Analysis from './pages/Analysis';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import AIDiagnosis from './pages/AIDiagnosis';
import VideoConsultation from './pages/VideoConsultation';
import MedicineTimer from './pages/MedicineTimer';
import SymptomAnalysis from './pages/SymptomAnalysis';
import CommonMedications from './pages/CommonMedications';
import BMICalculator from './pages/BMICalculator';
import AboutPage from './pages/AboutPage';
import Profile from './pages/Profile';
import PricingPage from './pages/PricingPage';
import AIScheduling from './pages/AIScheduling';
import HealthManagement from './pages/HealthManagement';
import Navbar from './components/Navbar';
import { auth } from './firebase';
import { DoctorProvider } from './contexts/DoctorContext';

// Protected route component to check authentication
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Doctor route component that includes the DoctorProvider
const DoctorRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <DoctorProvider>
        {children}
      </DoctorProvider>
    </ProtectedRoute>
  );
};

function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/profile', '/settings']; 
  const doctorDashboardPaths = [
    '/doctor', 
    '/doctor/dashboard', 
    '/doctor/patients', 
    '/doctor/appointments', 
    '/doctor/analysis', 
    '/doctor/messages', 
    '/doctor/settings'
  ];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname) && !doctorDashboardPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/realtime" element={
          <ProtectedRoute>
            <RealTimeAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoricalData />
          </ProtectedRoute>
        } />
        
        {/* Doctor Dashboard Routes */}
        <Route path="/doctor" element={
          <DoctorRoute>
            <Navigate to="/doctor/dashboard" />
          </DoctorRoute>
        } />
        <Route path="/doctor/dashboard" element={
          <DoctorRoute>
            <DoctorDashboard />
          </DoctorRoute>
        } />
        <Route path="/doctor/patients" element={
          <DoctorRoute>
            <Patients />
          </DoctorRoute>
        } />
        <Route path="/doctor/appointments" element={
          <DoctorRoute>
            <Appointments />
          </DoctorRoute>
        } />
        <Route path="/doctor/analysis" element={
          <DoctorRoute>
            <Analysis />
          </DoctorRoute>
        } />
        <Route path="/doctor/messages" element={
          <DoctorRoute>
            <Messages />
          </DoctorRoute>
        } />
        <Route path="/doctor/settings" element={
          <DoctorRoute>
            <Settings />
          </DoctorRoute>
        } />
        
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <Navigate to="/doctor/dashboard" />
          </ProtectedRoute>
        } />
        <Route path="/ai-diagnosis" element={
          <ProtectedRoute>
            <AIDiagnosis />
          </ProtectedRoute>
        } />
        <Route path="/video-consultation" element={
          <ProtectedRoute>
            <VideoConsultation />
          </ProtectedRoute>
        } />
        <Route path="/medicine-timer" element={
          <ProtectedRoute>
            <MedicineTimer />
          </ProtectedRoute>
        } />
        <Route path="/symptom-analysis" element={
          <ProtectedRoute>
            <SymptomAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/bmi-calculator" element={
          <ProtectedRoute>
            <BMICalculator />
          </ProtectedRoute>
        } />
        <Route path="/common-medications" element={
          <ProtectedRoute>
            <CommonMedications />
          </ProtectedRoute>
        } />
        <Route path="/ai-scheduling" element={
          <ProtectedRoute>
            <AIScheduling />
          </ProtectedRoute>
        } />
        <Route path="/health-management" element={
          <ProtectedRoute>
            <HealthManagement />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App; 