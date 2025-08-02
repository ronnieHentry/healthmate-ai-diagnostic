import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import SymptomForm from "./components/SymptomForm";

function App() {
  const user = { name: "", age: "", gender: "" };

  return (
    <Router>
      <div className="dashboard-container">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/symptomform" element={<SymptomForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
