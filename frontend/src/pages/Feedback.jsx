
import React, { useState, useEffect } from "react";
import "../styles/Feedback.css";
import API from "../services/api";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [guests, setGuests] = useState([]);

  const [guest, setGuest] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbackRes, guestRes] = await Promise.all([
        API.get("/feedback"),
        API.get("/guests")
      ]);

      setFeedbacks(
        feedbackRes.data.feedbacks ||
        feedbackRes.data.feedback ||
        []
      );

      setGuests(guestRes.data.guests || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load feedback.");
    }
  };

  const getGuestName = (item) => {
    if (item.guest && typeof item.guest === "object") {
      return item.guest.name || "Guest";
    }

    const foundGuest = guests.find(
      (g) => g._id === item.guest
    );

    return foundGuest ? foundGuest.name : "Guest";
  };

  const resetForm = () => {
    setGuest("");
    setRating("5");
    setComment("");
    setStatus("Pending");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guest || !comment.trim()) {
      alert("Please select a guest and enter a comment.");
      return;
    }

    const feedbackData = {
      guest,
      rating: Number(rating),
      comment: comment.trim(),
      status
    };

    try {
      if (editId) {
        await API.put(`/feedback/${editId}`, feedbackData);
        alert("Feedback updated successfully!");
      } else {
        await API.post("/feedback", feedbackData);
        alert("Feedback added successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save feedback.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setGuest(
      typeof item.guest === "object"
        ? item.guest._id
        : item.guest
    );
    setRating(String(item.rating));
    setComment(item.comment);
    setStatus(item.status || "Pending");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await API.delete(`/feedback/${id}`);
        alert("Feedback deleted successfully!");
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete feedback.");
      }
    }
  };

  const averageRating = feedbacks.length
    ? (
        feedbacks.reduce((sum, item) => sum + Number(item.rating), 0) /
        feedbacks.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="feedback-page">
      <h2>Guest Feedback</h2>
      <p>Manage guest reviews and ratings.</p>

      <div className="feedback-summary">
        <div className="feedback-card">
          <h3>Total Reviews</h3>
          <h2>{feedbacks.length}</h2>
        </div>

        <div className="feedback-card">
          <h3>Average Rating</h3>
          <h2>{averageRating} / 5</h2>
        </div>
      </div>

      <div className="feedback-list">
        <h3>{editId ? "Edit Feedback" : "Add Feedback"}</h3>

        <form onSubmit={handleSubmit}>
          <label>Guest Name</label>
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

          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>

          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter guest feedback..."
            required
          />

          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
          </select>

          <button type="submit">
            {editId ? "Update Feedback" : "Add Feedback"}
          </button>

          {editId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="feedback-list">
        <h3>All Guest Reviews</h3>

        {feedbacks.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          feedbacks.map((item) => (
            <div className="feedback-item" key={item._id}>
              <div>
                <h4>{getGuestName(item)}</h4>

                <p className="feedback-rating">
                  {"★".repeat(Number(item.rating))}
                  {"☆".repeat(5 - Number(item.rating))}
                </p>

                <p>{item.comment}</p>

                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ""}
                </small>

                <p>Status: {item.status}</p>
              </div>

              <div>
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

export default Feedback;
