import React, { useState, useEffect } from "react";
import {
  Calendar,
  Send,
  UserPlus,
  MessageSquare,
  MapPin,
  Users,
  Clock,
  X,
  Layout,
  Filter,
} from "lucide-react";
import Footer from "./Footer";

const UserPanel = ({ toggleView }) => {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  // const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [dateFilter, setDateFilter] = useState("all"); // new state for date filter
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    conferenceId: "",
    feedback: "",
  });

  const BASE_URL = "https://conference-mern-backend.vercel.app";

  useEffect(() => {
    fetchConferences();
  }, []);

  useEffect(() => {
    filterConferences();
  }, [dateFilter, conferences]);

  const filterConferences = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );

    const filtered = conferences.filter((conference) => {
      const conferenceDate = new Date(conference.date);

      switch (dateFilter) {
        case "week":
          return conferenceDate <= nextWeek && conferenceDate >= today;
        case "month":
          return conferenceDate <= nextMonth && conferenceDate >= today;
        case "future":
          return conferenceDate >= today;
        default:
          return true;
      }
    });

    setFilteredConferences(filtered);
  };

  const fetchConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/conferences`);
      const data = await response.json();
      setConferences(data);
      setFilteredConferences(data);
    } catch (err) {
      setStatus({ type: "error", message: "Failed to fetch conferences" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: "", message: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setStatus({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          conferenceId: formData.conferenceId,
        }),
      });
      setStatus({ type: "success", message: "Registration successful!" });
      setFormData({ name: "", email: "", conferenceId: "", feedback: "" });
      setActiveModal(null);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Registration failed. Please try again.",
      });
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!formData.feedback) {
      setStatus({ type: "error", message: "Feedback is required" });
      return;
    }

    try {
      await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conferenceId: formData.conferenceId,
          feedback: formData.feedback,
        }),
      });
      setStatus({
        type: "success",
        message: "Feedback submitted successfully!",
      });
      setFormData({ name: "", email: "", conferenceId: "", feedback: "" });
      setActiveModal(null);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    }
  };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );

  const openModal = (type, conferenceId) => {
    setFormData({ ...formData, conferenceId });
    setActiveModal(type);
    setStatus({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-[100vw]">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <Layout className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
              <span className="text-white text-base sm:text-lg font-extrabold tracking-tight">
                <span className=" xs:inline">Conference</span>
                <span className="text-indigo-400 ml-0 sm:ml-1">Portal</span>
              </span>
            </div>

            <div className="flex items-center">
              <button
                onClick={toggleView}
                className="relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                     bg-indigo-600 text-white font-medium text-xs sm:text-sm
                     transform transition-all duration-200
                     hover:bg-indigo-500 hover:scale-105 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {/* <Menu className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> */}
                <span className=" xs:inline">Admin Panel</span>
                {/* <span className="xs:hidden">Admin</span> */}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden h-[40vh] md:h-[40vh] w-full">
        <div className="absolute inset-0">
          <img
            src="https://th.bing.com/th/id/OIP.sp4QQHucVD4zf4ckf-L-GAHaC9?w=1600&h=640&rs=1&pid=ImgDetMain"
            alt="Conference"
            className="w-full h-full object-cover bg-black  opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome to Conference Portal
            </h1>
            <p className="text-xl text-gray-300">
              Join amazing conferences and share your experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-900 border border-green-700 text-green-100"
                : "bg-red-900 border border-red-700 text-red-100"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Date Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center bg-gray-800 rounded-lg p-2">
            <Filter className="text-indigo-400 mr-2" size={20} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
            >
              <option value="all">All Conferences</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="future">Future Events</option>
            </select>
          </div>
          <span className="text-gray-400">
            Showing {filteredConferences.length} conferences
          </span>
        </div>

        {/* Conferences Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Calendar className="mr-2 text-indigo-400" />
            Upcoming Conferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => (
              <div
                key={conference._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-3xl font-semibold text-white mb-2">
                      {conference.name}
                    </h3>
                    <div className="flex items-center text-gray-300">
                      <Calendar size={16} className="mr-2" />
                      {conference.date}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPin size={16} className="mr-2 text-indigo-400" />
                    <span>{conference.location || "Virtual"}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users size={16} className="mr-2 text-indigo-400" />
                    <span>{conference.attendees || "Limited spots"}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="mr-2 text-indigo-400" />
                    <span>{conference.schedule}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => openModal("feedback", conference._id)}
                      className="flex items-center justify-center p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full transition-all"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Feedback
                    </button>
                    <button
                      onClick={() => openModal("register", conference._id)}
                      className="flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all"
                    >
                      <UserPlus size={16} className="mr-2" />
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      

      {/* Modals */}
      {activeModal === "register" && (
        <Modal onClose={() => setActiveModal(null)}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <UserPlus className="mr-2 text-indigo-400" />
            Register for Conference
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
            >
              <UserPlus size={20} className="mr-2" />
              Register Now
            </button>
          </form>
        </Modal>
      )}

      {activeModal === "feedback" && (
        <Modal onClose={() => setActiveModal(null)}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageSquare className="mr-2 text-indigo-400" />
            Submit Feedback
          </h2>
          <form onSubmit={handleFeedback} className="space-y-4">
            <textarea
              name="feedback"
              placeholder="Your feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
            >
              <Send size={20} className="mr-2" />
              Submit Feedback
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserPanel;
