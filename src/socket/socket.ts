import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_BASE_URL;

if (!socketUrl) {
    throw new Error(
        "VITE_API_BASE_URL is missing"
    );
}

export const socket = io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
});

export const connectSocket = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return;
    }

    // Gửi token trong quá trình handshake
    socket.auth = {
        token: accessToken,
    };

    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};