import { create } from "zustand";

type PresenceState = {
    onlineUserIds: Set<string>;
};

type PresenceActions = {
    setOnlineUsers: (userIds: string[]) => void;
    setUserOnline: (userId: string) => void;
    setUserOffline: (userId: string) => void;
    resetPresence: () => void;
};

type PresenceStore = PresenceState & PresenceActions;

export const usePresenceStore =
    create<PresenceStore>()((set) => ({
        onlineUserIds: new Set<string>(),

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

        setUserOffline: (userId) => {
            set((state) => {
                const nextOnlineUserIds = new Set(
                    state.onlineUserIds
                );

                nextOnlineUserIds.delete(userId);

                return {
                    onlineUserIds: nextOnlineUserIds,
                };
            });
        },

        resetPresence: () => {
            set({
                onlineUserIds: new Set<string>(),
            });
        },
    }));
