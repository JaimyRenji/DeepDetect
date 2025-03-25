import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const Upload = () => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [prediction_score, setPredictionScore] = useState(null);
  const [f1Score, setF1Score] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload an image or video first!");
      return;
    }

    setLoading(true); // Show loading state

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      setPrediction(data.prediction);
      setF1Score(data.f1_score);
      setAccuracy(data.accuracy);
      setPredictionScore(data.prediction_score);
      setLoading(false); // Hide loading state

      // Navigate to the analysis page with state
      navigate("/analysis", {
        state: { prediction: data.prediction, f1Score: data.f1_score, accuracy: data.accuracy, prediction_score:data.prediction_score},
      });

    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Hide loading state on error
    }
  };

  return (
    <div
      className={`upload-container ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="upload-box">
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} hidden />
        <FiUpload size={40} color="#0d0d93" />
        <p>Drag & Drop to upload or</p>
        <button className="upload-btn">Choose File</button>
      </label>

      <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {preview && <img src={preview} alt="Preview" className="upload-preview" />}
      
    </div>
  );
};

export default Upload;
