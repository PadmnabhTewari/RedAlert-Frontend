import React, { useState, useEffect } from "react";
import axios from "axios";

const API_VEHICLES = "http://localhost:5000/api/vehicles";
const API_MODELS = "http://localhost:5000/api/vehicles/models";
const API_STATIONS = "http://localhost:5000/api/fire-stations/dropdown";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [stations, setStations] = useState([]);
  const [modelId, setModelId] = useState("");
  const [status, setStatus] = useState("Available");
  const [stationId, setStationId] = useState("");
  const [lastMaintenance, setLastMaintenance] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState(""); // Add state for sorting

  useEffect(() => {
    fetchVehicles();
    fetchVehicleModels();
    fetchStations();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_VEHICLES}?sort=${sortOption}`);
      setVehicles(response.data);
    } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
      setError("Failed to fetch vehicles");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [sortOption]);

  const fetchVehicleModels = async () => {
    try {
      const response = await axios.get(API_MODELS);
      setVehicleModels(response.data);
    } catch (error) {
      console.error("❌ Error fetching vehicle models:", error);
      setError("Failed to fetch vehicle models");
    }
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get(API_STATIONS);
      console.log("Stations data:", response.data);
      setStations(response.data);
    } catch (error) {
      console.error("❌ Error fetching stations:", error);
      setError("Failed to fetch stations");
    }
  };

  const addVehicle = async (e) => {
    e.preventDefault();
    if (!modelId) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(API_VEHICLES, {
        model_id: modelId,
        status,
        station_id: stationId || null,
        last_maintenance_date: lastMaintenance || null,
      });

      setMessage("✅ Vehicle added successfully!");
      setModelId("");
      setStatus("Available");
      setStationId("");
      setLastMaintenance("");
      fetchVehicles();
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      setMessage("❌ Failed to add vehicle.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">🚒 Fire Station Vehicles</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}
      {error && <p className="bg-red-900 text-red-300 p-2 rounded mb-4">{error}</p>}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Registered Vehicles</h2>
        <div className="mb-4">
          <label htmlFor="sort" className="text-pink-300 mr-2">Sort By:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Default</option>
            <option value="maintenance_asc">Maintenance Date (Ascending)</option>
            <option value="maintenance_desc">Maintenance Date (Descending)</option>
          </select>
        </div>
        <table className="min-w-full bg-gray-700 text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-600 text-pink-300">
              <th className="border-b px-4 py-2">ID</th>
              <th className="border-b px-4 py-2">Model</th>
              <th className="border-b px-4 py-2">Status</th>
              <th className="border-b px-4 py-2">Station</th>
              <th className="border-b px-4 py-2">Last Maintenance</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr key={vehicle.Vehicle_ID} className="hover:bg-gray-600">
                  <td className="border-b px-4 py-2">{vehicle.Vehicle_ID}</td>
                  <td className="border-b px-4 py-2">{vehicle.Model_Type}</td>
                  <td className="border-b px-4 py-2">{vehicle.Status}</td>
                  <td className="border-b px-4 py-2">{vehicle.Station_Name || "Unassigned"}</td>
                  <td className="border-b px-4 py-2">{vehicle.Last_Maintenance_Date || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border-b px-4 py-2 text-center text-pink-300">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Add New Vehicle</h2>
        <form onSubmit={addVehicle} className="space-y-3">
          <select 
            value={modelId} 
            onChange={(e) => setModelId(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" 
            required
          >
            <option value="">Select Model</option>
            {vehicleModels.map((model) => (
              <option key={model.Model_ID} value={model.Model_ID}>{model.Type}</option>
            ))}
          </select>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          <select 
            value={stationId} 
            onChange={(e) => {
              console.log("Selected station:", e.target.value);
              setStationId(e.target.value);
            }} 
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Station (Optional)</option>
            {stations && stations.map((station) => (
              <option key={station.Station_ID} value={station.Station_ID}>
                {station.Name}
              </option>
            ))}
          </select>
          <input 
            type="datetime-local" 
            placeholder="Last Maintenance Date" 
            value={lastMaintenance} 
            onChange={(e) => setLastMaintenance(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400" 
          />
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">➕ Add Vehicle</button>
        </form>
      </div>
    </div>
  );
};

export default Vehicles;
