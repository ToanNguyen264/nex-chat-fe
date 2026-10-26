import { create } from "zustand";

type PresenceState = {
    onlineUserIds: Set<string>;
    lastSeenByUserId: Record<string, string>;
};

type PresenceActions = {
    setOnlineUsers: (userIds: string[]) => void;
    setUserOnline: (userId: string) => void;
    setUserOffline: (
        userId: string,
        lastSeenAt?: string | null
    ) => void;
    resetPresence: () => void;
};

type PresenceStore = PresenceState & PresenceActions;

export const formatPresenceStatus = (
    isOnline: boolean,
    lastSeenAt?: string | null,
    nowMs = Date.now()
) => {
    if (isOnline) {
        return "Đang hoạt động";
    }

    if (!lastSeenAt) {
        return "Đang offline";
    }

    const lastSeenMs = new Date(lastSeenAt).getTime();

    if (Number.isNaN(lastSeenMs)) {
        return "Đang offline";
    }

    const diffMinutes = Math.max(
        0,
        Math.floor((nowMs - lastSeenMs) / 60_000)
    );

    if (diffMinutes < 1) {
        return "Hoạt động vừa xong";
    }

    if (diffMinutes < 60) {
        return `Hoạt động ${diffMinutes} phút trước`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `Hoạt động ${diffHours} giờ trước`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `Hoạt động ${diffDays} ngày trước`;
};

export const usePresenceStore =
    create<PresenceStore>()((set) => ({
        onlineUserIds: new Set<string>(),
        lastSeenByUserId: {},

        setOnlineUsers: (userIds) => {
            set({
                onlineUserIds: new Set(userIds),
            });
        },

        setUserOnline: (userId) => {
            set((state) => {
                const nextOnlineUserIds = new Set(
                    state.onlineUserIds
                );

                nextOnlineUserIds.add(userId);

                return {
                    onlineUserIds: nextOnlineUserIds,
                };
            });
        },

        setUserOffline: (userId, lastSeenAt) => {
            set((state) => {
                const nextOnlineUserIds = new Set(
                    state.onlineUserIds
                );

                nextOnlineUserIds.delete(userId);

                return {
                    onlineUserIds: nextOnlineUserIds,
                    lastSeenByUserId: lastSeenAt
                        ? {
                              ...state.lastSeenByUserId,
                              [userId]: lastSeenAt,
                          }
                        : state.lastSeenByUserId,
                };
            });
        },

        resetPresence: () => {
            set({
                onlineUserIds: new Set<string>(),
                lastSeenByUserId: {},
            });
        },
    }));
