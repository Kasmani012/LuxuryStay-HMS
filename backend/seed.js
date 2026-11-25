
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Room = require("./models/Room");
const Guest = require("./models/Guest");
const Staff = require("./models/Staff");
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const Billing = require("./models/Billing");
const Housekeeping = require("./models/Housekeeping");
const Maintenance = require("./models/Maintenance");
const Feedback = require("./models/Feedback");
const GuestService = require("./models/GuestService");
const Notification = require("./models/Notification");
const Setting = require("./models/Setting");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");

    // ADMIN
    const password = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { email: "admin@luxurystay.com" },
      {
        name: "Admin",
        email: "admin@luxurystay.com",
        password,
        role: "Admin"
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("Admin Ready!");

    // ROOMS
    const roomData = [
      { number: "201", type: "Single", price: 3000, status: "Available" },
      { number: "202", type: "Double", price: 5000, status: "Available" },
      { number: "203", type: "Deluxe", price: 7000, status: "Available" },
      { number: "204", type: "Suite", price: 10000, status: "Available" },
      { number: "205", type: "Single", price: 3000, status: "Available" }
    ];

    const rooms = {};

    for (const room of roomData) {
      rooms[room.number] = await Room.findOneAndUpdate(
        { number: room.number },
        room,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Rooms Added!");

    // GUESTS
    const guestData = [
      { name: "Hamza Ali", email: "hamza@gmail.com", phone: "03001112221", address: "Karachi, Pakistan" },
      { name: "Sara Khan", email: "sara@gmail.com", phone: "03001112222", address: "Lahore, Pakistan" },
      { name: "Ahmed Raza", email: "ahmed@gmail.com", phone: "03001112223", address: "Islamabad, Pakistan" },
      { name: "Ayesha Malik", email: "ayesha@gmail.com", phone: "03001112224", address: "Multan, Pakistan" },
      { name: "Bilal Hussain", email: "bilal@gmail.com", phone: "03001112225", address: "Karachi, Pakistan" }
    ];

    const guests = {};

    for (const guest of guestData) {
      guests[guest.email] = await Guest.findOneAndUpdate(
        { email: guest.email },
        guest,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Guests Added!");

    // STAFF
    const staffData = [
      { name: "Usman Ahmed", email: "usman.staff@gmail.com", phone: "03001112231", role: "Receptionist", salary: 35000, status: "Active" },
      { name: "Hassan Ali", email: "hassan.staff@gmail.com", phone: "03001112232", role: "Manager", salary: 60000, status: "Active" },
      { name: "Sana Noor", email: "sana.staff@gmail.com", phone: "03001112233", role: "Staff", salary: 30000, status: "Active" }
    ];

    for (const staff of staffData) {
      await Staff.findOneAndUpdate(
        { email: staff.email },
        staff,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Staff Added!");

    // RESERVATIONS
    const reservationData = [
      {
        guest: guests["hamza@gmail.com"]._id,
        room: rooms["201"]._id,
        checkIn: new Date("2026-11-27"),
        checkOut: new Date("2026-11-29"),
        totalAmount: 6000,
        status: "Confirmed"
      },
      {
        guest: guests["sara@gmail.com"]._id,
        room: rooms["202"]._id,
        checkIn: new Date("2026-11-28"),
        checkOut: new Date("2026-11-30"),
        totalAmount: 10000,
        status: "Pending"
      },
      {
        guest: guests["ahmed@gmail.com"]._id,
        room: rooms["203"]._id,
        checkIn: new Date("2026-12-01"),
        checkOut: new Date("2026-12-03"),
        totalAmount: 14000,
        status: "Confirmed"
      }
    ];

    const reservations = [];

    for (const item of reservationData) {
      const reservation = await Reservation.findOneAndUpdate(
        { guest: item.guest, room: item.room, checkIn: item.checkIn },
        item,
        { upsert: true, new: true, runValidators: true }
      );
      reservations.push(reservation);
    }

    console.log("Reservations Added!");

    // BILLING
    const invoices = [
      { invoiceNumber: "INV-DEMO-101", reservation: reservations[0]._id, amount: 6000, paymentMethod: "Cash", paymentStatus: "Paid" },
      { invoiceNumber: "INV-DEMO-102", reservation: reservations[1]._id, amount: 10000, paymentMethod: "Card", paymentStatus: "Pending" },
      { invoiceNumber: "INV-DEMO-103", reservation: reservations[2]._id, amount: 14000, paymentMethod: "Online", paymentStatus: "Paid" }
    ];

    for (const item of invoices) {
      await Billing.findOneAndUpdate(
        { invoiceNumber: item.invoiceNumber },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Billing Added!");

    // HOUSEKEEPING
    const tasks = [
      { room: rooms["201"]._id, task: "Cleaning", status: "Pending", notes: "Room cleaning required" },
      { room: rooms["202"]._id, task: "Inspection", status: "Completed", notes: "Room inspected" },
      { room: rooms["203"]._id, task: "Cleaning", status: "In Progress", notes: "Cleaning in progress" }
    ];

    for (const item of tasks) {
      await Housekeeping.findOneAndUpdate(
        { room: item.room, notes: item.notes },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Housekeeping Added!");

    // MAINTENANCE
    const repairs = [
      { room: rooms["204"]._id, issue: "AC Not Working", priority: "High", status: "Pending", notes: "Air conditioner needs repair" },
      { room: rooms["205"]._id, issue: "Water Leakage", priority: "Medium", status: "In Progress", notes: "Check bathroom water pipe" },
      { room: rooms["203"]._id, issue: "Light Not Working", priority: "Low", status: "Completed", notes: "Light bulb replaced" }
    ];

    for (const item of repairs) {
      await Maintenance.findOneAndUpdate(
        { room: item.room, issue: item.issue },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Maintenance Added!");

    // FEEDBACK
    const reviews = [
      { guest: guests["hamza@gmail.com"]._id, rating: 5, comment: "Excellent hotel service", status: "Reviewed" },
      { guest: guests["sara@gmail.com"]._id, rating: 4, comment: "Room was comfortable", status: "Reviewed" },
      { guest: guests["ahmed@gmail.com"]._id, rating: 3, comment: "Food service was slow", status: "Pending" }
    ];

    for (const item of reviews) {
      await Feedback.findOneAndUpdate(
        { guest: item.guest, comment: item.comment },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Feedback Added!");

    // GUEST SERVICES
    const services = [
      { guest: guests["hamza@gmail.com"]._id, serviceName: "Laundry", amount: 1000, status: "Pending", notes: "Laundry service requested" },
      { guest: guests["sara@gmail.com"]._id, serviceName: "Room Service", amount: 1500, status: "Completed", notes: "Meal delivered to room" },
      { guest: guests["ahmed@gmail.com"]._id, serviceName: "Transport", amount: 2000, status: "In Progress", notes: "Airport pickup arranged" }
    ];

    for (const item of services) {
      await GuestService.findOneAndUpdate(
        { guest: item.guest, notes: item.notes },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Guest Services Added!");

    // NOTIFICATIONS
    const notifications = [
      { title: "New Booking", message: "Hamza booked Room 201", type: "Booking", status: "Unread" },
      { title: "Payment Received", message: "Payment received from Ahmed", type: "Payment", status: "Read" },
      { title: "Maintenance Alert", message: "AC repair required in Room 204", type: "Maintenance", status: "Unread" }
    ];

    for (const item of notifications) {
      await Notification.findOneAndUpdate(
        { title: item.title, message: item.message },
        item,
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Notifications Added!");

    // SETTINGS
    const settings = await Setting.findOne();

    if (settings) {
      settings.hotelName = "LuxuryStay Hotel";
      settings.email = "info@luxurystay.com";
      settings.phone = "03001234567";
      settings.address = "Karachi, Pakistan";
      settings.currency = "PKR";
      await settings.save();
    } else {
      await Setting.create({
        hotelName: "LuxuryStay Hotel",
        email: "info@luxurystay.com",
        phone: "03001234567",
        address: "Karachi, Pakistan",
        currency: "PKR"
      });
    }

    console.log("Settings Added!");
    console.log("ALL DEMO DATA ADDED SUCCESSFULLY!");

  } catch (error) {
    console.log("SEED ERROR:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
