import React, { createContext, useContext, useState } from 'react';

interface MinimizedContextType {
  isMinimized: boolean;
  toggleMinimized: () => void;
}

const MinimizedContext = createContext<Partial<MinimizedContextType>>({});

export function MinimizedProvider({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimized = () => {
    setIsMinimized((prevIsMinimized) => !prevIsMinimized);
  };

  const contextValue: MinimizedContextType = {
    isMinimized,
    toggleMinimized,
  };

  return (
    <MinimizedContext.Provider value={contextValue}>
      {children}
    </MinimizedContext.Provider>
  );
}

export const useMinimized = () => {
  return useContext(MinimizedContext) as MinimizedContextType;
};
