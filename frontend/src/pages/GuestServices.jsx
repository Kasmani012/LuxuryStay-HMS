
import React, { useState, useEffect } from "react";
import "../styles/GuestServices.css";
import API from "../services/api";

function GuestServices() {
  const [services, setServices] = useState([]);
  const [guests, setGuests] = useState([]);

  const [guest, setGuest] = useState("");
  const [serviceName, setServiceName] = useState("Room Service");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serviceRes, guestRes] = await Promise.all([
        API.get("/guest-services"),
        API.get("/guests")
      ]);

      setServices(
        serviceRes.data.services ||
        serviceRes.data.guestServices ||
        serviceRes.data.guestService ||
        []
      );

      setGuests(guestRes.data.guests || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load services.");
    }
  };

  const getGuestName = (item) => {
    if (item.guest && typeof item.guest === "object") {
      return item.guest.name || "Guest";
    }

    const found = guests.find((g) => g._id === item.guest);
    return found ? found.name : "Guest";
  };

  const resetForm = () => {
    setGuest("");
    setServiceName("Room Service");
    setAmount("");
    setStatus("Pending");
    setNotes("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guest || !amount || Number(amount) <= 0) {
      alert("Please enter valid service details.");
      return;
    }

    const serviceData = {
      guest,
      serviceName,
      amount: Number(amount),
      status,
      notes: notes.trim()
    };

    try {
      if (editId) {
        await API.put(`/guest-services/${editId}`, serviceData);
        alert("Service updated successfully!");
      } else {
        await API.post("/guest-services", serviceData);
        alert("Service added successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save service.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setGuest(
      typeof item.guest === "object"
        ? item.guest._id
        : item.guest
    );
    setServiceName(item.serviceName);
    setAmount(String(item.amount));
    setStatus(item.status);
    setNotes(item.notes || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await API.delete(`/guest-services/${id}`);
        alert("Service deleted successfully!");
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete service.");
      }
    }
  };

  return (
    <div className="guest-services-page">
      <h2>Guest Services</h2>
      <p>Manage additional services provided by the hotel.</p>

      <div className="service-form">
        <h3>{editId ? "Update Service" : "Add New Service"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="service-inputs">
            <select
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              required
            >
              <option value="">Select Guest</option>
              {guests.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            >
              <option value="Room Service">Room Service</option>
              <option value="Laundry">Laundry</option>
              <option value="Spa">Spa</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Service Amount (Rs.)"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <textarea
              placeholder="Service Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit">
              {editId ? "Update Service" : "Add Service"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-service-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="service-table">
        <h3>All Guest Services</h3>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Service Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((item) => (
                <tr key={item._id}>
                  <td>{getGuestName(item)}</td>
                  <td>{item.serviceName}</td>
                  <td>Rs. {item.amount}</td>
                  <td>{item.status}</td>
                  <td>{item.notes || "-"}</td>
                  <td>
                    <button
                      className="service-edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="service-delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {services.length === 0 && (
                <tr>
                  <td colSpan="6">No services available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GuestServices;
