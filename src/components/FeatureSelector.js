import React from "react";

export default function FeatureSelector({ featureType, setFeatureType }) {
  return (
    <select
      value={featureType}
      onChange={(e) => setFeatureType(e.target.value)}
      className="feature-selector"
    >
      <option value="segmentation">Semantic Segmentation</option>
      <option value="water">Water Detection</option>
      <option value="vegetation">Vegetation Detection</option>
      <option value="urban">Urban Area Detection</option>
    </select>
  );
}
