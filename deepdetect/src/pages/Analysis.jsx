import React from "react";
import { useLocation } from "react-router-dom";
import "./Analysis.css";
const Analysis = () => {
  const location = useLocation();
  const { prediction, f1Score, accuracy } = location.state || {}; 

  return (
    <div>
      <h1 className="heading">Detailed Analysis</h1>
      {prediction ? (
        <>
          <p className="items">Prediction: {prediction}</p>
          <p className="items">F1 Score: {f1Score}</p>
          <p className="items">Accuracy: {accuracy}</p>
        </>
      ) : (
        <p>No analysis data available. Please upload and analyze an image first.</p>
      )}
    </div>
  );
};

export default Analysis;
