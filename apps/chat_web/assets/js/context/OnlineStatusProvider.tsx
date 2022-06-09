import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const OnlineStatusContext = createContext<boolean | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const OnlineStatusProvider = ({ children }: Props) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);

  useEffect(() => {
    window.addEventListener('online', () => setOnlineStatus(true));
    window.addEventListener('offline', () => setOnlineStatus(false));

    return () => {
      window.removeEventListener('offline', () => setOnlineStatus(false));
      window.removeEventListener('online', () => setOnlineStatus(true));
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export function useOnlineStatus() {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('Not wrapped in OnlineStatusProvider');
  }

  return context;
}
