import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/maintenance";

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [vehicleID, setVehicleID] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [datePerformed, setDatePerformed] = useState("");
  const [cost, setCost] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get(API_URL);
      setMaintenanceData(response.data);
    } catch (error) {
      console.error("❌ Error fetching maintenance data:", error);
    }
  };

  const addMaintenanceRecord = async (e) => {
    e.preventDefault();
    if (!vehicleID || !maintenanceType || !datePerformed || !cost || !performedBy) {
      setMessage("⚠ Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(API_URL, {
        Vehicle_ID: vehicleID,
        Maintenance_Type: maintenanceType,
        Date_Performed: datePerformed,
        Cost: parseFloat(cost),
        Performed_By: performedBy,
      });

      setMessage(`Maintenance record added for vehicle "${vehicleID}`);
      setVehicleID("");
      setMaintenanceType("");
      setDatePerformed("");
      setCost("");
      setPerformedBy("");
      fetchMaintenanceData();
    } catch (error) {
      console.error("❌ Error adding maintenance record:", error);
      setMessage("❌ Failed to add maintenance record.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">🚗 Vehicle Maintenance</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Registered Maintenance Records</h2>
        <table className="min-w-full bg-gray-700 text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-600 text-pink-300">
              <th className="border-b px-4 py-2">Maintenance ID</th>
              <th className="border-b px-4 py-2">Vehicle ID</th>
              <th className="border-b px-4 py-2">Maintenance Type</th>
              <th className="border-b px-4 py-2">Date Performed</th>
              <th className="border-b px-4 py-2">Cost</th>
              <th className="border-b px-4 py-2">Performed By</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.length > 0 ? (
              maintenanceData.map((maintenance) => (
                <tr key={maintenance.Maintenance_ID} className="hover:bg-gray-600">
                  <td className="border-b px-4 py-2">{maintenance.Maintenance_ID}</td>
                  <td className="border-b px-4 py-2">{maintenance.Vehicle_ID}</td>
                  <td className="border-b px-4 py-2">{maintenance.Maintenance_Type}</td>
                  <td className="border-b px-4 py-2">{new Date(maintenance.Date_Performed).toLocaleString()}</td>
                  <td className="border-b px-4 py-2">${maintenance.Cost}</td>
                  <td className="border-b px-4 py-2">{maintenance.Performed_By}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border-b px-4 py-2 text-center text-pink-300">
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Add New Maintenance Record</h2>
        <form onSubmit={addMaintenanceRecord} className="space-y-3">
          <input
            type="text"
            placeholder="Vehicle ID"
            value={vehicleID}
            onChange={(e) => setVehicleID(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="text"
            placeholder="Maintenance Type"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="date"
            value={datePerformed}
            onChange={(e) => setDatePerformed(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="number"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="text"
            placeholder="Performed By"
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
          >
            ➕ Add Maintenance Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default Maintenance;