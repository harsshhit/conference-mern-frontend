import React, { useState, useEffect, useCallback } from "react";
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
  Sparkles,
} from "lucide-react";

const UserPanel = ({ toggleView }) => {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    conferenceId: "",
    feedback: "",
  });

  const BASE_URL = "https://conference-mern-backend.vercel.app";

  const filterConferences = useCallback(() => {
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
  }, [dateFilter, conferences]);

  useEffect(() => {
    fetchConferences();
  }, []);

  useEffect(() => {
    filterConferences();
  }, [dateFilter, conferences, filterConferences]);

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

  const openModal = (type, conferenceId) => {
    setFormData({ ...formData, conferenceId });
    setActiveModal(type);
    setStatus({ type: "", message: "" });
  };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-[100vw]">
      {/* Futuristic Navbar */}
      <nav className="relative bg-gray-900 border-b border-indigo-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3 group">
              <Layout className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-all duration-300" />
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Conference Portal
              </div>
            </div>
            <button
              onClick={toggleView}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium
                       hover:from-indigo-500 hover:to-purple-500 transition-all duration-300
                       shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
                       border border-indigo-500/30"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-gray-900 z-10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1679547202671-f9dbbf466db4?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Future of
              </span>
              <br />
              <span className="text-white">Conferences</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Experience next-generation conferences where innovation meets
              collaboration. Join us in shaping the future of professional
              gatherings.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Status Message */}
        {status.message && (
          <div
            className={`mb-8 p-4 rounded-2xl backdrop-blur-sm border 
            ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center bg-gray-800/50 rounded-full p-2 border border-indigo-500/30 backdrop-blur-sm">
            <Filter className="text-indigo-400 mx-2" size={20} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-white border-none focus:ring-0 rounded-full pr-8"
            >
              <option value="all">All Conferences</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="future">Future Events</option>
            </select>
          </div>
          <span className="text-gray-400 flex items-center">
            <Sparkles size={16} className="mr-2 text-indigo-400" />
            {filteredConferences.length} conferences available
          </span>
        </div>

        {/* Conferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConferences.map((conference) => (
            <div
              key={conference._id}
              className="group relative bg-gray-800/50 rounded-2xl overflow-hidden border border-indigo-500/30 backdrop-blur-sm
                          hover:border-indigo-500/50 transition-all duration-300
                          hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
              <div className="relative p-6">
                <h3 className="text-4xl font-bold text-white mb-4">
                  {conference.name}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-2 text-indigo-400" />
                    {conference.date}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin size={16} className="mr-2 text-indigo-400" />
                    {conference.location || "Virtual"}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users size={16} className="mr-2 text-indigo-400" />
                    {conference.attendees || "Limited spots"}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={16} className="mr-2 text-indigo-400" />
                    {conference.schedule}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => openModal("feedback", conference._id)}
                    className="flex items-center justify-center px-4 py-2 rounded-full
                             bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white
                             border border-cyan-500/30 hover:border-cyan-500
                             transition-all duration-300"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Feedback
                  </button>
                  <button
                    onClick={() => openModal("register", conference._id)}
                    className="flex items-center justify-center px-4 py-2 rounded-full
                             bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white
                             border border-indigo-500/30 hover:border-indigo-500
                             transition-all duration-300"
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
              className="w-full p-3 bg-gray-800/50 text-white rounded-lg 
                       border border-indigo-500/30 focus:border-indigo-500/50
                       focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
                       placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800/50 text-white rounded-lg 
                       border border-indigo-500/30 focus:border-indigo-500/50
                       focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
                       placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center p-3
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:from-indigo-500 hover:to-purple-500
                       text-white rounded-lg transition-all duration-300"
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
              className="w-full p-3 bg-gray-800/50 text-white rounded-lg 
                       border border-indigo-500/30 focus:border-indigo-500/50
                       focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
                       resize-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center p-3
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:from-indigo-500 hover:to-purple-500
                       text-white rounded-lg transition-all duration-300"
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
