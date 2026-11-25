
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const guestRoutes = require("./routes/guestRoutes");
const staffRoutes = require("./routes/staffRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const billingRoutes = require("./routes/billingRoutes");
const housekeepingRoutes = require("./routes/housekeepingRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const guestServiceRoutes = require("./routes/guestServiceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingRoutes = require("./routes/settingRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/staff", staffRoutes); 
app.use("/api/reservations", reservationRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/guest-services", guestServiceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("LuxuryStay HMS Backend is Running!");
});

// Start Server after MongoDB connects
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
