import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SymptomForm from "./components/SymptomForm";
import Chat from "./components/Chat";
import DiagnosisComponent from "./components/DiagnosisComponent";
import RecommendedClinics from "./components/RecommendedClinics";

function App() {
  const user = { name: "", age: "", gender: "" };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SymptomForm user={user} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/diagnosis" element={<DiagnosisComponent />} />
        <Route path="/next-step" element={<RecommendedClinics />} />
      </Routes>
    </Router>
  );
}

export default App;
