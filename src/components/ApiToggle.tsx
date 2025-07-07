import { useState, useEffect } from 'react';
import { API_ENDPOINTS, DEFAULT_API_ENDPOINT } from '../utils/constants';
import './ApiToggle.css';

interface ApiToggleProps {
  onApiChange: (apiUrl: string) => void;
}

const ApiToggle = ({ onApiChange }: ApiToggleProps) => {
  const [currentApi, setCurrentApi] = useState(() => {
    // Загружаем сохраненный API из localStorage или используем дефолтный
    return localStorage.getItem('selectedApi') || DEFAULT_API_ENDPOINT;
  });

  useEffect(() => {
    // Сообщаем родительскому компоненту о текущем API
    onApiChange(currentApi);
  }, [currentApi, onApiChange]);

  const handleApiChange = (apiUrl: string) => {
    setCurrentApi(apiUrl);
    localStorage.setItem('selectedApi', apiUrl);
    onApiChange(apiUrl);
  };

  const getApiLabel = (apiUrl: string) => {
    switch (apiUrl) {
      case API_ENDPOINTS.CLOUDFLARE:
        return 'Cloudflare Worker';
      case API_ENDPOINTS.LOCAL:
        return 'Local';
      default:
        return 'Unknown';
    }
  };

  const getApiIcon = (apiUrl: string) => {
    switch (apiUrl) {
      case API_ENDPOINTS.CLOUDFLARE:
        return '☁️';
      case API_ENDPOINTS.LOCAL:
        return '🏠';
      default:
        return '🌐';
    }
  };

  return (
    <div className="api-toggle">
      <label className="api-toggle__label">Backend API:</label>
      <div className="api-toggle__options">
        <button
          className={`api-toggle__option ${
            currentApi === API_ENDPOINTS.CLOUDFLARE ? 'active' : ''
          }`}
          onClick={() => handleApiChange(API_ENDPOINTS.CLOUDFLARE)}
          title="Cloudflare Worker API (https://crimson-block-9a4c.smvrnn.workers.dev)"
        >
          {getApiIcon(API_ENDPOINTS.CLOUDFLARE)}{' '}
          {getApiLabel(API_ENDPOINTS.CLOUDFLARE)}
        </button>
        <button
          className={`api-toggle__option ${
            currentApi === API_ENDPOINTS.LOCAL ? 'active' : ''
          }`}
          onClick={() => handleApiChange(API_ENDPOINTS.LOCAL)}
          title="Local API Server (http://localhost:3000)"
        >
          {getApiIcon(API_ENDPOINTS.LOCAL)} {getApiLabel(API_ENDPOINTS.LOCAL)}
        </button>
      </div>
    </div>
  );
};

export default ApiToggle;
