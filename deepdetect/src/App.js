import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";

const App = () => {
  const [file, setFile] = useState(null);
  
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload setFile={setFile} />} />
        <Route path="/predict" element={<Results file={file} />} />
      </Routes>

  );
};

export default App;

