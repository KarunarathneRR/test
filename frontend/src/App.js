import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './componants/ProtectedRoute'; // Import the ProtectedRoute component

import FaultAlarmVisualization from './pages/FaultAlarmVisualization';
import NodeDetails from './pages/nodeDetails';  
import Inventory from './pages/inventory';
import Fault from './pages/Fault';
import LoginPage from './pages/Login';
import NewFault from './pages/Newfault';
import DynamicTreeVisualization from './componants/DynamicTreeVisualization';
import NewNavbar from './componants/newnavbar';
import Map from './pages/Map';
import Province from './pages/Province';
import Engineer from './pages/Engineer';
import Node from './pages/Node';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
        <Route path="/fault" element={<ProtectedRoute element={<Fault />} />} />
        <Route path="/faultalarm" element={<ProtectedRoute element={<FaultAlarmVisualization />} />} />
        <Route path="/node/:nodeName" element={<ProtectedRoute element={<NodeDetails />} />} />
        <Route path="/newfault" element={<ProtectedRoute element={<NewFault />} />} />
        <Route path="/newnavbar" element={<ProtectedRoute element={<NewNavbar />} />} />
        <Route path="/map" element={<ProtectedRoute element={<Map />} />} />
        <Route path="/faulty-node/:nodeName" element={<ProtectedRoute element={<DynamicTreeVisualization />} />} />
        <Route path="/province/:region" element={<ProtectedRoute element={<Province />} />} />
        <Route path="/engineer/:region/:province" element={<ProtectedRoute element={<Engineer />} />} />
        <Route path="/node/:region/:province/:engineer" element={<ProtectedRoute element={<Node />} />} />
      </Routes>
    </Router>
  );
}

export default App;
