import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import "../css/navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Logout function
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    
    // Redirect to the login page
    navigate('/');
  };

  return (
    <nav className="nav1">
      <a href="" className="site-title1">
        Fault Alarm Visualization System
      </a>
      <ul>
        <li>
          <a href="/map">Node Map</a>
        </li>
        <li>
          <a href="/faultalarm">Node Status</a>
        </li>
        <li>
          <a href="/fault">Faults</a>
        </li>
        <li>
          <a href="/inventory">Inventory</a>
        </li>
        <li className="red">
          <a href="/" onClick={handleLogout}>Log out &nbsp; <FontAwesomeIcon icon={faRightFromBracket} /></a>
        </li>
      </ul>
    </nav>
  );
}
