export const setAuthTokenAndNavigate = (navigate) => {
  // Save token in localStorage
  const token = 'mockToken123';  // This should be a real token from an API
  localStorage.setItem('authToken', token);

  // Navigate to the /map page
  navigate('/map');
};
