import { useEffect } from "react";
import { useLocation } from "react-router";
import {
    connectSocket,
    disconnectSocket,
    socket,
} from "./socket";
import type { AppNotification } from "../features/notifications/types";

import { useNotificationStore } from "../features/notifications/notification.store";
import { usePresenceStore } from "../features/presence/presence.store";

type PresenceSnapshotPayload = {
    userIds: string[];
};

type PresenceUserPayload = {
    userId: string;
};

export default function SocketManager() {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại.

    const increaseUnread = useNotificationStore((state) => state.increaseUnread); //lấy action từ store
    const setOnlineUsers = usePresenceStore(
        (state) => state.setOnlineUsers
    );
    const setUserOnline = usePresenceStore(
        (state) => state.setUserOnline
    );
    const setUserOffline = usePresenceStore(
        (state) => state.setUserOffline
    );
    const resetPresence = usePresenceStore(
        (state) => state.resetPresence
    );

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            disconnectSocket();
            resetPresence();
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
            resetPresence();
        };

        const handlePresenceSnapshot = (
            payload: PresenceSnapshotPayload
        ) => {
            if (!payload || !Array.isArray(payload.userIds)) return;

            setOnlineUsers(
                payload.userIds.filter(
                    (userId): userId is string =>
                        typeof userId === "string"
                )
            );
        };

        const handlePresenceOnline = (
            payload: PresenceUserPayload
        ) => {
            if (!payload || typeof payload.userId !== "string") return;

            setUserOnline(payload.userId);
        };

        const handlePresenceOffline = (
            payload: PresenceUserPayload
        ) => {
            if (!payload || typeof payload.userId !== "string") return;

            setUserOffline(payload.userId);
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
        socket.on(
            "presence:snapshot",
            handlePresenceSnapshot
        );
        socket.on(
            "presence:online",
            handlePresenceOnline
        );
        socket.on(
            "presence:offline",
            handlePresenceOffline
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
            socket.off(
                "presence:snapshot",
                handlePresenceSnapshot
            );
            socket.off(
                "presence:online",
                handlePresenceOnline
            );
            socket.off(
                "presence:offline",
                handlePresenceOffline
            );
        };
    }, [
        location.pathname,
        increaseUnread,
        resetPresence,
        setOnlineUsers,
        setUserOffline,
        setUserOnline,
    ]);

    return null;
}
