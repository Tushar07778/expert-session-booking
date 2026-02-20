import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

/**
 * Provides a Socket.io connection to all child components.
 * The socket connects once and is reused throughout the app lifecycle.
 */
export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('🔗 Socket connected:', socketRef.current.id);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('🔌 Socket disconnected');
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
