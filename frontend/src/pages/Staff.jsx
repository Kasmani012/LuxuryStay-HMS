
import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Staff.css";

function Staff() {
  const [staff, setStaff] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("Receptionist");
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET ALL STAFF
  const fetchStaff = async () => {
    try {
      const response = await API.get("/staff");
      setStaff(response.data.staff || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPosition("Receptionist");
    setSalary("");
    setEditingId(null);
  };

  // ADD OR UPDATE STAFF
  const handleSubmit = async (e) => {
    e.preventDefault();

    const staffData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: position,
      salary: Number(salary)
    };

    try {
      if (editingId) {
        await API.put(`/staff/${editingId}`, staffData);
        alert("Staff updated successfully!");
      } else {
        await API.post("/staff", staffData);
        alert("Staff added successfully!");
      }

      resetForm();
      await fetchStaff();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  // EDIT STAFF
  const handleEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setEmail(item.email);
    setPhone(item.phone);
    setPosition(item.role);
    setSalary(String(item.salary));
  };

  // DELETE STAFF
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await API.delete(`/staff/${id}`);
        alert("Staff deleted successfully!");

        if (editingId === id) {
          resetForm();
        }

        await fetchStaff();

      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete staff.");
      }
    }
  };

  return (
    <div className="staff-page">
      <header className="staff-header">
        <h2>LuxuryStay</h2>
        <span>Admin Panel</span>
      </header>

      <main className="staff-content">
        <h2>Staff Management</h2>
        <p>Add and manage hotel employees.</p>

        <section className="staff-form-section">
          <h3>{editingId ? "Edit Staff Member" : "Add New Staff"}</h3>

          <form className="staff-form" onSubmit={handleSubmit}>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter staff name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Email</label>
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
              <label>Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option>Receptionist</option>
                <option>Manager</option>
                <option>Housekeeper</option>
                <option>Accountant</option>
                <option>Security Guard</option>
                <option>Chef</option>
              </select>
            </div>

            <div>
              <label>Monthly Salary (PKR)</label>
              <input
                type="number"
                min="1"
                placeholder="Enter salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>

            <div className="staff-form-actions">
              <button type="submit" className="staff-save-button">
                {editingId ? "Update Staff" : "Add Staff"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="staff-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="staff-list-section">
          <h3>All Staff Members ({staff.length})</h3>

          <div className="staff-table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Salary (PKR)</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading staff...</td>
                  </tr>
                ) : staff.length > 0 ? (
                  staff.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.role}</td>
                      <td>{Number(item.salary).toLocaleString()}</td>
                      <td>
                        <button
                          className="staff-edit-button"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="staff-delete-button"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No staff members added yet.</td>
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

export default Staff;
