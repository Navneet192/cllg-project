import React from "react";

export default function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="mode-switch">
      <label>
        <input
          type="radio"
          value="feature"
          checked={mode === "feature"}
          onChange={() => setMode("feature")}
          hidden
        />
        Feature Extraction
      </label>
      <label>
        <input
          type="radio"
          value="classify"
          checked={mode === "classify"}
          onChange={() => setMode("classify")}
          hidden
        />
        ML Classification
      </label>
    </div>
  );
}