import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNuiEvent } from '../utils/useNuiEvent';
import { fetchNui } from '../utils/fetchNui';

interface VisibilityProviderValue {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const VisibilityCtx = createContext<VisibilityProviderValue>({} as VisibilityProviderValue);

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  useNuiEvent<boolean>('setVisible', setVisible);

  useEffect(() => {
    if (!visible) {
      fetchNui('close');
    }
  }, [visible]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) {
        if (!visible) return;
        setVisible(false);
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  return (
    <VisibilityCtx.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%' }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx);

