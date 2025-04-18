import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/reports";

const AdminReport = () => {
  const [reports, setReports] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // Add state for status filter

  useEffect(() => {
    fetchReports();
  }, [severityFilter, statusFilter]); // Refetch reports when filters change

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          severity: severityFilter !== "All" ? severityFilter : undefined, // Send undefined for "All"
          status: statusFilter !== "All" ? statusFilter : undefined, // Send undefined for "All"
        },
      });
      setReports(response.data); // Update reports with filtered data
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setMessage("❌ Failed to load reports.");
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`🔄 Changing status for Report #${id} to:`, newStatus);
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = async (id) => {
    const newStatus = statusUpdates[id];
  
    if (!newStatus) {
      alert("⚠️ Please select a status before updating.");
      return;
    }
  
    const confirmUpdate = window.confirm(
      `Are you sure you want to change status of Report #${id} to ${newStatus}?`
    );
  
    if (!confirmUpdate) return;
  
    try {
      const token = localStorage.getItem("token");
  
      console.log(`📡 Sending PATCH request for Report #${id} with status: ${newStatus}`);
  
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { Status: newStatus },  // Ensure this matches the backend field name
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Status Update Response:", response.data);
      setMessage(`✅ Report #${id} status updated successfully!`);
      fetchReports(); // Refresh reports list
    } catch (error) {
      console.error("❌ Error updating report status:", error);
      setMessage("❌ Failed to update report status.");
    }
  };
  
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">🚨 Admin Reports</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}

      <div className="mb-4">
        <label className="text-pink-300 mr-2">Filter by Severity:</label>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-1 bg-gray-800 text-white border border-gray-600 rounded"
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="text-pink-300 ml-4 mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1 bg-gray-800 text-white border border-gray-600 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <p className="text-pink-300 text-lg">Loading reports...</p>
      ) : (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-pink-300">All Reports</h2>
          <table className="min-w-full bg-gray-700 text-white border border-gray-700">
            <thead>
              <tr className="bg-gray-600 text-pink-300">
                <th className="border-b px-4 py-2">ID</th>
                <th className="border-b px-4 py-2">Address</th>
                <th className="border-b px-4 py-2">Pincode</th>
                <th className="border-b px-4 py-2">Description</th>
                <th className="border-b px-4 py-2">Severity</th>
                <th className="border-b px-4 py-2">Status</th>
                <th className="border-b px-4 py-2">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.Report_ID} className="hover:bg-gray-600">
                    <td className="border-b px-4 py-2">{report.Report_ID}</td>
                    <td className="border-b px-4 py-2">{report.Street_Address}</td>
                    <td className="border-b px-4 py-2">{report.Pincode}</td>
                    <td className="border-b px-4 py-2">{report.Description}</td>
                    <td className="border-b px-4 py-2">{report.Severity_Level}</td>
                    <td className="border-b px-4 py-2">{report.Status}</td>
                    <td className="border-b px-4 py-2">
                      <select
                        value={statusUpdates[report.Report_ID] || report.Status}
                        onChange={(e) => handleStatusChange(report.Report_ID, e.target.value)}
                        className="px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => updateStatus(report.Report_ID)}
                        className="ml-2 bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border-b px-4 py-2 text-center text-pink-300">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReport;
