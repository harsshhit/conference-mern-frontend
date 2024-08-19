import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://conference-mern-backend.vercel.app/";

function UserPanel({ toggleView }) {
  const [conferences, setConferences] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationConferenceId, setRegistrationConferenceId] = useState(""); // State for registration conference
  const [feedbackConferenceId, setFeedbackConferenceId] = useState(""); // State for feedback conference
  const [feedback, setFeedback] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(""); // State for registration status
  const [feedbackStatus, setFeedbackStatus] = useState(""); // State for feedback status

  useEffect(() => {
    // Fetch conferences
    axios
      .get(`${BASE_URL}/conferences`)
      .then((response) => {
        console.log("Conferences:", response.data); // Debug log
        setConferences(response.data);
      })
      .catch((error) => console.error("Error fetching conferences:", error));
  }, []);

  const handleRegister = () => {
    axios
      .post(`${BASE_URL}/register`, {
        name,
        email,
        conferenceId: registrationConferenceId,
      })
      .then((response) => {
        console.log("Registration successful:", response.data);
        setRegistrationStatus("Registration successful!");
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setRegistrationStatus("Something went wrong. Please try again.");
      });
  };

  const handleFeedback = () => {
    axios
      .post(`${BASE_URL}/feedback`, {
        conferenceId: feedbackConferenceId,
        feedback,
      })
      .then((response) => {
        console.log("Feedback submitted:", response.data);
        setFeedbackStatus("Feedback submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        setFeedbackStatus("Failed to submit feedback. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Conferences</h1>
        <button
          onClick={toggleView}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Admin Panel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Register for a Conference
          </h2>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={registrationConferenceId}
              onChange={(e) => setRegistrationConferenceId(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Conference</option>
              {conferences.map((conference) => (
                <option key={conference._id} value={conference._id}>
                  {conference.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleRegister}
              className={`w-full py-3 px-4 rounded-full shadow-2xl transform transition-transform duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 ${
                registrationStatus === "Registration successful!"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-700 hover:to-teal-700"
                  : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900"
              } text-white font-bold`}
            >
              {registrationStatus || "Register"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Submit Feedback</h2>
          <div className="space-y-4 mb-6">
            <select
              value={feedbackConferenceId}
              onChange={(e) => setFeedbackConferenceId(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Conference</option>
              {conferences.map((conference) => (
                <option key={conference._id} value={conference._id}>
                  {conference.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-32 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFeedback}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                feedbackStatus === "Feedback submitted successfully!"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-700 hover:to-teal-700"
                  : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900"
              }`}
            >
              {feedbackStatus || "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
