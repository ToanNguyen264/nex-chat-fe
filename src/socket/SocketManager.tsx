import { useEffect } from "react";
import { useLocation } from "react-router";
import {
    connectSocket,
    disconnectSocket,
    socket,
} from "./socket";
import type { AppNotification } from "../features/notifications/types";

import { useNotificationStore } from "../features/notifications/notification.store";

export default function SocketManager() {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại.

    const increaseUnread = useNotificationStore((state) => state.increaseUnread); //lấy action từ store

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            disconnectSocket();
            return;
        }

        const handleConnect = () => {
            console.log(
                "Socket connected:",
                socket.id
            );
        };

        const handleConnectError = (
            error: Error
        ) => {
            console.error(
                "Socket connection error:",
                error.message
            );
        };

        const handleDisconnect = (
            reason: string
        ) => {
            console.log("Socket disconnected:",reason);
        };

        const handleNewNotification = (
            notification: AppNotification
        ) => {
            console.log(
                "New notification:",
                notification
            );
            increaseUnread(); // Gọi action để tăng số lượng thông báo chưa đọc
        };

        socket.on("connect", handleConnect);
        socket.on(
            "connect_error",
            handleConnectError
        );
        socket.on(
            "disconnect",
            handleDisconnect
        );
        socket.on(
            "notification:new",
            handleNewNotification
        );

        connectSocket();

        return () => {
            socket.off("connect", handleConnect);
            socket.off(
                "connect_error",
                handleConnectError
            );
            socket.off(
                "disconnect",
                handleDisconnect
            );
            socket.off(
                "notification:new",
                handleNewNotification
            );
        };
    }, [location.pathname, increaseUnread]);

    return null;
}
