import React, { useState, useEffect } from 'react';
import Navbar from '../componants/newnavbar';
import "../css/inventory.css";

const Fault = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [faultyNodeCount, setFaultyNodeCount] = useState(0);

    // Fetch faulty nodes from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/faulty-nodes`); // Check if the API is correct
                const result = await response.json();
                if (response.ok) {
                    setData(result.nodes); // Ensure `nodes` is part of the response structure
                } else {
                    console.error('Error fetching data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching faulty nodes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch the count of faulty nodes from the backend
    useEffect(() => {
        const fetchFaultyNodeCount = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/faulty-nodes-count`);
                const data = await response.json();
                console.log('Faulty Node Count:', data);  // Debug log
                setFaultyNodeCount(data.faultyNodesCount);  // Ensure data.faultyNodesCount exists
            } catch (error) {
                console.error('Error fetching faulty node count:', error);
            }
        };

        fetchFaultyNodeCount();
    }, []);  // Run once on component mount

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/nodes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(prevData => prevData.filter(item => item._id !== id)); // Remove row from state
                alert('Row deleted successfully.');
            } else {
                const result = await response.json();
                console.error('Error deleting row:', result.message);
                alert('Error deleting row.');
            }
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    return (
        <div className='fault'>
            <Navbar />
            <div className='fault-container'>
                <div>
                    <p>No of faulty nodes: {faultyNodeCount}</p>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th>Rack</th>
                                <th>Shelf</th>
                                <th>Slot</th>
                                <th>Port</th>
                                <th>ONU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.node}</td>
                                    <td>{item.rack || ''}</td>
                                    <td>{item.shelf || ''}</td>
                                    <td>{item.slot || ''}</td>
                                    <td>{item.port || ''}</td>
                                    <td>{item.onu || ''}</td>
                                    <td>
                                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Fault;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Fault = () => {
//   const [alarmData, setAlarmData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAlarmData = async () => {
//       try {
//         const xmlData = `
//           <?xml version="1.0" encoding="utf-8"?>
//           <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                             xmlns:web="http://tempuri.org/">
//             <soapenv:Header/>
//             <soapenv:Body>
//               <web:GPONALARMS/>
//             </soapenv:Body>
//           </soapenv:Envelope>
//         `;

//         // const response = await axios.post(
//         //   '/FMT/WClogin.asmx?op=GPONALARMS', 
//         //   xmlData, 
//         //   {
//         //     headers: {
//         //       'Content-Type': 'text/xml; charset=utf-8',
//         //       'SOAPAction': 'http://tempuri.org/GPONALARMS'
//         //     }
//         //   }
//         // );

//         const response = await axios.post(
//             'http://localhost:5000/api/gponalarms',
//             { xmlData },
//           );
          
        
//         setAlarmData(response.data); // You may need to parse the XML response.
//       } catch (err) {
//         setError('Error fetching alarm data.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAlarmData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>Alarm Data</h1>
//       {alarmData && <pre>{JSON.stringify(alarmData, null, 2)}</pre>}
//     </div>
//   );
// };

// export default Fault;