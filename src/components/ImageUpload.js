import React, { useState } from "react";
import axios from "axios";
import './ImageUpload.css';

const ImageUpload = ({ featureType, onResult, onLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      setSelectedFile(file);
      setError(null);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setError(null);
    onLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('feature_type', featureType);

    console.log('Submitting form with:', {
      featureType,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size
    });

    try {
      const response = await axios.post('http://localhost:8000/api/feature-extraction/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        },
      });

      console.log('Response received:', response.data);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        onResult(response.data);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Error processing image. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <span className="file-input-text">
              {selectedFile ? selectedFile.name : 'Choose an image'}
            </span>
          </label>
          <button 
            type="submit" 
            className="upload-button" 
            disabled={!selectedFile}
          >
            Process Image
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {preview && (
        <div className="preview-section">
          <h3>Selected Image</h3>
          <img 
            src={preview} 
            alt="Preview" 
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
