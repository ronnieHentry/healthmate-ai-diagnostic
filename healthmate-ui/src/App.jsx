import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat"
import ReportPage from "./components/ReportPage"
import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";

function App() {
  const user = { name: "John Doe", age: "45", gender: "Male" };

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
            <Route path="/diagnosis" element={<ReportPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
