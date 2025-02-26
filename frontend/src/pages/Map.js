import { useState, useEffect } from "react";
import Navbar from "../componants/newnavbar";
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import "../css/Map.css";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "1200px",
  height: "550px",
};

function App() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [engineerFilter, setEngineerFilter] = useState("");
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [healthyNodes, setHealthyNodes] = useState([]); // Healthy nodes list
  const [faultyNodes, setFaultyNodes] = useState([]); // Faulty nodes list
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Fetch locations and fault nodes data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const url = new URL(`${process.env.REACT_APP_API_URL}/api/locations`);
        const params = new URLSearchParams();

        if (regionFilter) params.append("region", regionFilter);
        if (provinceFilter) params.append("province", provinceFilter);
        if (engineerFilter) params.append("engineer", engineerFilter);

        url.search = params.toString();

        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          setLocations(result);
          setFilteredLocations(result);
        } else {
          setError(result.error || "Error fetching location data");
        }
      } catch (error) {
        setError("Failed to fetch location data. Please try again later.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFaultNodesCounts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faults/counts`);
        const result = await response.json();

        if (response.ok) {
          const healthy = result.healthyNodes || [];
          const faulty = result.faultNodes || [];
          setHealthyNodes(healthy);
          setFaultyNodes(faulty);
        } else {
          setError(result.error || "Error fetching fault nodes data");
        }
      } catch (error) {
        setError("Failed to fetch fault nodes data. Please try again later.");
        console.error("Error:", error);
      }
    };

    fetchLocations();
    fetchFaultNodesCounts();
  }, [regionFilter, provinceFilter, engineerFilter]);

  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/locations/filters`);
        const result = await response.json();

        if (response.ok) {
          setRegions(result.regions);
          setProvinces(result.provinces);
          setEngineers(result.engineers);
        } else {
          setError(result.error || "Error fetching filter values");
        }
      } catch (error) {
        setError("Failed to fetch filter values. Please try again later.");
        console.error("Error:", error);
      }
    };

    fetchFilterValues();
  }, []);

  const handleMarkerClick = (nodeName) => {
    navigate(`/faulty-node/${nodeName}`);
  };

  return (
    <div className="map-background">
      <Navbar />
      <div className="map-preview">
        <div className="left-side">
      {/* Display Healthy and Faulty Node Counts */}
      <div className="node-counts">
        <div className="non-f-nodes">
          Healthy Nodes Count: {healthyNodes.length}
        </div>
        <br></br>
        <div className="f-nodes">
          Fault Nodes Count: {faultyNodes.length}
        </div>
      </div>
          <div className="select-menu">
            <p>Select Filters</p>
            <div className="select-menu-select">
              <div className="select-menu-1">
                <div className="select-head">Region</div>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-menu-1">
                <div>Province</div>
                <select
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                >
                  <option value="">All Provinces</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-menu-1">
                <div>Engineer</div>
                <select
                  value={engineerFilter}
                  onChange={(e) => setEngineerFilter(e.target.value)}
                >
                  <option value="">All Engineers</option>
                  {engineers.map((engineer) => (
                    <option key={engineer} value={engineer}>
                      {engineer}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side">
          <MapContainer
            style={mapContainerStyle}
            center={[7.927079, 81]}
            zoom={7}
            fullscreenControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredLocations.map((location) => (
              <LeafletMarker
                key={location._id}
                position={[location.lat, location.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ margin: "0", color: "#333" }}>
                      {location.name || "Unnamed Location"}
                    </h3>
                    <button
                      style={{
                        marginTop: "10px",
                        cursor: "pointer",
                        padding: "8px 15px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "linear-gradient(135deg, #4facfe, #00c6ff)",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleMarkerClick(location.name)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </LeafletMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading">Loading data...</div>}
    </div>
  );
}

export default App;
