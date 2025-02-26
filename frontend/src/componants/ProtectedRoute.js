import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to handle authentication check
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken'); // Check for the token in localStorage

  /*if (!token) {
    // If no token found, redirect to login page
    return <Navigate to="/" />;
  }

  return element;*/

  if (token == 'mockToken123') {
    return element;
  }
  return <Navigate to="/" />;
  
};

export default ProtectedRoute;
