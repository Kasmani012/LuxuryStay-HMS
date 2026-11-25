
import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Guests.css";

function Guests() {
  const [guests, setGuests] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET ALL GUESTS
  const fetchGuests = async () => {
    try {
      const response = await API.get("/guests");
      setGuests(response.data.guests || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load guests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setEditingId(null);
  };

  // ADD OR UPDATE GUEST
  const handleSubmit = async (e) => {
    e.preventDefault();

    const guestData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim()
    };

    try {
      if (editingId) {
        await API.put(`/guests/${editingId}`, guestData);
        alert("Guest updated successfully!");
      } else {
        await API.post("/guests", guestData);
        alert("Guest added successfully!");
      }

      resetForm();
      await fetchGuests();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  // EDIT GUEST
  const handleEdit = (guest) => {
    setEditingId(guest._id);
    setName(guest.name);
    setEmail(guest.email);
    setPhone(guest.phone);
    setAddress(guest.address);
  };

  // DELETE GUEST
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await API.delete(`/guests/${id}`);
        alert("Guest deleted successfully!");

        if (editingId === id) {
          resetForm();
        }

        await fetchGuests();

      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete guest.");
      }
    }
  };

  return (
    <div className="guests-page">
      <header className="guests-header">
        <h2>LuxuryStay</h2>
        <span>Admin Panel</span>
      </header>

      <main className="guests-content">
        <h2>Guests Management</h2>
        <p>Add and manage hotel guest information.</p>

        <section className="guest-form-section">
          <h3>{editingId ? "Edit Guest" : "Add New Guest"}</h3>

          <form onSubmit={handleSubmit} className="guest-form">
            <div>
              <label>Guest Name</label>
              <input
                type="text"
                placeholder="Enter guest name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="guest-form-actions">
              <button type="submit" className="guest-save-button">
                {editingId ? "Update Guest" : "Add Guest"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="guest-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="guest-list-section">
          <h3>All Guests ({guests.length})</h3>

          <div className="guest-table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading guests...</td>
                  </tr>
                ) : guests.length > 0 ? (
                  guests.map((guest) => (
                    <tr key={guest._id}>
                      <td>{guest.name}</td>
                      <td>{guest.email}</td>
                      <td>{guest.phone}</td>
                      <td>{guest.address}</td>
                      <td>
                        <button
                          className="guest-edit-button"
                          onClick={() => handleEdit(guest)}
                        >
                          Edit
                        </button>

                        <button
                          className="guest-delete-button"
                          onClick={() => handleDelete(guest._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No guests added yet.</td>
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

export default Guests;
