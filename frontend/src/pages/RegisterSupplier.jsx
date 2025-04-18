import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterSupplier = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Contact_Phone: '',
    Email: '',
    Address: ''
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      setError("Failed to fetch suppliers");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/suppliers/${editingId}`, formData);
        setMessage("✅ Supplier updated successfully!");
      } else {
        await axios.post('http://localhost:5000/api/suppliers', formData);
        setMessage("✅ Supplier registered successfully!");
      }
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error("❌ Error saving supplier:", error);
      setMessage("❌ Failed to save supplier.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      Name: supplier.Name,
      Contact_Phone: supplier.Contact_Phone,
      Email: supplier.Email,
      Address: supplier.Address
    });
    setEditingId(supplier.Supplier_ID);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
        setMessage("✅ Supplier deleted successfully!");
        fetchSuppliers();
      } catch (error) {
        console.error("❌ Error deleting supplier:", error);
        setMessage("❌ Failed to delete supplier.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Contact_Phone: '',
      Email: '',
      Address: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">🏢 Register Supplier</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}
      {error && <p className="bg-red-900 text-red-300 p-2 rounded mb-4">{error}</p>}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Registered Suppliers</h2>
        <table className="min-w-full bg-gray-700 text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-600 text-pink-300">
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">Contact</th>
              <th className="border-b px-4 py-2">Email</th>
              <th className="border-b px-4 py-2">Address</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.Supplier_ID} className="hover:bg-gray-600">
                  <td className="border-b px-4 py-2">{supplier.Name}</td>
                  <td className="border-b px-4 py-2">{supplier.Contact_Phone}</td>
                  <td className="border-b px-4 py-2">{supplier.Email}</td>
                  <td className="border-b px-4 py-2">{supplier.Address}</td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-pink-300 hover:text-pink-400 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.Supplier_ID)}
                      className="text-pink-300 hover:text-pink-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border-b px-4 py-2 text-center text-pink-300">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Add New Supplier</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Supplier Name"
            required
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="tel"
            name="Contact_Phone"
            value={formData.Contact_Phone}
            onChange={handleChange}
            placeholder="Contact Phone"
            required
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <textarea
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Address"
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button 
            type="submit" 
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingId ? '✏️ Update Supplier' : '➕ Add Supplier'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition mt-2"
            >
              ❌ Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterSupplier;
