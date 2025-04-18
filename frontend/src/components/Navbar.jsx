import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-red-900 to-red-800 p-4 text-white shadow-lg">
      <div className="container mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white mb-2">🚒 Red-Alert</h1>
          <div className="space-y-1">
            <p className="text-lg text-red-100 italic">"Courage is not the absence of fear, but the triumph over it."</p>
          </div>
          {token && (
            <div className="mt-4">
              <span className="text-red-100 mr-4">
                {userRole === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
