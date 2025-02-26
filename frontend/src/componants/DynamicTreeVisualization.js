// DynamicTreeVisualization.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import TreeVisualization from './TreeVisualization';

const DynamicTreeVisualization = () => {
    // Extract nodeName from the URL parameters
    const { nodeName } = useParams();

    return (
        // Pass the extracted nodeName to the TreeVisualization component
        <TreeVisualization nodeName={nodeName} />
    );
};

export default DynamicTreeVisualization;
