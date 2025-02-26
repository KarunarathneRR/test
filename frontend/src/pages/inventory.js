import React, { useState, useEffect } from 'react';
import Navbar from '../componants/newnavbar';
import "../css/inventory.css";
import io from 'socket.io-client';
import * as XLSX from 'xlsx'; // Import XLSX library

const Inventory = () => {
    const [nodes, setNodes] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editableNodes, setEditableNodes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/faults/inventory`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch inventory data');
                return response.json();
            })
            .then((data) => {
                // Use a Map to remove duplicates by `node` property
                const uniqueNodes = Array.from(
                    new Map(data.map((item) => [item.node, item])).values()
                );
                setNodes(uniqueNodes);
            })
            .catch((error) => console.error('Error fetching inventory data:', error));
    }, []);

    const handleInputChange = (index, field, value) => {
        const numericValue = value === "" ? "" : parseInt(value, 10);

        const constraints = {
            rack: { min: 1, max: 1 },
            shelf: { min: 1, max: 1 },
            slot: { min: 1, max: 17 },
            port: { min: 1, max: 16 },
            onu: { min: 1, max: 64 },
        };

        if (field in constraints) {
            if (numericValue === "" || (numericValue >= constraints[field].min && numericValue <= constraints[field].max)) {
                updateEditableNodes(index, field, numericValue);
                setErrorMessage(""); // Clear error if value is valid
            } else {
                setErrorMessage(`Value for ${field} must be between ${constraints[field].min} and ${constraints[field].max}.`);
            }
        }
    };

    const updateEditableNodes = (index, field, value) => {
        const updatedNodes = [...editableNodes];
        updatedNodes[index][field] = value;
        setEditableNodes(updatedNodes);
    };

    const handleEditClick = (index) => {
        setEditIndex(index); // Set the current row as editable
        setEditableNodes([...nodes]); // Copy current nodes to editable nodes
        setErrorMessage(""); // Clear any previous error messages
    };

    const handleSaveClick = async (index) => {
        try {
            const updatedNode = editableNodes[index]; // Get the updated node details
    
            // Make API call to update the node in the backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/inventory/${updatedNode._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNode), // Send updated node data
            });
    
            if (!response.ok) {
                throw new Error('Failed to save changes. Please try again.');
            }
    
            // Update the local state after a successful response
            const updatedNodes = [...nodes];
            updatedNodes[index] = updatedNode; // Update the specific node
            setNodes(updatedNodes);
            setEditIndex(null); // Exit edit mode
        } catch (error) {
            console.error('Error updating node:', error);
            setErrorMessage('Error updating node. Please try again.');
        }
    };

    useEffect(() => {
        const socket = io(`${process.env.REACT_APP_API_URL}`);

        socket.on('new-fault', async (data) => {
            console.log('New fault received:', data);

            // Update the local state to display the new node
            setNodes((prevNodes) => {
                const updatedNodes = [...prevNodes];
                const nodeIndex = updatedNodes.findIndex(n => n.nodeName === data.node);
                if (nodeIndex === -1) {
                    updatedNodes.push({
                        node: data.node,
                        status: data.status,
                        // Other node details (rack, shelf, slot, port, onu)
                    });
                } else {
                    updatedNodes[nodeIndex].status = data.status;
                }
                return updatedNodes;
            });

            // Send a request to update the inventory collection
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/inventory`, {
                    method: 'POST',  // Use 'POST' if adding a new node
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        node: data.node,
                        status: data.status,
                        // Add other necessary node fields like rack, shelf, etc.
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update the inventory collection');
                }
                console.log('Inventory updated successfully');
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        });

        return () => socket.disconnect();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        // Read the XLSX file using SheetJS
        const reader = new FileReader();
        reader.onload = (e) => {
            const ab = e.target.result;
            const wb = XLSX.read(ab, { type: 'array' });
    
            // Assuming data is on the first sheet
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Extract as a 2D array
    
            // Remove the header row (first row) for parsing data
            const rows = data.slice(1);
    
            // Parse the relevant data
            const parsedData = rows.map((row) => ({
                node: row[0],  // Node (e.g., rrk_1)
                rack: row[1],  // Rack (e.g., 2)
                shelf: row[2], // Shelf (e.g., 1)
                slot: row[3],  // Slot (e.g., 15)
                port: row[4],  // Port (e.g., 12)
                onu: row[5],   // ONU (e.g., 60)
                status: row[6].toLowerCase(),// Status (e.g., Healthy)
            }));
    
            // Send parsed data to the backend (store it in MongoDB)
            fetch(`${process.env.REACT_APP_API_URL}/api/faults/inventory/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to import data');
                }
                // After successful import, re-fetch the data
                return fetch(`${process.env.REACT_APP_API_URL}/api/faults/inventory`);
            })
            .then((response) => response.json())
            .then((data) => {
                const uniqueNodes = Array.from(
                    new Map(data.map((item) => [item.node, item])).values()
                );
                setNodes(uniqueNodes); // Update the table with the new data
            })
            .catch((error) => {
                console.error('Error importing data:', error);
                setErrorMessage('Error importing data. Please try again.');
            });
        };
    
        reader.readAsArrayBuffer(file);
    };


    return (
        <div className="newfault">
            <Navbar />
            <div className="inv-container">
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="file-upload">
                     <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="fileInput"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }} // Hides the default input field
                     />
                 <label htmlFor="fileInput" className="file-upload-button">
                   Upload File
                 </label>
              </div>


                <table>
                    <thead>
                        <tr>
                            <th>Node</th>
                            <th>Rack</th>
                            <th>Shelf</th>
                            <th>Slot</th>
                            <th>Port</th>
                            <th>ONU</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.map((node, index) => (
                            <tr key={index} className={node.status === 'fault' ? 'faulty-row' : ''}>
                                <td>{node.node}</td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editableNodes[index].rack || ''}
                                            onChange={(e) => handleInputChange(index, 'rack', e.target.value)}
                                        />
                                    ) : (
                                        node.rack
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editableNodes[index].shelf || ''}
                                            onChange={(e) => handleInputChange(index, 'shelf', e.target.value)}
                                        />
                                    ) : (
                                        node.shelf
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editableNodes[index].slot || ''}
                                            onChange={(e) => handleInputChange(index, 'slot', e.target.value)}
                                        />
                                    ) : (
                                        node.slot
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editableNodes[index].port || ''}
                                            onChange={(e) => handleInputChange(index, 'port', e.target.value)}
                                        />
                                    ) : (
                                        node.port
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editableNodes[index].onu || ''}
                                            onChange={(e) => handleInputChange(index, 'onu', e.target.value)}
                                        />
                                    ) : (
                                        node.onu
                                    )}
                                </td>
                                <td>{node.status === 'fault' ? 'Faulty' : 'Healthy'}</td>
                                <td>
                                    {editIndex === index ? (
                                        <button onClick={() => handleSaveClick(index)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(index)}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
