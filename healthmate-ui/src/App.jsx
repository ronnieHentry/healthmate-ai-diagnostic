
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ReportPage from "./components/ReportPage";
import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";
import React, { useState } from "react";
import Login from "./components/Login";




function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("user") || "");
  const navigate = useNavigate();
  const isLoginPage = window.location.pathname === "/login";

  const handleLogin = (username) => {
    setLoggedInUser(username);
    navigate("/");
  };

  if (!loggedInUser && !isLoginPage) {
    navigate("/login");
    return null;
  }

  return (
    <div className="app-root">
      {!isLoginPage && (
        <div className="app-header-wrapper">
          <Header />
        </div>
      )}
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={loggedInUser ? <Dashboard /> : <Login onLogin={handleLogin} />} />
          <Route path="/symptomform" element={loggedInUser ? <SymptomForm /> : <Login onLogin={handleLogin} />} />
          <Route path="/chat" element={loggedInUser ? <Chat /> : <Login onLogin={handleLogin} />} />
          <Route path="/diagnosis" element={loggedInUser ? <ReportPage /> : <Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;


