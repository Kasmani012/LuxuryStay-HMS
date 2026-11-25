
import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [guest, setGuest] = useState("");
  const [room, setRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("Confirmed");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD RESERVATIONS
  const fetchReservations = async () => {
    try {
      const response = await API.get("/reservations");
      setReservations(response.data.reservations || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD GUESTS AND ROOMS
  const fetchFormData = async () => {
    try {
      const [guestResponse, roomResponse] = await Promise.all([
        API.get("/guests"),
        API.get("/rooms")
      ]);

      setGuests(guestResponse.data.guests || []);
      setRooms(roomResponse.data.rooms || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load guests and rooms.");
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchFormData();
  }, []);

  const selectedRoom = rooms.find((item) => item._id === room);

  // CALCULATE TOTAL AMOUNT
  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) return 0;

    return nights * Number(selectedRoom.price);
  };

  // RESET FORM
  const resetForm = () => {
    setGuest("");
    setRoom("");
    setCheckIn("");
    setCheckOut("");
    setStatus("Confirmed");
    setEditingId(null);
  };

  // ADD OR UPDATE RESERVATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (!guest || !room) {
      alert("Please select a guest and room.");
      return;
    }

    const totalAmount = calculateTotal();

    if (totalAmount <= 0) {
      alert("Unable to calculate reservation amount.");
      return;
    }

    const reservationData = {
      guest,
      room,
      checkIn,
      checkOut,
      totalAmount,
      status
    };

    try {
      if (editingId) {
        await API.put(`/reservations/${editingId}`, reservationData);
        alert("Reservation updated successfully!");
      } else {
        await API.post("/reservations", reservationData);
        alert("Reservation added successfully!");
      }

      resetForm();
      await fetchReservations();
      await fetchFormData();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  // EDIT RESERVATION
  const handleEdit = (item) => {
    setEditingId(item._id);
    setGuest(item.guest?._id || item.guest);
    setRoom(item.room?._id || item.room);
    setCheckIn(new Date(item.checkIn).toISOString().slice(0, 10));
    setCheckOut(new Date(item.checkOut).toISOString().slice(0, 10));
    setStatus(item.status);
  };

  // DELETE RESERVATION
  const handleDelete = async (id) => {
    if (window.confirm("Delete this reservation?")) {
      try {
        await API.delete(`/reservations/${id}`);
        alert("Reservation deleted successfully!");

        if (editingId === id) resetForm();

        await fetchReservations();
        await fetchFormData();

      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete reservation.");
      }
    }
  };

  return (
    <div className="reservations-page">
      <header className="reservations-header">
        <h2>LuxuryStay</h2>
        <span>Admin Panel</span>
      </header>

      <main className="reservations-content">
        <h2>Reservations Management</h2>
        <p>Create and manage hotel room reservations.</p>

        <section className="reservation-form-section">
          <h3>{editingId ? "Edit Reservation" : "New Reservation"}</h3>

          <form onSubmit={handleSubmit} className="reservation-form">
            <div>
              <label>Guest Name</label>
              <select value={guest} onChange={(e) => setGuest(e.target.value)} required>
                <option value="">Select Guest</option>
                {guests.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Room Number</label>
              <select value={room} onChange={(e) => setRoom(e.target.value)} required>
                <option value="">Select Room</option>
                {rooms.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                    disabled={
                      item.status === "Maintenance" ||
                      (item.status === "Occupied" && room !== item._id)
                    }
                  >
                    {item.number} - {item.type} (PKR {item.price}) - {item.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Check-in Date</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
            </div>

            <div>
              <label>Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Booking Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Checked-Out">Checked-Out</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label>Total Amount (PKR)</label>
              <input type="text" value={calculateTotal().toLocaleString()} readOnly />
            </div>

            <div className="reservation-form-actions">
              <button type="submit" className="reservation-save-button">
                {editingId ? "Update Reservation" : "Add Reservation"}
              </button>

              {editingId && (
                <button type="button" className="reservation-cancel-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="reservation-list-section">
          <h3>All Reservations ({reservations.length})</h3>

          <div className="reservation-table-container">
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="7">Loading reservations...</td></tr>
                ) : reservations.length > 0 ? (
                  reservations.map((item) => (
                    <tr key={item._id}>
                      <td>{item.guest?.name || "Guest unavailable"}</td>
                      <td>{item.room?.number || "Room unavailable"}</td>
                      <td>{new Date(item.checkIn).toLocaleDateString()}</td>
                      <td>{new Date(item.checkOut).toLocaleDateString()}</td>
                      <td>PKR {Number(item.totalAmount).toLocaleString()}</td>
                      <td>{item.status}</td>
                      <td>
                        <button className="reservation-edit-button" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button className="reservation-delete-button" onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7">No reservations available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reservations;
