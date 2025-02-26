// import { useState } from "react";
// import Navbar from '../componants/navbar';
// import "../css/Newfault.css"

// const NewFault = () => {
//   const [node, setNode] = useState("");
//   const [rack, setRack] = useState("");
//   const [shelf, setShelf] = useState("");
//   const [slot, setSlot] = useState("");
//   const [port, setPort] = useState("");
//   const [onu, setOnu] = useState("");

//   // Function to parse fault alarm and extract details
//   const parseFaultAlarm = (alarm) => {
//     const nodeRegex = /(\w+_\w+_\w+)/; // Matches the node, e.g., MAY_C300M_02
//     const rackRegex = /RACK=(\d+)/; // Matches rack number
//     const shelfRegex = /SHELF=(\d+)/; // Matches shelf number
//     const slotRegex = /SLOT=(\d+)/; // Matches slot number
//     const portRegex = /PORT=(\d+)/; // Matches port number
//     const onuRegex = /ONU=(\d+)/; // Matches ONU number (if present)

//     setNode(alarm.match(nodeRegex)?.[1] || "");
//     setRack(alarm.match(rackRegex)?.[1] || "");
//     setShelf(alarm.match(shelfRegex)?.[1] || "");
//     setSlot(alarm.match(slotRegex)?.[1] || "");
//     setPort(alarm.match(portRegex)?.[1] || "");
//     setOnu(alarm.match(onuRegex)?.[1] || "");
//   };

//   // Handler for when the fault alarm is pasted
//   const handleFaultAlarmChange = (e) => {
//     const alarm = e.target.value;
//     parseFaultAlarm(alarm);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="node-details-container">
//         <input
//           type="textbox"
//           placeholder="Add the Fault Alarm Here"
//           className="faultbox"
//           onChange={handleFaultAlarmChange}
//         />
//         <br />
//         <form className="node-details">
//           <input type="textbox" value={node} placeholder="Node" className="txt" readOnly />
//           <input type="textbox" value={rack} placeholder="Rack" className="txt" readOnly />
//           <input type="textbox" value={shelf} placeholder="Shelf" className="txt" readOnly />
//           <input type="textbox" value={slot} placeholder="Slot" className="txt" readOnly />
//           <input type="textbox" value={port} placeholder="Port" className="txt" readOnly />
//           <input type="textbox" value={onu} placeholder="Onu" className="txt" readOnly />
//           <button type="submit" className="sub-btn">
//             Add New Error
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewFault;


import { useState } from "react";
import axios from "axios";
import Navbar from '../componants/newnavbar';
import "../css/Newfault.css";

const NewFault = () => {
  const [node, setNode] = useState("");
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [slot, setSlot] = useState("");
  const [port, setPort] = useState("");
  const [onu, setOnu] = useState("");

  const parseFaultAlarm = (alarm) => {
    const nodeRegex = /(\w+_\w+_\w+)/;
    const rackRegex = /RACK=(\d+)/;
    const shelfRegex = /SHELF=(\d+)/;
    const slotRegex = /SLOT=(\d+)/;
    const portRegex = /PORT=(\d+)/;
    const onuRegex = /ONU=(\d+)/;

    setNode(alarm.match(nodeRegex)?.[1] || "");
    setRack(alarm.match(rackRegex)?.[1] || "");
    setShelf(alarm.match(shelfRegex)?.[1] || "");
    setSlot(alarm.match(slotRegex)?.[1] || "");
    setPort(alarm.match(portRegex)?.[1] || "");
    setOnu(alarm.match(onuRegex)?.[1] || "");
  };

  const handleFaultAlarmChange = (e) => {
    const alarm = e.target.value;
    parseFaultAlarm(alarm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/faults/add-fault`, {
        node,
        rack,
        shelf,
        slot,
        port,
        onu: onu || null, // If ONU is empty, send null
        status: "fault", // Default status as 'fault'
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding fault:", error);
      alert("Error adding fault. Please check the console for details.");
    }
  };

  return (
    <div className="newfault">
      <Navbar />
      <div className="node-details-container">
        <input
          type="textbox"
          placeholder="Add the Fault Alarm Here"
          className="faultbox"
          onChange={handleFaultAlarmChange}
        />
        <br />
        <form className="node-details" onSubmit={handleSubmit}>
          <input type="textbox" value={node} placeholder="Node" className="txt" readOnly />
          <input type="textbox" value={rack} placeholder="Rack" className="txt" readOnly />
          <input type="textbox" value={shelf} placeholder="Shelf" className="txt" readOnly />
          <input type="textbox" value={slot} placeholder="Slot" className="txt" readOnly />
          <input type="textbox" value={port} placeholder="Port" className="txt" readOnly />
          <input type="textbox" value={onu} placeholder="Onu" className="txt" readOnly />
          <button type="submit" className="sub-btn">
            Add New Error
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewFault;
