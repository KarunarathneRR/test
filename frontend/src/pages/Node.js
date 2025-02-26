import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import Navbar from '../componants/newnavbar';
import '../css/Node.css';

function Node() {
  const [healthyNodes, setHealthyNodes] = useState([]);
  const [faultNodes, setFaultNodes] = useState([]);
  const [healthyCount, setHealthyCount] = useState(0);
  const [faultCount, setFaultCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { region, province, engineer } = useParams(); // Extract from URL

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/faults/regions/${region}/provinces/${province}/engineers/${engineer}/nodes/status-counts`;
        console.log("Fetching URL:", url);
    
        const response = await fetch(url);
        const result = await response.json();
        
        if (response.ok) {
          console.log('Response:', result);
          setHealthyNodes(result.healthyNodes || []);
          setFaultNodes(result.faultNodes || []);
          setHealthyCount(result.healthyCount || 0);
          setFaultCount(result.faultCount || 0);
        } else {
          setError(result.message || 'Error fetching nodes.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch nodes.');
      }
    };
    
  
      fetchNodes();
  }, [region, province, engineer]);
  

  return (
    <div className="fault-visualization">
      <Navbar />
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2 className="header-title">{engineer}</h2>
      </div>

      <div className="nodes-container">
        {error && <div className="error-message">{error}</div>}

        <div className="nodes-section healthy-section">
          <h3 className="section-title">Healthy Nodes: {healthyCount}</h3>
          <div className="nodes-list">
            {healthyNodes.map((node, index) => (
              <button
                key={index}
                className="node-item healthy-node"
                //onClick={() => navigate(`/node-details/${node}`)}
              >
                {node}
              </button>
            ))}
          </div>
        </div>

        <div className="nodes-section fault-section">
          <h3 className="section-title">Fault Nodes: {faultCount}</h3>
          <div className="nodes-list">
            {faultNodes.map((node, index) => (
              <button
                key={index}
                className="node-item fault-node"
                onClick={() => navigate(`/faulty-node/${node}`)}
              >
                {node}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Node;
