
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logout successful!");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h3>LuxuryStay</h3>
      <p>Admin Panel</p>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/rooms">Rooms</NavLink>
        <NavLink to="/guests">Guests</NavLink>
        <NavLink to="/staff">Staff</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
        <NavLink to="/billing">Billing</NavLink>
        <NavLink to="/housekeeping">Housekeeping</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/feedback">Feedback</NavLink>
        <NavLink to="/guest-services">Guest Services</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
