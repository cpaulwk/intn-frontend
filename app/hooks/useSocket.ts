import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io as socketIO } from 'socket.io-client';

import { updateIdea } from '../slices/ideaSlice';
import { AppDispatch } from '../store';

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const newSocket = socketIO(process.env.NEXT_PUBLIC_API_URL as string, {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('upvoteUpdate', ({ ideaId, upvotes }) => {
      dispatch(updateIdea({ id: ideaId, changes: { upvotes } } as any));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  return socket;
};
