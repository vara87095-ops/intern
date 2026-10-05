import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [realtimeAlert, setRealtimeAlert] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to server (proxied via Vite /socket.io or current host in production)
    const socket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Connected to Real-time WebSocket server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Real-time WebSocket server');
      setIsConnected(false);
    });

    socket.on('users:count', (data) => {
      if (data && typeof data.count === 'number') {
        setOnlineCount(data.count);
      }
    });

    socket.on('task:created', (data) => {
      setRealtimeAlert({
        id: Date.now(),
        type: 'created',
        message: `⚡ ${data.actor || 'Team member'} created task: "${data.task.title}"`,
        task: data.task
      });
    });

    socket.on('task:updated', (data) => {
      setRealtimeAlert({
        id: Date.now(),
        type: 'updated',
        message: `🔄 ${data.actor || 'Team member'} updated task: "${data.task.title}" (${data.task.status})`,
        task: data.task
      });
    });

    socket.on('task:deleted', (data) => {
      setRealtimeAlert({
        id: Date.now(),
        type: 'deleted',
        message: `🗑️ ${data.actor || 'Team member'} deleted a task`,
        taskId: data.id
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearAlert = () => setRealtimeAlert(null);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineCount,
        realtimeAlert,
        clearAlert
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
