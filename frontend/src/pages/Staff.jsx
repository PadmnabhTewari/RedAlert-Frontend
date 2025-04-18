import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/staff";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [shiftFilter, setShiftFilter] = useState(""); // State for shift filter
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [stationId, setStationId] = useState("");
  const [shift, setShift] = useState("Morning");
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, [shiftFilter]); // Refetch staff when shift filter changes

  const fetchStaff = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { shift: shiftFilter }, // Pass shift filter as query param
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
      setMessage("❌ Failed to fetch staff members.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !designation || !contact || !email || !stationId || !shift || !shiftDate) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      const staffData = {
        Name: name,
        Designation: designation,
        Contact: contact,
        Email: email,
        Station_ID: stationId,
        Shift: shift,
        Shift_Date: shiftDate
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, staffData);
        setMessage(`✅ Staff member "${name}" updated successfully!`);
      } else {
        await axios.post(API_URL, staffData);
        setMessage(`✅ Staff member "${name}" added successfully!`);
      }

      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("❌ Error saving staff:", error);
      setMessage("❌ Failed to save staff member.");
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff.Staff_ID);
    setName(staff.Name);
    setDesignation(staff.Designation);
    setContact(staff.Contact);
    setEmail(staff.Email);
    setStationId(staff.Station_ID);
    setShift(staff.Shift);
    setShiftDate(staff.Shift_Date.split('T')[0]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage("✅ Staff member deleted successfully!");
        fetchStaff();
      } catch (error) {
        console.error("❌ Error deleting staff:", error);
        setMessage("❌ Failed to delete staff member.");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setContact("");
    setEmail("");
    setStationId("");
    setShift("Morning");
    setShiftDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const handleFilterChange = (e) => {
    setShiftFilter(e.target.value); // Update shift filter state
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">👨‍🚒 Fire Station Staff</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}

      {/* Filter by Shift */}
      <div className="mb-6">
        <label htmlFor="shiftFilter" className="text-pink-300 mr-2">Filter by Shift:</label>
        <select
          id="shiftFilter"
          value={shiftFilter}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
      </div>

      {/* Staff Form */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">
          {editingId ? "Edit Staff Member" : "Add New Staff Member"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              type="text"
              placeholder="Station ID"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition"
            >
              {editingId ? "Update Staff" : "Add Staff"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Staff List */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Staff Members</h2>
        <table className="min-w-full bg-gray-700 text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-600 text-pink-300">
              <th className="border-b px-4 py-2">ID</th>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">Designation</th>
              <th className="border-b px-4 py-2">Contact</th>
              <th className="border-b px-4 py-2">Email</th>
              <th className="border-b px-4 py-2">Station ID</th>
              <th className="border-b px-4 py-2">Shift</th>
              <th className="border-b px-4 py-2">Shift Date</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr key={staff.Staff_ID} className="hover:bg-gray-600">
                  <td className="border-b px-4 py-2">{staff.Staff_ID}</td>
                  <td className="border-b px-4 py-2">{staff.Name}</td>
                  <td className="border-b px-4 py-2">{staff.Designation}</td>
                  <td className="border-b px-4 py-2">{staff.Contact}</td>
                  <td className="border-b px-4 py-2">{staff.Email}</td>
                  <td className="border-b px-4 py-2">{staff.Station_ID}</td>
                  <td className="border-b px-4 py-2">{staff.Shift}</td>
                  <td className="border-b px-4 py-2">{staff.Shift_Date}</td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff.Staff_ID)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border-b px-4 py-2 text-center text-pink-300">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
