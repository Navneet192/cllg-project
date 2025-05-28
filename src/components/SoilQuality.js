import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaSpinner, FaRedo } from 'react-icons/fa';
import styles from './SoilQuality.module.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const SoilQuality = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchSoilData = async (lat, lng) => {
    setLoading(true);
    setError('');
    setSoilData(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/soil-data/`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng
          })
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSoilData(data);
        setRetryCount(0); // Reset retry count on success
      } else {
        let errorMessage = data.error || 'Error fetching soil data';
        
        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = 'Google Maps API key is invalid. Please contact the administrator.';
        } else if (response.status === 503) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to fetch soil data. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    await fetchSoilData(lat, lng);
  };

  const handleRetry = async () => {
    if (selectedLocation) {
      setRetryCount(prev => prev + 1);
      await fetchSoilData(selectedLocation.lat, selectedLocation.lng);
    }
  };

  return (
    <div className={styles.soilQualityContainer}>
      <h2>Soil Quality Analysis</h2>
      <p className={styles.description}>
        Click on the map to analyze soil quality at that location.
      </p>

      <div className={styles.mapContainer}>
        <LoadScript googleMapsApiKey="AIzaSyAc9c7cDY2yY7wDBlM-qgi1j4ZpiU2IK9w">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
          >
            {selectedLocation && (
              <Marker position={selectedLocation} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Analyzing soil quality...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          {retryCount < 3 && (
            <button onClick={handleRetry} className={styles.retryButton}>
              <FaRedo /> Retry
            </button>
          )}
        </div>
      )}

      {soilData && (
        <div className={styles.soilDataContainer}>
          <h3>Soil Analysis Results</h3>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <h4>Soil Type</h4>
              <p>{soilData.soil_analysis.soil_type}</p>
            </div>
            <div className={styles.dataItem}>
              <h4>pH Level</h4>
              <p>{soilData.soil_analysis.ph_level}</p>
            </div>
            <div className={styles.dataItem}>
              <h4>Moisture Content</h4>
              <p>{soilData.soil_analysis.moisture_content}</p>
            </div>
            <div className={styles.dataItem}>
              <h4>Nutrient Levels</h4>
              <p>
                Nitrogen: {soilData.soil_analysis.nutrient_levels.nitrogen}<br />
                Phosphorus: {soilData.soil_analysis.nutrient_levels.phosphorus}<br />
                Potassium: {soilData.soil_analysis.nutrient_levels.potassium}
              </p>
            </div>
            <div className={styles.dataItem}>
              <h4>Recommendations</h4>
              <ul className={styles.recommendationsList}>
                {soilData.soil_analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className={styles.dataItem}>
              <h4>Location</h4>
              <p>
                {soilData.location.results[0]?.formatted_address || 'Location details not available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilQuality; 