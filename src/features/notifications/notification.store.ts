import { create } from "zustand";

type NotificationState = {
    unreadCount: number;
};

type NotificationActions = {
    increaseUnread: () => void;
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

        resetUnread: () => {
            set({
                unreadCount: 0,
            });
        },
    }));