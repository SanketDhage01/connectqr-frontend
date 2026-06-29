import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    // Connect to WebSocket server
    const socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server:', socketInstance.id);
      
      // If user is authenticated, join owner room immediately
      if (user && user._id) {
        socketInstance.emit('join_owner', user._id);
      }
    });

    // Re-verify and join room if user changes/logs in
    if (user && user._id && socketInstance.connected) {
      socketInstance.emit('join_owner', user._id);
    }

    return () => {
      console.log('Disconnecting socket...');
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketContext;
