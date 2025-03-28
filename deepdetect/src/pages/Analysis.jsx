import React from "react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2"; 
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js"; 
import "./Analysis.css";

ChartJS.register(BarElement, CategoryScale, LinearScale); 

const Analysis = () => {
  const location = useLocation();
  const { imageUrl, prediction, prediction_score, boundingBox } = location.state || {};

  // Prepare chart data dynamically
  const chartData = {
    labels: ["Real", "Fake"], 
    datasets: [
      {
        label: "Confidence Score (%)",
        data: [
          Math.round((1 - prediction_score) * 100), 
          Math.round(prediction_score * 100),       
        ],
        backgroundColor: ["#4CAF50", "#FF5722"], 
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Confidence (%)",
        },
      },
    },
  };

  return (
    <div className="analysis-container">
      <h1 className="heading">Detailed Analysis</h1>
      <h2 className="items-pred">
              Prediction: <span >{prediction}</span>
            </h2>
      {prediction ? (
        <div className="content-container">
          {/* Left Side - Image & Bounding Box */}
          <div className="left-section">
            {imageUrl && (
              <div className="image-container">
                <h2 className="items">Detected Face</h2>
  <div className="bounding-box" style={{ position: "relative", display: "inline-block" }}>
    <img src={imageUrl} alt="Processed Image" className="processed-image" />
    <div
      className={`bounding-box-label ${prediction === "Fake" ? "fake" : ""}`}
    >
      {prediction}
    </div>
  </div>
              </div>
            )}

            <h2 className="items">Bounding Box Coordinates</h2>
            <p className="items">X: {boundingBox.x}</p>
            <p className="items">Y: {boundingBox.y}</p>
            <p className="items">Width: {boundingBox.width}</p>
            <p className="items">Height: {boundingBox.height}</p>
          </div>

          {/* Right Side - Confidence Score & Graph */}
          <div className="right-section">
            
            <p className="items">
              Confidence Score: {prediction === "Real" ? 100 - Math.round(prediction_score * 100) : Math.round(prediction_score * 100)}%
            </p>

            {/* Display Bar Chart */}
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <p className="no-data">No analysis data available. Please upload and analyze an image first.</p>
      )}
    </div>
  );
};

export default Analysis;
