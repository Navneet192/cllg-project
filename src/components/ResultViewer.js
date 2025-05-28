import React from "react";

export default function ResultViewer({ resultImg }) {
  if (!resultImg) return null;

  return (
    <div className="result-container">
      <img src={resultImg} alt="Result" />
    </div>
  );
}
