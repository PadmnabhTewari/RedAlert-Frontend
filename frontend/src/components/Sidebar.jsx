import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const isActive = (path) => {
    return location.pathname === path ? 'bg-pink-600' : 'bg-gray-800';
  };

  const userLinks = [
    { path: '/user/reports', label: '📄 Reports' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: '📊 Dashboard' },
    { path: '/admin/fire-stations', label: '🚒 Fire Stations' },
    { path: '/admin/vehicles', label: '🚗 Vehicles' },
    { path: '/admin/staff', label: '👨‍🚒 Staff' },
    { path: '/admin/reports', label: '📄 Reports' },
    { path: '/admin/suppliers', label: '📦 Register Suppliers' },
    { path: '/admin/maintenance', label: '🛠 Maintenance' },
    { path: '/admin/supply', label: '📦 Supply Transactions' },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-pink-400 mb-6">🔥 Fire Station</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded ${isActive(link.path)} hover:bg-pink-600 transition`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;