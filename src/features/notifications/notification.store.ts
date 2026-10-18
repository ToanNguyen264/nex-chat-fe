import { create } from "zustand";

type NotificationState = {
    unreadCount: number;
};

type NotificationActions = {
    increaseUnread: () => void;
    decreaseUnread: () => void;
    setUnreadCount: (count: number) => void;
    resetUnread: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore =
    create<NotificationStore>()((set) => ({
        unreadCount: 0,

        increaseUnread: () => {
            set((state) => ({
                unreadCount:
                    state.unreadCount + 1,
            }));
        },

        decreaseUnread: () => {
            set((state) => ({
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        },

        setUnreadCount: (count) => {
            set({
                unreadCount: Math.max(0, count),
            });
        },

        resetUnread: () => {
            set({
                unreadCount: 0,
            });
        },
    }));
