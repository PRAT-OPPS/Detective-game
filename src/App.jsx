// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import CSS
import "./App.css";
import "./MentalistAuth.css";


// Import all game pages
import Home from "./webpages/Home";
import CaseDetails from "./webpages/CaseDetails";
import CrimeScene from "./webpages/CrimeScene";
import EvidenceRoom from "./webpages/EvidenceRoom";
import Suspects from "./webpages/Suspects";
import Interrogation from "./webpages/Interrogation";
import FinalAccusation from "./webpages/FinalAccusation";
import DetroitInterrogation from "./webpages/DetroitInterrogation";
// 1. Add import at the top of src/App.jsx:
import LieDetectorMiniGame from "./webpages/LieDetectorMiniGame";

// Import Mentalist Authentication pages
import Login from "./webpages/Login";
import Register from "./webpages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Case Details */}
        <Route path="/case/:id" element={<CaseDetails />} />

        {/* Crime Scene Investigation */}
        <Route path="/crime-scene/:id" element={<CrimeScene />} />

        {/* Evidence Collection Room */}
        <Route path="/evidence/:id" element={<EvidenceRoom />} />

        {/* Suspect Investigation */}
        <Route path="/suspects/:id" element={<Suspects />} />

        {/* Interrogation Room */}
        <Route path="/interrogation/:id" element={<Interrogation />} />

        {/* Final Accusation */}
        <Route path="/accusation/:id" element={<FinalAccusation />} />

        {/* Standalone Lie Detector Mini-Game (Detroit: Become Human Style) */}
        <Route path="/lie-detector" element={<DetroitInterrogation />} />
        <Route path="/lie-detector/:id" element={<DetroitInterrogation />} />
        <Route path="/mini-game" element={<LieDetectorMiniGame />} />

        {/* Invalid URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;