import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    fireStations: 0,
    vehicles: 0,
    staff: 0,
    reports: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_URL);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-pink-400">🔥 Fire Station Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-pink-300">Total Fire Stations</h2>
          <p className="text-4xl font-bold text-white">{stats.fireStations}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-300">Total Vehicles</h2>
          <p className="text-4xl font-bold text-white">{stats.vehicles}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-yellow-300">Total Staff</h2>
          <p className="text-4xl font-bold text-white">{stats.staff}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-400">Total Reports</h2>
          <p className="text-4xl font-bold text-white">{stats.reports}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
