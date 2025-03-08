import React from "react";

const Results = ({ file }) => {
  return (
    <div className="container">
      <div className="card">
        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Detection Results</h2>
        {file ? (
          <p style={{ marginTop: "10px", fontSize: "16px" }}>
            Processing: <strong>{file.name}</strong>
          </p>
        ) : (
          <p style={{ marginTop: "10px", fontSize: "16px", opacity: "0.8" }}>No file uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
