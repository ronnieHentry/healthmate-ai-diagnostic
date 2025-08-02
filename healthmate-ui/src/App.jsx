import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat"
import DiagnosisComponent from "./pages/DiagnosisComponent"
import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";

function App() {
  const user = { name: "", age: "", gender: "" };

  return (
    <Router>
      <div className="app-root">
        <div className="app-header-wrapper">
          <Header />
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/symptomform" element={<SymptomForm />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/diagnosis" element={<DiagnosisComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
