import React, { createContext, useState, useEffect } from 'react';

// Create context
export const DoctorContext = createContext();

// Available doctors
const availableDoctors = [
  { id: 1, name: "Dr. Sarah Wilson", specialty: "Psychologist", avatar: null },
  { id: 2, name: "Dr. Robert Chen", specialty: "Psychiatrist", avatar: "/doctor2.jpg" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Neurologist", avatar: "/doctor3.jpg" },
];

// Provider component
export const DoctorProvider = ({ children }) => {
  const [currentDoctorId, setCurrentDoctorId] = useState(1);
  const [currentDoctor, setCurrentDoctor] = useState(availableDoctors[0]);

  // Update current doctor when ID changes
  useEffect(() => {
    const doctor = availableDoctors.find(doc => doc.id === currentDoctorId) || availableDoctors[0];
    setCurrentDoctor(doctor);
  }, [currentDoctorId]);

  // Switch doctor function
  const switchDoctor = (doctorId) => {
    setCurrentDoctorId(doctorId);
  };

  // Context value
  const contextValue = {
    currentDoctorId,
    currentDoctor,
    availableDoctors,
    switchDoctor
  };

  return (
    <DoctorContext.Provider value={contextValue}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorProvider; 