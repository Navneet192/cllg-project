import React, { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const RoadSegmentation = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setResultImage(null);
    setError('');

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/segmentation/road-extract/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if the server is running correctly.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to process image');
      }
      
      
      if (data.result.startsWith('data:image')) {
        setResultImage(data.result);
      } else {
        // If it's a URL, fetch the image and convert to base64
        const imageResponse = await fetch(data.result);
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch processed image');
        }
        const blob = await imageResponse.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setResultImage(reader.result);
        };
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="segmentation-section">
      <h2>Road Segmentation</h2>
      <p className="description">
        Upload a satellite image to extract road networks using advanced AI segmentation.
        Supported formats: JPG, PNG. Maximum file size: 5MB.
      </p>

      <div className="segmentation-container">
        <div className="upload-section">
          <div className="upload-box">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              id="image-upload"
              className="file-input"
            />
            <label htmlFor="image-upload" className="upload-label">
              <FaUpload className="upload-icon" />
              <span>Choose Image</span>
              <span className="upload-hint">or drag and drop</span>
            </label>
          </div>

          {selectedImage && (
            <div className="preview-container">
              <h3>Original Image</h3>
              <img src={selectedImage} alt="Selected" className="preview-image" />
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Processing image...</p>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {resultImage && (
          <div className="result-section">
            <h3>Segmented Roads</h3>
            <div className="result-container">
              <img src={resultImage} alt="Segmented Roads" className="result-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadSegmentation; 