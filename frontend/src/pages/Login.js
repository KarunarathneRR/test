import React, { useState } from "react";
import "../css/login.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { setAuthTokenAndNavigate } from '../utils/trueLogin'; // Import the function to set the token and navigate
import axios from 'axios';  // Import axios for making API calls

function LoginPage() {
  const navigate = useNavigate(); // Get the navigate function here
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle the login process
  /*const handleLogin = async () => {
    try {
      const response = await loginAPI(username, password);  // Call the SOAP API
      if (response.loginResult === 'success') {  // Adjust based on the actual response
        setAuthTokenAndNavigate(navigate);  // If login is successful, set token and navigate
      } else {
        setError('Invalid credentials');  // Show error message if login fails
      }
    } catch (err) {
      console.error(err);
      setError('Network error or timeout occurred');
    }
  };

  // Function to make the SOAP request
  const loginAPI = async (username, password) => {
    const soapRequest = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <login xmlns="http://tempuri.org/">
            <username>${username}</username>
            <password>${password}</password>
          </login>
        </soap:Body>
      </soap:Envelope>
    `;

    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://tempuri.org/login',
    };

    try {
      const response = await axios.post(
        'http://fmt.slt.com.lk/FMT/WClogin.asmx',  // Make sure this URL is correct
        soapRequest,
        { headers, timeout: 15000 }  // Set timeout to 15 seconds
      );
      
      // Parse the XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const loginResult = xmlDoc.getElementsByTagName("loginResult")[0]?.textContent;

      return { loginResult };  // Return the login result from the response
    } catch (error) {
      console.error('Error during API request:', error);
      throw new Error('Network error or timeout occurred');
    }
  };*/
  const handleLogin = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
            username,
            password,
        });
        alert(response.data.message); // Show success message
        setAuthTokenAndNavigate(navigate);  // If login is successful, set token and navigate
    } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Handle input changes for username and password fields
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    setError('');  // Clear the error when user types
  };

  return (
    <div className="background">
      <div className="login-container">
        <h2><b>Fault Alarm Visualization System</b></h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleInputChange(setUsername)}  // Reuse input change handler
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}  // Reuse input change handler
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>} {/* Show error if exists */}
      </div>
    </div>
  );
}

export default LoginPage;
      