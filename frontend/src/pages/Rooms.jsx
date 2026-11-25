
import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  // LOAD ROOMS FROM DATABASE
  const fetchRooms = async () => {
    try {
      const response = await API.get("/rooms");
      setRooms(response.data.rooms || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setRoomNumber("");
    setRoomType("Single");
    setPrice("");
    setStatus("Available");
  };

  // ADD OR UPDATE ROOM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber.trim() || !price || Number(price) <= 0) {
      alert("Please enter a valid room number and price.");
      return;
    }

    const roomData = {
      number: roomNumber.trim(),
      type: roomType,
      price: Number(price),
      status: status
    };

    try {
      if (editingId) {
        await API.put(`/rooms/${editingId}`, roomData);
        alert("Room updated successfully!");
      } else {
        await API.post("/rooms", roomData);
        alert("Room added successfully!");
      }

      resetForm();
      await fetchRooms();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );
    }
  };

  // EDIT ROOM
  const handleEdit = (room) => {
    setEditingId(room._id);
    setRoomNumber(room.number);
    setRoomType(room.type);
    setPrice(room.price);
    setStatus(room.status);
  };

  // DELETE ROOM
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await API.delete(`/rooms/${id}`);
        alert("Room deleted successfully!");
        await fetchRooms();

        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Unable to delete room."
        );
      }
    }
  };

  return (
    <div className="rooms-page">
      <header className="rooms-header">
        <h2>LuxuryStay</h2>
        <span>Admin Panel</span>
      </header>

      <main className="rooms-content">
        <h2>Rooms Management</h2>
        <p>Add, update and manage hotel rooms.</p>

        <section className="room-form-section">
          <h3>{editingId ? "Edit Room" : "Add New Room"}</h3>

          <form className="room-form" onSubmit={handleSubmit}>
            <div>
              <label>Room Number</label>
              <input
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Enter room number"
                required
              />
            </div>

            <div>
              <label>Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option>Single</option>
                <option>Double</option>
                <option>Suite</option>
                <option>Deluxe</option>
              </select>
            </div>

            <div>
              <label>Price Per Night (PKR)</label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Available</option>
                <option>Occupied</option>
                <option>Maintenance</option>
              </select>
            </div>

            <button type="submit">
              {editingId ? "Update Room" : "Add Room"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="room-list-section">
          <h3>All Rooms ({rooms.length})</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Room No.</th>
                  <th>Type</th>
                  <th>Price Per Night</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading rooms...</td>
                  </tr>
                ) : rooms.length > 0 ? (
                  rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.number}</td>
                      <td>{room.type}</td>
                      <td>PKR {Number(room.price).toLocaleString()}</td>
                      <td>{room.status}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(room)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(room._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No rooms added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Rooms;
