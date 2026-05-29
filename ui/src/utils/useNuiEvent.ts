import { useEffect, useRef } from 'react';

interface NuiMessageData<T = any> {
  action: string;
  data: T;
}

export const useNuiEvent = <T = any>(
  action: string,
  handler: (data: T) => void
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action: eventAction, data } = event.data;

      if (savedHandler.current) {
        if (eventAction === action) {
          savedHandler.current(data);
        }
      }
    };

    window.addEventListener('message', eventListener);

    return () => window.removeEventListener('message', eventListener);
  }, [action]);
};
