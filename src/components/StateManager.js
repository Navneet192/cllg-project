import { useState } from "react";

const useStateManager = () => {
  const [featureType, setFeatureType] = useState("ndwi");
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("feature");
  const [modelType, setModelType] = useState("rf");

  return {
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
  };
}

export default useStateManager;
