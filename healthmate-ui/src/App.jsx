import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SymptomForm from "./components/SymptomForm";
import Chat from "./components/Chat";

function App() {
  const user = { name: "Salman Khan", age: 30, gender: "Male" }; // Mock user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SymptomForm user={user} />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
