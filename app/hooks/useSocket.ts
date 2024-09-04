import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};