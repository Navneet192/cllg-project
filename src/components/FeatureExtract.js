import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import FeatureSelector from './FeatureSelector';
import './FeatureExtract.css';

const FeatureExtract = () => {
  const [featureType, setFeatureType] = useState('segmentation');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (data) => {
    setResult(data);
    setLoading(false);
  };

  console.log('Current result state:', result);

  return (
    <div className="feature-extract-container">
      <h2>Feature Extraction</h2>
      <div className="controls">
        <FeatureSelector
          selectedFeature={featureType}
          onFeatureChange={setFeatureType}
        />
        <ImageUpload
          featureType={featureType}
          onResult={handleResult}
          onLoading={setLoading}
        />
      </div>

      {loading && (
        <div className="loading">
          <p>Processing image...</p>
        </div>
      )}

      {result && (
        <div className="results">
          <div className="result-image">
            <h3>Processed Image</h3>
            {console.log('Rendering image, result.result_image:', result.result_image)}
            {result.result_image && (
              <img 
                src={result.result_image} 
                alt="Processed satellite image" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
          
          {result.statistics && (
            <div className="statistics">
              <h3>Analysis Results</h3>
              <div className="stat-grid">
                <div className="stat-item">
                  <span className="stat-label">Water</span>
                  <span className="stat-value">{result.statistics.water_percentage}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Vegetation</span>
                  <span className="stat-value">{result.statistics.vegetation_percentage}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Urban</span>
                  <span className="stat-value">{result.statistics.urban_percentage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeatureExtract; 