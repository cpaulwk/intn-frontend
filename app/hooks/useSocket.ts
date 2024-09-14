import { useState, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

export const useSocket = (url: string): Socket | null => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanupFunction: (() => void) | undefined;

    const initSocket = async () => {
      try {
        const io = (await import('socket.io-client')).default;
        const newSocket = io(url);

        newSocket.on('connect', () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
        });

        socketRef.current = newSocket;

        cleanupFunction = () => {
          newSocket.disconnect();
          socketRef.current = null;
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      }
    };

    initSocket();

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [url]);

  return socketRef.current;
};
