import React from "react";

export default function ModelSelector({ modelType, setModelType }) {
  return (
    <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
      <option value="rf">Random Forest</option>
      <option value="svm">SVM</option>
    </select>
  );
}
