import React, { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";

const App = () => {
  const [isAdminView, setIsAdminView] = useState(true);

  const toggleView = () => {
    setIsAdminView(!isAdminView);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {isAdminView ? (
          <AdminPanel toggleView={toggleView} />
        ) : (
          <UserPanel toggleView={toggleView} />
        )}
      </div>
    </div>
  );
};

export default App;
