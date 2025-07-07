import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_API_ENDPOINT } from '../utils/constants';

interface ApiContextType {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [apiUrl, setApiUrlState] = useState(() => {
    // Загружаем сохраненный API из localStorage или используем дефолтный
    return localStorage.getItem('selectedApi') || DEFAULT_API_ENDPOINT;
  });

  const setApiUrl = (url: string) => {
    setApiUrlState(url);
    localStorage.setItem('selectedApi', url);
  };

  useEffect(() => {
    // Обновляем localStorage при изменении API
    localStorage.setItem('selectedApi', apiUrl);
  }, [apiUrl]);

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
