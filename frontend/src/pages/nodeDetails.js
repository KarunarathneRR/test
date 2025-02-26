import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL params
import '../css/nodeDetails.css';

function NodeDetails() {
  const { nodeName } = useParams(); // Get the node name from the URL parameter

  return (
    <div>
      <h1>Node Tree</h1>
      <p>Fault Visualization for node: {nodeName}</p>
      {/* You can add additional logic to fetch and display more data for the selected node */}
    </div>
  );
}

export default NodeDetails;
