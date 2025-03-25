import React from "react";
import { useLocation } from "react-router-dom";
import "./Analysis.css";
import "./Upload.css";

const Analysis = () => {
  const location = useLocation();
  const { prediction, prediction_score, f1Score, accuracy } = location.state || {}; 

  return (
    <div className="analysis-container">
      <h1 className="heading">Detailed Analysis</h1>
      
      {prediction ? (
        <>
          <h2 className="items">Prediction: <span className={prediction === "Real" ? "real" : "fake"}>{prediction}</span></h2>
          <p className="items">Confidence Score: {100-Math.round(prediction_score * 100)}%</p>
          
        </>
      ) : (
        <p className="no-data">No analysis data available. Please upload and analyze an image first.</p>
      )}
    </div>
  );
};

export default Analysis;
