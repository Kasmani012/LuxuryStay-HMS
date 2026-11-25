
import React, { useState, useEffect } from "react";
import "../styles/Housekeeping.css";
import API from "../services/api";

function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [room, setRoom] = useState("");
  const [type, setType] = useState("Cleaning");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [taskRes, roomRes] = await Promise.all([
        API.get("/housekeeping"),
        API.get("/rooms")
      ]);

      setTasks(
        taskRes.data.housekeeping ||
        taskRes.data.housekeepings ||
        taskRes.data.tasks ||
        []
      );

      setRooms(roomRes.data.rooms || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load housekeeping data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setRoom("");
    setType("Cleaning");
    setStatus("Pending");
    setNotes("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!room) {
      alert("Please select a room.");
      return;
    }

    const taskData = {
      room,
      task: type,
      status,
      notes
    };

    try {
      if (editingId) {
        await API.put(`/housekeeping/${editingId}`, taskData);
        alert("Housekeeping task updated successfully!");
      } else {
        await API.post("/housekeeping", taskData);
        alert("Housekeeping task added successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save housekeeping task.");
    }
  };

  const handleEdit = (item) => {
    setRoom(typeof item.room === "object" ? item.room._id : item.room);
    setType(item.task);
    setStatus(item.status);
    setNotes(item.notes || "");
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/housekeeping/${id}`);
        alert("Task deleted successfully!");

        if (editingId === id) {
          resetForm();
        }

        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete task.");
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
    <div className="housekeeping-container">
      <h2>Housekeeping Management</h2>
      <p>Manage room cleaning tasks.</p>

      <div className="housekeeping-card">
        <h3>{editingId ? "Edit Cleaning Task" : "Add Cleaning Task"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="housekeeping-form-grid">
            <div>
              <label>Room Number</label>
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
              <label>Task Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>

            <div>
              <label>Task Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label>Notes</label>
              <input
                type="text"
                placeholder="Enter task notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="hk-submit-btn">
            {editingId ? "Update Task" : "Add Task"}
          </button>

          {editingId && (
            <button
              type="button"
              className="hk-cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="housekeeping-card">
        <h3>Cleaning Tasks ({tasks.length})</h3>

        <div className="hk-table-wrapper">
          <table className="hk-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Task Type</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5">No cleaning tasks found.</td>
                </tr>
              ) : (
                tasks.map((item) => (
                  <tr key={item._id}>
                    <td>{getRoomNumber(item)}</td>
                    <td>{item.task}</td>
                    <td>{item.notes || "-"}</td>
                    <td>
                      <span className={`hk-status ${item.status.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="hk-actions">
                        <button
                          className="hk-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="hk-delete-btn"
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

export default Housekeeping;
