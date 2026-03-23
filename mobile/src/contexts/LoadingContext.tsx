import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  loading: boolean;
  loadingText?: string;
  setLoading: (loading: boolean, text?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>();

  const setLoading = (isLoading: boolean, text?: string) => {
    setLoadingState(isLoading);
    setLoadingText(text);
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingText, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
