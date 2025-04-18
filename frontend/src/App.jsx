import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import FireStations from "./pages/FireStations";
import Vehicles from "./pages/Vehicles";
import Staff from "./pages/Staff";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Maintenance from "./pages/Maintenance";
import Supplier from "./pages/RegisterSupplier";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminReport from "./pages/AdminReport"; // ✅ Import AdminReport
import UserReport from "./pages/UserReport"; // ✅ Import UserReport
import SupplyTransaction from "./pages/SupplyTransaction"; // ✅ Import SupplyTransaction

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <div className={`flex-1 p-4 ${isAuthPage ? "w-full" : ""}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Redirect "/" to "/dashboard" */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/user/reports"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserReport />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/supply"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SupplyTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fire-stations"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FireStations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/maintenance"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Maintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/suppliers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Supplier />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
