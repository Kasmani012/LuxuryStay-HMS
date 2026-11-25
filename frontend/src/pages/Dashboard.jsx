
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import API from "../services/api";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, guestsRes, reservationsRes] =
        await Promise.all([
          API.get("/rooms"),
          API.get("/guests"),
          API.get("/reservations")
        ]);

      setRooms(roomsRes.data.rooms || []);
      setGuests(guestsRes.data.guests || []);
      setReservations(reservationsRes.data.reservations || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const recentReservations = [...reservations]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-content">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h2>Dashboard</h2>
      <p>Welcome to LuxuryStay Hotel Management System.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Rooms</h3>
          <h2>{rooms.length}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Total Guests</h3>
          <h2>{guests.length}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Reservations</h3>
          <h2>{reservations.length}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Available Rooms</h3>
          <h2>{availableRooms}</h2>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Activity</h3>

        {recentReservations.length === 0 ? (
          <p>No recent activity available.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      {reservation.guest?.name || "Guest"}
                    </td>
                    <td>
                      {reservation.room?.number || "Room"}
                    </td>
                    <td>
                      {reservation.checkIn
                        ? new Date(reservation.checkIn).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {reservation.checkOut
                        ? new Date(reservation.checkOut).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{reservation.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Room Summary</h3>
        <p>Available Rooms: {availableRooms}</p>
        <p>Occupied Rooms: {occupiedRooms}</p>
      </div>
    </div>
  );
}

export default Dashboard;
