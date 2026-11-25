
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Guests from "./pages/Guests";
import Staff from "./pages/Staff";
import Reservations from "./pages/Reservations";
import Billing from "./pages/Billing";
import Housekeeping from "./pages/Housekeeping";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import GuestServices from "./pages/GuestServices";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/housekeeping" element={<Housekeeping />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/guest-services" element={<GuestServices />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
