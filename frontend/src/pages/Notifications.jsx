
import React, { useState, useEffect } from "react";
import "../styles/Notifications.css";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("General");
  const [status, setStatus] = useState("Unread");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");

      setNotifications(
        response.data.notifications ||
        response.data.notification ||
        []
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load notifications.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("General");
    setStatus("Unread");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter notification details.");
      return;
    }

    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      type,
      status
    };

    try {
      if (editId) {
        await API.put(`/notifications/${editId}`, notificationData);
        alert("Notification updated successfully!");
      } else {
        await API.post("/notifications", notificationData);
        alert("Notification added successfully!");
      }

      resetForm();
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save notification.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setMessage(item.message);
    setType(item.type);
    setStatus(item.status);
  };

  const handleMarkRead = async (item) => {
    try {
      await API.put(`/notifications/${item._id}`, {
        status: item.status === "Read" ? "Unread" : "Read"
      });

      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notification?")) {
      try {
        await API.delete(`/notifications/${id}`);
        alert("Notification deleted successfully!");
        fetchNotifications();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete notification.");
      }
    }
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <p>Manage hotel updates and important notifications.</p>

      <div className="notification-form">
        <h3>{editId ? "Update Notification" : "Create Notification"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="General">General</option>
            <option value="Booking">Booking</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Payment">Payment</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>

          <button type="submit">
            {editId ? "Update Notification" : "Add Notification"}
          </button>

          {editId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="notification-list">
        <h3>All Notifications ({notifications.length})</h3>

        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((item) => (
            <div className="notification-item" key={item._id}>
              <div>
                <span className="notification-type">{item.type}</span>

                <h4>{item.title}</h4>
                <p>{item.message}</p>

                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ""}
                </small>

                <p>Status: {item.status}</p>
              </div>

              <div>
                <button onClick={() => handleMarkRead(item)}>
                  Mark {item.status === "Read" ? "Unread" : "Read"}
                </button>

                <button onClick={() => handleEdit(item)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
