import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/fire-stations";

const FireStations = () => {
  const [fireStations, setFireStations] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'Name',
    sortOrder: 'ASC'
  });
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    pincode: "",
    city: "",
    state: "",
    streetAddress: "",
    landmark: "",
    latitude: "",
    longitude: "",
    status: "Active",
    capacity: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Sort config changed:', sortConfig);
    fetchFireStations();
  }, [sortConfig]);

  const fetchFireStations = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching with sort params:', sortConfig);
      const response = await axios.get(API_URL, {
        params: {
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder
        }
      });
      console.log('Received sorted data:', response.data);
      console.log('Sorting values:', response.data.map(station => ({
        name: station.Name,
        staff: station.Total_Staff,
        vehicles: station.Total_Vehicles
      })));
      setFireStations(response.data);
    } catch (error) {
      console.error("❌ Error fetching fire stations:", error);
      setMessage("❌ Failed to fetch fire stations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    console.log('Sorting by:', field);
    setSortConfig(prev => {
      const newConfig = {
        sortBy: field,
        sortOrder: prev.sortBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      };
      console.log('New sort config:', newConfig);
      return newConfig;
    });
  };

  const handleSortOrderChange = () => {
    console.log('Changing sort order');
    setSortConfig(prev => {
      const newConfig = {
        ...prev,
        sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      };
      console.log('New sort config:', newConfig);
      return newConfig;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFireStation = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'contactNumber', 'pincode', 'city', 'state', 'streetAddress'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setMessage(`⚠️ Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(API_URL, formData);
      
      setMessage(`✅ Fire station "${formData.name}" added successfully!`);
      setFormData({
        name: "",
        contactNumber: "",
        pincode: "",
        city: "",
        state: "",
        streetAddress: "",
        landmark: "",
        latitude: "",
        longitude: "",
        status: "Active",
        capacity: ""
      });
      fetchFireStations();
    } catch (error) {
      console.error("❌ Error adding fire station:", error);
      setMessage(error.response?.data?.error || "❌ Failed to add fire station");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">🚒 Fire Stations Management</h1>

      {message && (
        <div className={`p-3 mb-4 rounded ${message.startsWith("✅") ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"}`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-pink-300">Registered Fire Stations</h2>
          <div className="flex items-center space-x-2">
            <label className="text-pink-300">Sort by:</label>
            <select
              value={sortConfig.sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="Name">Name</option>
              <option value="Total_Staff">Staff Count</option>
              <option value="Total_Vehicles">Vehicle Count</option>
            </select>
            <button
              onClick={handleSortOrderChange}
              className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {sortConfig.sortOrder === 'ASC' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-4">Loading fire stations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 text-white border border-gray-700">
              <thead>
                <tr className="bg-gray-600 text-pink-300">
                  <th className="border-b px-4 py-2">ID</th>
                  <th className="border-b px-4 py-2">
                    <div className="flex items-center space-x-1">
                      Name
                      {sortConfig.sortBy === 'Name' && (
                        <span>{sortConfig.sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="border-b px-4 py-2">Address</th>
                  <th className="border-b px-4 py-2">City/State</th>
                  <th className="border-b px-4 py-2">Contact</th>
                  <th className="border-b px-4 py-2">
                    <div className="flex items-center space-x-1">
                      Staff
                      {sortConfig.sortBy === 'Total_Staff' && (
                        <span>{sortConfig.sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="border-b px-4 py-2">
                    <div className="flex items-center space-x-1">
                      Vehicles
                      {sortConfig.sortBy === 'Total_Vehicles' && (
                        <span>{sortConfig.sortOrder === 'ASC' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="border-b px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {fireStations.length > 0 ? (
                  fireStations.map((station) => (
                    <tr key={station.Station_ID} className="hover:bg-gray-600">
                      <td className="border-b px-4 py-2">{station.Station_ID}</td>
                      <td className="border-b px-4 py-2">{station.Name}</td>
                      <td className="border-b px-4 py-2">
                        {station.Street_Address}
                        {station.Landmark && ` (${station.Landmark})`}
                      </td>
                      <td className="border-b px-4 py-2">
                        {station.City}, {station.State} - {station.Pincode}
                      </td>
                      <td className="border-b px-4 py-2">{station.Contact_Number}</td>
                      <td className="border-b px-4 py-2">{station.Total_Staff}</td>
                      <td className="border-b px-4 py-2">{station.Total_Vehicles}</td>
                      <td className="border-b px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          station.Status === 'Active' ? 'bg-green-600' :
                          station.Status === 'Under Renovation' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {station.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="border-b px-4 py-2 text-center text-pink-300">
                      No fire stations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Add New Fire Station</h2>
        <form onSubmit={addFireStation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-pink-300">Basic Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Fire Station Name *"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Primary Contact Number *"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Renovation">Under Renovation</option>
            </select>
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-pink-300">Location Information</h3>
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address *"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode *"
                value={formData.pincode}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={formData.city}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={formData.state}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "➕ Add Fire Station"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FireStations;