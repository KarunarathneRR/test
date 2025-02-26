
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/FaultAlarmVisualization.css';
// import Navbar from '../componants/newnavbar';

// function FaultAlarmVisualization() {
//   const [healthyNodes, setHealthyNodes] = useState([]);
//   const [faultyNodes, setFaultyNodes] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [provinces, setProvinces] = useState([]);
//   const [engineers, setEngineers] = useState([]);
//   const [nodes, setNodes] = useState([]); // State to hold filtered nodes
//   const [selectedRegion, setSelectedRegion] = useState('');
//   const [selectedProvince, setSelectedProvince] = useState('');
//   const [selectedEngineer, setSelectedEngineer] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch Regions
//     const fetchRegions = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/faults/regions');
//         const data = await response.json();
//         setRegions(data.regions || []);
//       } catch (error) {
//         console.error('Error fetching regions:', error);
//       }
//     };
//     fetchRegions();
//   }, []);

//   const handleRegionChange = async (region) => {
//     setSelectedRegion(region);
//     setSelectedProvince('');
//     setSelectedEngineer('');
//     setNodes([]);

//     try {
//       const response = await fetch(`http://localhost:5000/api/faults/provinces/${encodeURIComponent(region)}`);
//       const data = await response.json();
//       setProvinces(data.provinces || []);
//     } catch (error) {
//       console.error('Error fetching provinces:', error);
//     }
//   };

//   const handleProvinceChange = async (province) => {
//     setSelectedProvince(province);
//     setSelectedEngineer('');
//     setNodes([]);

//     try {
//       const response = await fetch(`http://localhost:5000/api/faults/engineers/${selectedRegion}/${province}`);
//       const data = await response.json();
//       setEngineers(data.engineers || []);
//     } catch (error) {
//       console.error('Error fetching engineers:', error);
//     }
//   };

//   const handleEngineerChange = async (engineer) => {
//     setSelectedEngineer(engineer);
//     setIsLoading(true);
//     setNodes([]);

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/faults/nodes?region=${encodeURIComponent(selectedRegion)}&province=${encodeURIComponent(selectedProvince)}&engineer=${encodeURIComponent(engineer)}`
//       );
//       const data = await response.json();

//       if (response.ok) {
//         setNodes(data.nodes || []);
//       } else {
//         setError(data.message || 'Error fetching nodes.');
//       }
//     } catch (error) {
//       console.error('Error fetching nodes:', error);
//       setError('Failed to fetch nodes. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNodeClick = (nodeName) => {
//     navigate(`/faulty-node/${encodeURIComponent(nodeName)}`);
//   };

  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/faults/counts');
//         const result = await response.json();

//         if (response.ok) {
//           setHealthyNodes(result.healthyNodes || []); // Handle undefined data gracefully
//           setFaultyNodes(result.faultNodes || []);
//         } else {
//           setError(result.message || 'Error fetching node data');
//         }
//       } catch (error) {
//         setError('Failed to fetch node data. Please try again later.');
//         console.error('Error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="fau">
//       <Navbar />

//       <div className="dropdown-container">
//         <div className="drop">
//           <p>Region</p>
//           <select
//             value={selectedRegion}
//             onChange={(e) => handleRegionChange(e.target.value)}
//           >
//             <option value="" disabled hidden>Select Region</option>
//             {regions.map((region, index) => (
//               <option key={index} value={region}>{region}</option>
//             ))}
//           </select>
//         </div>

//         <div className="drop">
//           <p>Province</p>
//           <select
//             value={selectedProvince}
//             onChange={(e) => handleProvinceChange(e.target.value)}
//             disabled={!selectedRegion}
//           >
//             <option value="" disabled hidden>Select Province</option>
//             {provinces.map((province, index) => (
//               <option key={index} value={province}>{province}</option>
//             ))}
//           </select>
//         </div>

//         <div className="drop">
//           <p>Engineer</p>
//           <select
//             value={selectedEngineer}
//             onChange={(e) => handleEngineerChange(e.target.value)}
//             disabled={!selectedProvince}
//           >
//             <option value="" disabled hidden>Select Engineer</option>
//             {engineers.map((engineer, index) => (
//               <option key={index} value={engineer}>{engineer}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Nodes Section */}
//       <div className="nodes">
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <div className="error-message">
//             <p>{error}</p>
//           </div>
//         ) : nodes.length > 0 ? (
//           <ul className="node-list">
//             {nodes.map((node, index) => (
//               <li
//                 key={index}
//                 onClick={() => handleNodeClick(node)}
//                 className="node-item"
//               >
//                 {node}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="sentence">
//             <h3>
//               The system currently monitors <strong>{healthyNodes.length + faultyNodes.length}</strong> nodes, out of which <strong>{healthyNodes.length}</strong> are healthy and <strong>{faultyNodes.length}</strong> have faults.
//             </h3>
//           </div>        
//         )}
//       </div>
//     </div>
//   );
// }

// export default FaultAlarmVisualization;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FaultAlarmVisualization.css';
import Navbar from '../componants/newnavbar';

function FaultAlarmVisualization() {
  const [regionCounts, setRegionCounts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch region counts
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/regions/status-counts`);
        const result = await response.json();

        if (response.ok) {
          setRegionCounts(result.regionCounts || []);
        } else {
          setError(result.message || 'Error fetching region data');
        }
      } catch (error) {
        setError('Failed to fetch region data. Please try again later.');
        console.error('Error:', error);
      }
    };

    fetchRegions();
  }, []);

  const handleProvinceClick = (region) => {
    navigate(`/province/${region}`); // Redirect to the desired page for the region
  };

  return (
    <div className="fau">
      <Navbar />
      <div className="card-container">
        <div className="name-container2"><h2>Select Region</h2></div>
        {regionCounts.length > 0 ? (
          regionCounts.map(({ region, healthyNodes, faultNodes }) => (
            <div
              key={region}
              className="province-card"
              onClick={() => handleProvinceClick(region)}
            >
              <h3>{region}</h3>
              <div className="card healthy">
                Healthy Nodes: {healthyNodes}
              </div>
              <div className="card faulty">
                Fault Nodes: {faultNodes}
              </div>
            </div>
          ))
        ) : (
          <p>{error || 'Loading regions...'}</p>
        )}
      </div>
    </div>
  );
}

export default FaultAlarmVisualization;
