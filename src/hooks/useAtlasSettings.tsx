import { useState, useEffect } from 'react';

const ATLAS_ENABLED_KEY = 'travelogie_atlas_enabled';

export const useAtlasSettings = () => {
  const [isAtlasEnabled, setIsAtlasEnabled] = useState(() => {
    const saved = localStorage.getItem(ATLAS_ENABLED_KEY);
    return saved === null ? true : JSON.parse(saved); // Default to enabled
  });

  useEffect(() => {
    localStorage.setItem(ATLAS_ENABLED_KEY, JSON.stringify(isAtlasEnabled));
  }, [isAtlasEnabled]);

  const toggleAtlas = () => {
    setIsAtlasEnabled(prev => !prev);
  };

  return {
    isAtlasEnabled,
    toggleAtlas
  };
};