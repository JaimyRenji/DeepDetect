import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const Upload = () => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState({}); 
  const [prediction, setPrediction] = useState(null);
  const [prediction_score, setPredictionScore] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      setPrediction(data.prediction);
      setPredictionScore(data.prediction_score);
      setBoundingBox(data.bounding_box);
      
      setLoading(false);
      navigate("/analysis", {
        state: { 
          prediction: data.prediction, 
          prediction_score: data.prediction_score, 
          boundingBox: data.bounding_box,
          imageUrl: `http://localhost:5000/output_image`,
          heatmapUrl: `http://localhost:5000/output_heatmap`
        },
      });

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-box">
        <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} hidden />
        <FiUpload size={40} />
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