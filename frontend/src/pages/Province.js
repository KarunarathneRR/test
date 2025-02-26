import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/FaultAlarmVisualization.css';
import Navbar from '../componants/newnavbar';

function Province() {
  const [provinceCounts, setProvinceCounts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { region } = useParams(); // Get the region from route params

  useEffect(() => {
    // Fetch provinces with node counts for the selected region
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/regions/${region}/provinces/status-counts`);
        const result = await response.json();

        if (response.ok) {
          setProvinceCounts(result.provinceCounts || []);
        } else {
          setError(result.message || 'Error fetching province data');
        }
      } catch (error) {
        setError('Failed to fetch province data. Please try again later.');
        console.error('Error:', error);
      }
    };

    fetchProvinces();
  }, [region]);

  const handleProvinceClick = (province) => {
    // navigate(`/engineer/${province}`); // Redirect to the engineer page for the selected province
    navigate(`/engineer/${encodeURIComponent(region)}/${encodeURIComponent(province)}`);

  };

  return (
    <div className="fau">
      <Navbar />
      <div className="name-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
        <h3>{region}</h3>
      </div>
      <div className="card-container">
        <div className="name-container2"><h2>Select Province</h2></div>
        {provinceCounts.length > 0 ? (
          provinceCounts.map(({ province, healthyNodes, faultNodes }) => (
            <div
              key={province}
              className="province-card"
              onClick={() => handleProvinceClick(province)}
            >
              <h3>{province}</h3>
              <div className="card healthy">
                Healthy Nodes: {healthyNodes}
              </div>
              <div className="card faulty">
                Fault Nodes: {faultNodes}
              </div>
            </div>
          ))
        ) : (
          <p>{error || 'Loading provinces...'}</p>
        )}
      </div>
    </div>
  );
}

export default Province;
