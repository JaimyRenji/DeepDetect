import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from "../logo.png";
import image from "../image.png";
const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo"><img src={logo} alt="DeepDetect Logo"/></div>
        <div className="nav-links">
          <Link to="/upload" className="btn">Get Started</Link>
        </div>
      </nav>

      <div className="content">
        <div className="text-section">
          <h1 class="flowy-text">DeepDetect</h1>
          <p>Deepfake Detection Made Easy-Upload your image or video to check if it's real or fake.</p>
          <Link to="/upload" className="btn">Upload Now</Link>
        </div>
        <div className="image-section">
          <img src={image} alt="Upload preview" className="upload-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
