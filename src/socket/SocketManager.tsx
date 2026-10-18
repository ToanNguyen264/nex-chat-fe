import { useEffect } from "react";
import { useLocation } from "react-router";
import {
    connectSocket,
    disconnectSocket,
    socket,
} from "./socket";
import type { AppNotification } from "../features/notifications/types";
import type {
    RealtimeChatMessage,
    RealtimeMessageReactionUpdate,
} from "../features/chat/types";

import { useChatStore } from "../features/chat/chat.store";
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
    const receiveMessage = useChatStore(
        (state) => state.receiveMessage
    );
    const resetChat = useChatStore(
        (state) => state.resetChat
    );
    const updateMessageReaction = useChatStore(
        (state) => state.updateMessageReaction
    );

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            disconnectSocket();
            resetPresence();
            resetChat();
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

        const handleNewMessage = (
            message: RealtimeChatMessage
        ) => {
            if (
                !message ||
                typeof message.id !== "string" ||
                typeof message.conversation_id !== "string"
            ) {
                return;
            }

            receiveMessage(message);
        };

        const handleMessageReaction = (
            update: RealtimeMessageReactionUpdate
        ) => {
            if (
                !update ||
                typeof update.conversationId !== "string" ||
                typeof update.messageId !== "string" ||
                !Array.isArray(update.reactionSummary)
            ) {
                return;
            }

            // Event realtime chỉ cập nhật tổng hợp. Reaction của chính
            // người dùng được cập nhật từ REST response.
            updateMessageReaction({
                conversationId: update.conversationId,
                messageId: update.messageId,
                reactionSummary: update.reactionSummary,
                reactionCount: update.reactionCount,
            });
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
        socket.on("message:new", handleNewMessage);
        socket.on(
            "message:reaction-updated",
            handleMessageReaction
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
            socket.off("message:new", handleNewMessage);
            socket.off(
                "message:reaction-updated",
                handleMessageReaction
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
        receiveMessage,
        resetChat,
        resetPresence,
        setOnlineUsers,
        setUserOffline,
        setUserOnline,
        updateMessageReaction,
    ]);

    return null;
}
