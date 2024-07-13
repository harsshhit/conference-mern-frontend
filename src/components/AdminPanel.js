import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel({ toggleView }) {
  const [conferences, setConferences] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [editingConference, setEditingConference] = useState(null);

  useEffect(() => {
    fetchConferences();
    fetchRegistrations();
  }, []);

  const fetchConferences = async () => {
    const response = await axios.get("http://localhost:5000/conferences");
    setConferences(response.data);
  };

  const fetchRegistrations = async () => {
    const response = await axios.get(
      "http://localhost:5000/admin/registrations"
    );
    setRegistrations(response.data);
  };

  const handleAddConference = async () => {
    await axios.post("http://localhost:5000/admin/conference", {
      name,
      date,
      schedule,
    });
    fetchConferences();
  };

  const handleEditConference = async () => {
    await axios.put(
      `http://localhost:5000/admin/conference/${editingConference._id}`,
      { name, date, schedule }
    );
    setEditingConference(null);
    fetchConferences();
  };

  const handleDeleteConference = async (id) => {
    await axios.delete(`http://localhost:5000/admin/conference/${id}`);
    fetchConferences();
  };

  const handleDeleteRegistration = async (id) => {
    await axios.delete(`http://localhost:5000/admin/registration/${id}`);
    fetchRegistrations();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Admin Panel</h1>
        <button
          onClick={toggleView}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to User Panel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Manage Conferences</h2>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Schedule"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={
                  editingConference ? handleEditConference : handleAddConference
                }
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-3 rounded-full shadow-md transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                {editingConference ? "Update Conference" : "Add Conference"}
              </button>
            </div>
          </div>

          <ul className="space-y-4">
            {conferences.map((conference) => (
              <li
                key={conference._id}
                className="p-4 bg-gray-800 rounded-lg shadow-md flex flex-col space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{conference.name}</h3>
                    <p className="text-sm text-gray-400">{conference.date}</p>
                    <p className="text-sm">{conference.schedule}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setName(conference.name);
                        setDate(conference.date);
                        setSchedule(conference.schedule);
                        setEditingConference(conference);
                      }}
                      className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-1 px-4 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConference(conference._id)}
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white font-bold py-1 px-4 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Feedbacks</h4>
                  <ul className="pl-4 list-disc text-sm text-gray-400">
                    {conference.feedback.length > 0 ? (
                      conference.feedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                      ))
                    ) : (
                      <li>No feedback available</li>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Registrations</h2>
          <ul className="space-y-4">
            {registrations.map((user) => (
              <li
                key={user._id}
                className="p-4 bg-gray-800 rounded-lg shadow-md mb-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <ul className="pl-4 list-disc text-sm text-gray-400">
                    {user.conferences.map((conference) => (
                      <li key={conference._id}>
                        {conference.name} - {conference.date}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDeleteRegistration(user._id)}
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white font-bold py-1 px-4 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <img
                    src="/assets/delete.png"
                    alt="delete"
                    className="h-6 w-6"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
