import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplyTransaction = () => {
  const [formData, setFormData] = useState({
    Supplier_ID: '',
    Item_ID: '',
    Price: ''
  });

  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, [sortOrder]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/suppliers?sortByTotalItems=true&order=${sortOrder}`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      setError("Failed to fetch suppliers");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      console.error("❌ Error fetching items:", error);
      setError("Failed to fetch items");
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Supplier_ID || !formData.Item_ID || !formData.Price) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        const [supplierId, itemId] = editingId.split('-');
        await axios.put(`http://localhost:5000/api/suppliers/${supplierId}/items/${itemId}`, {
          Price: formData.Price
        });
        setMessage("✅ Supply transaction updated successfully!");
      } else {
        await axios.post(`http://localhost:5000/api/suppliers/${formData.Supplier_ID}/items`, {
          Item_ID: formData.Item_ID,
          Price: formData.Price
        });
        setMessage("✅ Supply transaction added successfully!");
      }
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error("❌ Error saving supply transaction:", error);
      setMessage("❌ Failed to save supply transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplierItem) => {
    setFormData({
      Supplier_ID: supplierItem.Supplier_ID,
      Item_ID: supplierItem.Item_ID,
      Price: supplierItem.Price
    });
    setEditingId(`${supplierItem.Supplier_ID}-${supplierItem.Item_ID}`);
  };

  const handleDelete = async (supplierId, itemId) => {
    if (window.confirm('Are you sure you want to delete this supply transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${supplierId}/items/${itemId}`);
        setMessage("✅ Supply transaction deleted successfully!");
        fetchSuppliers();
      } catch (error) {
        console.error("❌ Error deleting supply transaction:", error);
        setMessage("❌ Failed to delete supply transaction.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Supplier_ID: '',
      Item_ID: '',
      Price: ''
    });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-pink-400">📦 Supply Transactions</h1>

      {message && <p className="bg-gray-800 text-pink-300 p-2 rounded mb-4">{message}</p>}
      {error && <p className="bg-red-900 text-red-300 p-2 rounded mb-4">{error}</p>}

      <div className="bg-gray-800 shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Supply Transaction Records</h2>
        <div className="mb-4">
          <label htmlFor="sortOrder" className="text-pink-300 mr-2">Sort by Total Items:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
        <table className="min-w-full bg-gray-700 text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-600 text-pink-300">
              <th className="border-b px-4 py-2">Supplier</th>
              <th className="border-b px-4 py-2">Items</th>
              <th className="border-b px-4 py-2">Total Items</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.Supplier_ID} className="hover:bg-gray-600">
                  <td className="border-b px-4 py-2">{supplier.Name}</td>
                  <td className="border-b px-4 py-2">{supplier.Items || 'No items'}</td>
                  <td className="border-b px-4 py-2">{supplier.Total_Items || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border-b px-4 py-2 text-center text-pink-300">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2 text-pink-300">Add New Supply Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="Supplier_ID"
            value={formData.Supplier_ID}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.Supplier_ID} value={supplier.Supplier_ID}>
                {supplier.Name}
              </option>
            ))}
          </select>

          <select
            name="Item_ID"
            value={formData.Item_ID}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.Item_ID} value={item.Item_ID}>
                {item.Name} ({item.Category})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            placeholder="Price"
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button 
            type="submit" 
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingId ? '✏️ Update Transaction' : '➕ Add Transaction'}
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

export default SupplyTransaction;

