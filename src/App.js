import React, { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";

const App = () => {
  const [isAdminView, setIsAdminView] = useState(false); // UserPanel is shown by default

  const toggleView = () => {
    setIsAdminView(!isAdminView);
  };

  return (
    <div className=" bg-gray-900 text-white  ">
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
