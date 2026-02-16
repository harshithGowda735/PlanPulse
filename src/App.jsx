import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import OverallAttendance from "./pages/OverallAttendance";
import ManageSubjects from "./pages/ManageSubjects";
import AllSubjects from "./pages/AllSubjects";
import Settings from "./pages/Settings";
import Suggestion from "./pages/Suggestion";
import ReportBug from "./pages/ReportBug";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/overall" element={<OverallAttendance />} />
        <Route path="/Manage" element={<ManageSubjects />} />
        <Route path="/Allsubjects" element={<AllSubjects />} />
        <Route path="/Setting" element={<Settings />} />
        <Route path="/Suggestion" element={<Suggestion />} />
        <Route path="/Report" element={<ReportBug />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
