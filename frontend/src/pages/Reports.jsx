
import React, { useState, useEffect } from "react";
import "../styles/Reports.css";
import API from "../services/api";

function Reports() {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [billings, setBillings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [
        roomsRes,
        guestsRes,
        reservationsRes,
        billingRes,
        staffRes
      ] = await Promise.all([
        API.get("/rooms"),
        API.get("/guests"),
        API.get("/reservations"),
        API.get("/billing"),
        API.get("/staff")
      ]);

      setRooms(roomsRes.data.rooms || []);
      setGuests(guestsRes.data.guests || []);
      setReservations(reservationsRes.data.reservations || []);
      setBillings(
        billingRes.data.billings ||
        billingRes.data.billing ||
        []
      );
      setStaff(staffRes.data.staff || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to load reports data."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = billings
    .filter((bill) => bill.paymentStatus === "Paid")
    .reduce((total, bill) => total + Number(bill.amount || 0), 0);

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const occupancy = rooms.length
    ? Math.round((occupiedRooms / rooms.length) * 100)
    : 0;

  const reports = [
    {
      id: 1,
      title: "Room Occupancy Report",
      value: `${occupancy}%`
    },
    {
      id: 2,
      title: "Monthly Revenue Report",
      value: `Rs. ${totalRevenue.toLocaleString()}`
    },
    {
      id: 3,
      title: "Guest Booking Report",
      value: reservations.length
    },
    {
      id: 4,
      title: "Staff Performance Report",
      value: staff.length
    }
  ];

  if (loading) {
    return <div className="reports-page"><h2>Loading Reports...</h2></div>;
  }

  return (
    <div className="reports-page">
      <h2>Reports & Analytics</h2>
      <p>View hotel performance and business reports.</p>

      <div className="report-cards">
        <div className="report-card">
          <h3>Total Revenue</h3>
          <h2>Rs. {totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="report-card">
          <h3>Total Bookings</h3>
          <h2>{reservations.length}</h2>
        </div>

        <div className="report-card">
          <h3>Room Occupancy</h3>
          <h2>{occupancy}%</h2>
        </div>

        <div className="report-card">
          <h3>Total Guests</h3>
          <h2>{guests.length}</h2>
        </div>
      </div>

      <div className="reports-table">
        <h3>Available Reports</h3>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Name</th>
                <th>Report Value</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.title}</td>
                  <td>{report.value}</td>
                  <td>
                    <span className="report-status">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
