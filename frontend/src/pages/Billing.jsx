
import React, { useState, useEffect } from "react";
import "../styles/Billing.css";
import API from "../services/api";

function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [reservation, setReservation] = useState("");
  const [extraCharges, setExtraCharges] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const getId = (value) => {
    if (!value) return "";
    return typeof value === "object" ? value._id : value;
  };

  const fetchData = async () => {
    try {
      const [billingRes, reservationRes, guestRes, roomRes] =
        await Promise.all([
          API.get("/billing"),
          API.get("/reservations"),
          API.get("/guests"),
          API.get("/rooms")
        ]);

      setInvoices(billingRes.data.billings || []);
      setReservations(reservationRes.data.reservations || []);
      setGuests(guestRes.data.guests || []);
      setRooms(roomRes.data.rooms || []);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load billing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedReservation = reservations.find(
    (item) => item._id === reservation
  );

  const roomCharges = Number(selectedReservation?.totalAmount || 0);
  const total = roomCharges + Number(extraCharges || 0);

  const getGuestName = (reservationItem) => {
    const guestId = getId(reservationItem?.guest);
    const guestItem = guests.find((item) => item._id === guestId);
    return guestItem?.name || reservationItem?.guest?.name || "Unknown Guest";
  };

  const getRoomNumber = (reservationItem) => {
    const roomId = getId(reservationItem?.room);
    const roomItem = rooms.find((item) => item._id === roomId);
    return roomItem?.number || reservationItem?.room?.number || "Unknown Room";
  };

  const getInvoiceReservation = (invoice) => {
    const reservationId = getId(invoice.reservation);
    return reservations.find((item) => item._id === reservationId);
  };

  const resetForm = () => {
    setReservation("");
    setExtraCharges("0");
    setPaymentMethod("Cash");
    setPaymentStatus("Pending");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reservation) {
      alert("Please select a reservation.");
      return;
    }

    const invoiceData = {
      invoiceNumber: editingId
        ? invoices.find((item) => item._id === editingId)?.invoiceNumber
        : `INV-${Date.now()}`,
      reservation,
      amount: total,
      paymentMethod,
      paymentStatus
    };

    try {
      if (editingId) {
        await API.put(`/billing/${editingId}`, invoiceData);
        alert("Invoice updated successfully!");
      } else {
        await API.post("/billing", invoiceData);
        alert("Invoice created successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save invoice.");
    }
  };

  const handleEdit = (item) => {
    const reservationId = getId(item.reservation);
    const relatedReservation = reservations.find(
      (r) => r._id === reservationId
    );

    setEditingId(item._id);
    setReservation(reservationId);

    const baseAmount = Number(relatedReservation?.totalAmount || 0);
    setExtraCharges(String(Math.max(0, Number(item.amount) - baseAmount)));

    setPaymentMethod(item.paymentMethod || "Cash");
    setPaymentStatus(item.paymentStatus || "Pending");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this invoice?")) {
      try {
        await API.delete(`/billing/${id}`);
        alert("Invoice deleted successfully!");

        if (editingId === id) {
          resetForm();
        }

        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Unable to delete invoice.");
      }
    }
  };

  const totalRevenue = invoices
    .filter((item) => item.paymentStatus === "Paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pendingAmount = invoices
    .filter((item) => item.paymentStatus === "Pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="billing-page">
      <header className="billing-header">
        <h2>LuxuryStay</h2>
        <span>Admin Panel</span>
      </header>

      <main className="billing-content">
        <h2>Billing & Invoices</h2>
        <p>Generate and manage guest payments.</p>

        <div className="billing-summary">
          <div className="billing-card">
            <h3>Total Invoices</h3>
            <h2>{invoices.length}</h2>
          </div>

          <div className="billing-card">
            <h3>Paid Revenue</h3>
            <h2>PKR {totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="billing-card">
            <h3>Pending Payments</h3>
            <h2>PKR {pendingAmount.toLocaleString()}</h2>
          </div>
        </div>

        <section className="billing-form-section">
          <h3>{editingId ? "Edit Invoice" : "Create New Invoice"}</h3>

          <form className="billing-form" onSubmit={handleSubmit}>
            <div>
              <label>Reservation</label>
              <select
                value={reservation}
                onChange={(e) => setReservation(e.target.value)}
                required
              >
                <option value="">Select Reservation</option>
                {reservations.map((item) => (
                  <option key={item._id} value={item._id}>
                    {getGuestName(item)} - Room {getRoomNumber(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Room Charges (PKR)</label>
              <input
                type="number"
                value={roomCharges}
                readOnly
              />
            </div>

            <div>
              <label>Extra Services Charges (PKR)</label>
              <input
                type="number"
                min="0"
                value={extraCharges}
                onChange={(e) => setExtraCharges(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <label>Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="billing-total">
              <strong>Total Amount: PKR {total.toLocaleString()}</strong>
            </div>

            <div className="billing-form-actions">
              <button type="submit" className="billing-save-button">
                {editingId ? "Update Invoice" : "Generate Invoice"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="billing-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="invoice-list-section">
          <h3>All Invoices ({invoices.length})</h3>

          <div className="invoice-table-container">
            {loading ? (
              <p>Loading invoices...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((item) => {
                    const relatedReservation = getInvoiceReservation(item);

                    return (
                      <tr key={item._id}>
                        <td>{item.invoiceNumber}</td>
                        <td>{relatedReservation ? getGuestName(relatedReservation) : "Unknown Guest"}</td>
                        <td>{relatedReservation ? getRoomNumber(relatedReservation) : "Unknown Room"}</td>
                        <td>PKR {Number(item.amount || 0).toLocaleString()}</td>
                        <td>{item.paymentMethod}</td>
                        <td>{item.paymentStatus}</td>
                        <td>
                          <button
                            className="invoice-edit-button"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="invoice-delete-button"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan="7">No invoices available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Billing;
