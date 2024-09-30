import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { updateIdea } from '../slices/ideaSlice';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('upvoteUpdate', ({ ideaId, upvotes }) => {
      dispatch(updateIdea({ id: ideaId, changes: { upvotes } }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  return socket;
};
