
import React, { useState, useEffect } from "react";
import "../styles/Maintenance.css";
import API from "../services/api";

function Maintenance() {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [room, setRoom] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [taskRes, roomRes] = await Promise.all([
        API.get("/maintenance"),
        API.get("/rooms")
      ]);

      setTasks(
        taskRes.data.maintenances ||
        taskRes.data.maintenance ||
        taskRes.data.tasks ||
        []
      );

      setRooms(roomRes.data.rooms || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load maintenance records.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setRoom("");
    setIssue("");
    setDescription("");
    setPriority("Medium");
    setStatus("Pending");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!room || !issue.trim()) {
      alert("Please select a room and enter an issue.");
      return;
    }

    const maintenanceData = {
      room,
      issue: issue.trim(),
      notes: description,
      priority,
      status
    };

    try {
      if (editingId) {
        await API.put(`/maintenance/${editingId}`, maintenanceData);
        alert("Maintenance request updated successfully!");
      } else {
        await API.post("/maintenance", maintenanceData);
        alert("Maintenance request added successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save maintenance request.");
    }
  };

  const handleEdit = (item) => {
    setRoom(
      typeof item.room === "object" ? item.room._id : item.room
    );
    setIssue(item.issue || "");
    setDescription(item.notes || "");
    setPriority(item.priority || "Medium");
    setStatus(item.status || "Pending");
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await API.delete(`/maintenance/${id}`);
        alert("Maintenance record deleted successfully!");

        if (editingId === id) {
          resetForm();
        }

        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete record.");
      }
    }
  };

  const getRoomNumber = (item) => {
    if (item.room && typeof item.room === "object") {
      return item.room.number || "Unknown Room";
    }

    const foundRoom = rooms.find((r) => r._id === item.room);
    return foundRoom ? foundRoom.number : "Unknown Room";
  };

  return (
    <div className="maintenance-container">
      <h2>Maintenance Management</h2>
      <p>Manage hotel room repairs and maintenance requests.</p>

      <div className="maintenance-card">
        <h3>
          {editingId ? "Edit Maintenance Request" : "Add Maintenance Request"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="maintenance-form-grid">
            <div>
              <label>Room Number *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              >
                <option value="">Select Room</option>
                {rooms.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Issue Title *</label>
              <input
                type="text"
                placeholder="Example: AC Not Working"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="maintenance-full-width">
              <label>Description</label>
              <textarea
                placeholder="Describe the maintenance issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="maintenance-submit-btn">
            {editingId ? "Update Request" : "Add Request"}
          </button>

          {editingId && (
            <button
              type="button"
              className="maintenance-cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="maintenance-card">
        <h3>Maintenance Records ({tasks.length})</h3>

        <div className="maintenance-table-wrapper">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Issue</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="maintenance-empty">
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                tasks.map((item) => (
                  <tr key={item._id}>
                    <td>{getRoomNumber(item)}</td>
                    <td>
                      <strong>{item.issue}</strong>
                    </td>
                    <td>{item.notes || "-"}</td>
                    <td>
                      <span className={`maintenance-badge ${(item.priority || "medium").toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`maintenance-badge ${(item.status || "pending").toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="maintenance-actions">
                        <button
                          className="maintenance-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="maintenance-delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
