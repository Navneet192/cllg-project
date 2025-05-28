import React from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import useStateManager from "./components/StateManager";
import ModeSwitcher from "./components/ModeSwitcher";
import FeatureSelector from "./components/FeatureSelector";
import ModelSelector from "./components/ModelSelector";
import ResultViewer from "./components/ResultViewer";
import RoadSegmentation from "./components/RoadSegmentation";
import SoilQuality from "./components/SoilQuality";
import { Routes, Route, Link } from 'react-router-dom';
import Map from './components/Map';
import Weather from './components/Weather';
import RoadExtraction from './components/RoadExtraction';
import Navbar from "./components/Navbar";

function App() {
  const {
    featureType,
    setFeatureType,
    resultImg,
    setResultImg,
    loading,
    setLoading,
    mode,
    setMode,
    modelType,
    setModelType,
  } = useStateManager();

  return (
    <div className="App">
      <div className="app-header">
        <h1>A User-Friendly Web Interface for Feature Extraction from Remote Sensing Satellite Images</h1>
        <p className="subtitle">Advanced Satellite Image Analysis Tool</p>
      </div>
      <Navbar />

      <main className="main">
        <Routes>
          <Route path="/" element={
            <div className="main-container">
              <div className="control-panel">
                <div className="panel-section">
                  <h2>Mode Selection</h2>
                  <ModeSwitcher mode={mode} setMode={setMode} />
                </div>

                <div className="panel-section">
                  <h2>{mode === "feature" ? "Feature Selection" : "Model Selection"}</h2>
                  {mode === "feature" ? (
                    <FeatureSelector
                      featureType={featureType}
                      setFeatureType={setFeatureType}
                    />
                  ) : (
                    <ModelSelector modelType={modelType} setModelType={setModelType} />
                  )}
                </div>

                <div className="panel-section">
                  <h2>Image Upload</h2>
                  <ImageUpload
                    mode={mode}
                    featureType={featureType}
                    modelType={modelType}
                    onResult={setResultImg}
                    onLoading={setLoading}
                  />
                </div>
              </div>

              <div className="result-panel">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Processing your image...</p>
                  </div>
                ) : (
                  <ResultViewer resultImg={resultImg} />
                )}
              </div>
            </div>
          } />
          <Route path="/weather" element={<Weather />} />
          <Route path="/soil" element={<SoilQuality />} />
          <Route path="/roads" element={<RoadExtraction />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
