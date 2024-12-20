import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Calendar,
  LayoutDashboard,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminPanel = ({ toggleView }) => {
  const [conferences, setConferences] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    schedule: "",
  });
  const [editingConference, setEditingConference] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("conferences");
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = "https://conference-mern-backend.vercel.app";

  useEffect(() => {
    fetchConferences();
    fetchRegistrations();
  }, []);

  const fetchConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/conferences`);
      const data = await response.json();
      setConferences(data);
    } catch (err) {
      setError("Failed to fetch conferences");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/registrations`);
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.schedule) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingConference) {
        await fetch(`${BASE_URL}/admin/conference/${editingConference._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${BASE_URL}/admin/conference`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setFormData({ name: "", date: "", schedule: "" });
      setEditingConference(null);
      fetchConferences();
    } catch (err) {
      setError(
        editingConference
          ? "Failed to update conference"
          : "Failed to add conference"
      );
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await fetch(`${BASE_URL}/admin/${type}/${id}`, { method: "DELETE" });
      if (type === "conference") {
        fetchConferences();
      } else {
        fetchRegistrations();
      }
    } catch (err) {
      setError(`Failed to delete ${type}`);
    }
  };

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:bg-indigo-600 hover:text-white"
      }`}
    >
      <Icon size={20} className="mr-2" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  const filteredConferences = conferences.filter((conference) =>
    conference.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegistrations = registrations.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white w-[100vw]">
      {/* Top Navbar */}
      <nav className="bg-gray-800 border-b border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-400">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div> */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all"
              >
                <Bell size={20} />
              </motion.button> */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleView}
                className="bg-indigo-600 text-white rounded-full px-4 py-2 hover:bg-indigo-700 transition-all"
              >
                Switch to User Panel
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="flex justify-center space-x-4 mb-8">
          <NavButton
            icon={LayoutDashboard}
            label="Conferences"
            active={activeTab === "conferences"}
            onClick={() => setActiveTab("conferences")}
          />
          <NavButton
            icon={Users}
            label="Registrations"
            active={activeTab === "registrations"}
            onClick={() => setActiveTab("registrations")}
          />
        </div>

        {activeTab === "conferences" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Add/Edit Conference Form */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-indigo-400 mb-4">
                {editingConference ? "Edit Conference" : "Add New Conference"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Conference Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    name="schedule"
                    placeholder="Schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center bg-indigo-600 text-white rounded-full px-6 py-2 hover:bg-indigo-700 transition-all"
                  >
                    <Plus size={20} className="mr-2" />
                    {editingConference ? "Update Conference" : "Add Conference"}
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Conferences Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredConferences.map((conference) => (
                <motion.div
                  key={conference._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-indigo-400">
                      {conference.name}
                    </h3>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setFormData({
                            name: conference.name,
                            date: conference.date,
                            schedule: conference.schedule,
                          });
                          setEditingConference(conference);
                        }}
                        className="p-2 hover:bg-gray-700 rounded-full transition-all"
                      >
                        <Edit2 size={16} className="text-indigo-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleDelete(conference._id, "conference")
                        }
                        className="p-2 hover:bg-gray-700 rounded-full transition-all text-red-500"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Calendar size={16} className="mr-2 text-indigo-400" />
                    {conference.date}
                  </div>
                  <p className="text-gray-300 mb-4">{conference.schedule}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Registrations Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredRegistrations.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    {user.name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(user._id, "registration")}
                    className="p-2 hover:bg-gray-700 rounded-full transition-all text-red-500"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
                <p className="text-sm text-gray-400 mb-3">{user.email}</p>
                <h4 className="text-sm font-semibold text-indigo-400 mb-2">
                  Registered Conferences
                </h4>
                <div className="space-y-2">
                  {user.conferences.map((conf) => (
                    <div
                      key={conf._id}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <Calendar size={14} className="mr-2 text-indigo-400" />
                      {conf.name} - {conf.date}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
