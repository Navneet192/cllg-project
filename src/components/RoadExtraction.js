import React, { useState } from 'react';
import styles from './RoadExtraction.module.css';

const RoadExtraction = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/api/road-extract/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to extract roads');
            }

            setResult(data.result_image);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Road Extraction from Satellite Images</h2>
            
            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                />
                <button 
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className={styles.uploadButton}
                >
                    {loading ? 'Processing...' : 'Extract Roads'}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.imageContainer}>
                {preview && (
                    <div className={styles.imageSection}>
                        <h3>Original Image</h3>
                        <img src={preview} alt="Original" className={styles.image} />
                    </div>
                )}
                
                {result && (
                    <div className={styles.imageSection}>
                        <h3>Road Extraction Result</h3>
                        <img src={result} alt="Result" className={styles.image} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadExtraction; 