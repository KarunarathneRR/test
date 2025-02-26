import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/FaultAlarmVisualization.css';
import Navbar from '../componants/newnavbar';

function Engineer() {
  const [engineers, setEngineers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { region, province } = useParams(); // Get region and province from URL params

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        if (!region || !province) {
          setError('Region or Province is undefined');
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/faults/regions/${region}/provinces/${province}/engineers/status-counts`
        );
        const result = await response.json();

        if (response.ok) {
          setEngineers(result.engineers || []);
        } else {
          setError(result.message || 'Error fetching engineers data');
        }
      } catch (error) {
        setError('Failed to fetch engineers. Please try again later.');
        console.error('Error:', error);
      }
    };

    fetchEngineers();
  }, [region, province]);

  const handleEngineerClick = (engineer) => {
    console.log('Selected Engineer:', engineer);  // Debug log
    navigate(`/node/${encodeURIComponent(region)}/${encodeURIComponent(province)}/${encodeURIComponent(engineer.engineer)}`);
  };
  

  return (
    <div className="fau">
      <Navbar />
      <div className="name-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <h3>{province}</h3>
      </div>

      <div className="card-container">
        <div className="name-container2">
          <h2>Select Engineer</h2>
        </div>

        {engineers.map((engineer) => (
  <div className="province-card" onClick={() => handleEngineerClick(engineer)} key={engineer.engineer}>
    <h3>{engineer.engineer}</h3> {/* Display the engineer's name */}
    <div className="card healthy">
      Healthy Nodes: {engineer.healthyNodes}
    </div>
    <div className="card faulty">
      Fault Nodes: {engineer.faultyNodes}
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default Engineer;
