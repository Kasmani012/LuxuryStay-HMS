
import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import API from "../services/api";

function Settings() {
  const [hotelName, setHotelName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [settingId, setSettingId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await API.get("/settings");

      const data = response.data.settings ||
        response.data.setting ||
        [];

      const setting = Array.isArray(data) ? data[0] : data;

      if (setting) {
        setSettingId(setting._id);
        setHotelName(setting.hotelName || "");
        setEmail(setting.email || "");
        setPhone(setting.phone || "");
        setAddress(setting.address || "");
        setCurrency(setting.currency || "PKR");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load settings.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const settingsData = {
      hotelName: hotelName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      currency
    };

    try {
      if (settingId) {
        await API.put(`/settings/${settingId}`, settingsData);
        alert("Settings updated successfully!");
      } else {
        const response = await API.post("/settings", settingsData);

        const savedSetting =
          response.data.setting || response.data.settings;

        if (savedSetting?._id) {
          setSettingId(savedSetting._id);
        }

        alert("Settings saved successfully!");
      }

      fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save settings.");
    }
  };

  return (
    <div className="settings-page">
      <h2>System Settings</h2>
      <p>Manage your hotel information and system preferences.</p>

      <div className="settings-container">
        <h3>Hotel Information</h3>

        <form onSubmit={handleSubmit}>
          <div className="settings-group">
            <label>Hotel Name</label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              required
            />
          </div>

          <div className="settings-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="settings-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="settings-group">
            <label>Hotel Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="settings-group">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="PKR">Pakistani Rupee (PKR)</option>
              <option value="USD">US Dollar (USD)</option>
            </select>
          </div>

          <button type="submit" className="settings-save-btn">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
