import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Footer from "./components/Footer";
import PredictionForm from "./pages/PredictionForm";
import PredictionPage from "./PredictionPage";
import { useEffect, useState } from "react";
import Register from "./pages/Register";   // NEW
import Login from "./pages/Login";         // NEW
import History from "./pages/History"; 


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
      <div className="app-wrapper">
      <AppNavbar />

      {/* This pushes footer down */}
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Features />
              </>
            }
          />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/register" element={<Register />} />   {/* NEW */}
          <Route path="/login" element={<Login />} />         {/* NEW */}
          <Route path="/history" element={<History />} />     {/* NEW */}
          </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
