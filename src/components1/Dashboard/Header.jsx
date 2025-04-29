import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../assets/css/Body.css";

const Header = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <a href="/">
              <h1>LMS</h1>
            </a>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="hamburger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Navigation Menu */}
          <nav className={`navigation ${isMenuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <button
                  className={activeTab === "explore" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("explore");
                    setIsMenuOpen(false);
                  }}
                >
                  Explore
                </button>
              </li>
              <li>
                <button
                  className={activeTab === "opportunities" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("opportunities");
                    setIsMenuOpen(false);
                  }}
                >
                  Opportunities
                </button>
              </li>
              <li>
                <button
                  className={activeTab === "teach" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("teach");
                    setIsMenuOpen(false);
                  }}
                >
                  Teach on LMS
                </button>
              </li>
              <li>
                <button className="btn-login" onClick={() => navigate("/login")}>
                  Log in
                </button>
              </li>
              <li>
                <button className="btn-signup" onClick={() => navigate("/login?signup=true")}>Sign Up</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
