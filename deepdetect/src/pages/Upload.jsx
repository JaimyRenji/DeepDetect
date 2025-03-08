import React, { useState } from "react";
import { FiUpload } from "react-icons/fi"; 
import "./Upload.css";

const Upload = () => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [prediction, setPrediction] = useState(null); // State to hold prediction result
  const [f1Score, setF1Score] = useState(null); // State to hold F1 score
  const [accuracy, setAccuracy] = useState(null); // State to hold accuracy
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file

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
    // Fetch API to send the image to the backend server
    if (!selectedFile) return; // Check if a file is selected

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPrediction(data.prediction); // Update prediction state
      setF1Score(data.f1_score); // Update F1 score state
      setAccuracy(data.accuracy); // Update accuracy state
    } catch (error) {
      console.error('Error:', error);
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
        <FiUpload size={40} color="#0d0d93"  />

        <p>Drag & Drop to upload or</p>
        
        <button className="upload-btn">Choose File</button>
        
      </label>
      <a href="#" className="analyze-btn" onClick={handleAnalyze} >Analyze</a>
      {preview && <img src={preview} alt="Preview" className="upload-preview" />}
      {prediction && <p>Prediction: {prediction}</p>}
      {f1Score && <p>F1 Score: {f1Score}</p>}
      {accuracy && <p>Accuracy: {accuracy}</p>}
    </div>
  );
};

export default Upload;
