import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const UserReport = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to manage the report form
  const [newReport, setNewReport] = useState({
    Street_Address: "",
    Pincode: "",
    City: "",
    State: "",
    Description: "",
    Severity_Level: "Low",
  });

  // State to store reports
  const [reports, setReports] = useState([]);

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/user/reports`, newReport, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Report submitted successfully!");
      navigate("/user/reports");
      window.location.reload(); // Refresh to show new report
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Submit a New Report</h2>
      <form onSubmit={handleSubmit}>
        {/* Street Address */}
        <div className="mb-4">
          <label className="block mb-1">Street Address</label>
          <input
            type="text"
            name="Street_Address"
            placeholder="Enter Street Address"
            value={newReport.Street_Address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
        </div>

        {/* Pincode */}
        <div className="mb-4">
          <label className="block mb-1">Pincode</label>
          <input
            type="text"
            name="Pincode"
            placeholder="Enter Pincode"
            value={newReport.Pincode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block mb-1">City</label>
          <input
            type="text"
            name="City"
            placeholder="Enter City"
            value={newReport.City}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block mb-1">State</label>
          <input
            type="text"
            name="State"
            placeholder="Enter State"
            value={newReport.State}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="Description"
            placeholder="Describe the issue"
            value={newReport.Description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
            required
          ></textarea>
        </div>

        {/* Severity Level */}
        <div className="mb-4">
          <label className="block mb-1">Severity Level</label>
          <select
            name="Severity_Level"
            value={newReport.Severity_Level}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded"
        >
          Submit Report
        </button>
      </form>

      {/* Report List */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Reports</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-700 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-3">Street Address</th>
              <th className="p-3">Pincode</th>
              <th className="p-3">City</th>
              <th className="p-3">State</th>
              <th className="p-3">Description</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.Report_ID} className="border-b border-gray-600">
                  <td className="p-3">{report.Street_Address}</td>
                  <td className="p-3">{report.Pincode}</td>
                  <td className="p-3">{report.City}</td>
                  <td className="p-3">{report.State}</td>
                  <td className="p-3">{report.Description}</td>
                  <td className="p-3">{report.Severity_Level}</td>
                  <td className="p-3">{report.Status}</td>
                  <td className="p-3">{new Date(report.Report_Date_Time).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReport;
