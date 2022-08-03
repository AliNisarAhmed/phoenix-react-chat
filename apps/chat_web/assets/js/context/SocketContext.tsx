import { Socket, SocketConnectOption } from 'phoenix'; 
import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
} from 'react';

export const SocketContext = createContext<Socket | null>(null);

type SocketProviderProps = {
  options?: Partial<SocketConnectOption>;
  url: string;
  children: ReactNode;
};

export const SocketProvider = ({
  children,
  options,
  url = '/socket',
}: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const _socket = new Socket(url, options);

    _socket.connect();
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(null);
    };
  }, [options, url]);

  const value = socket;

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
