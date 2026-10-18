import api from "./axios";
import type { AppNotification } from "../features/notifications/types";

export type NotificationPagination = {
    nextCursor: string | null;
    hasNextPage: boolean;
};

export type NotificationPage = {
    notifications: AppNotification[];
    pagination: NotificationPagination;
};

type GetNotificationsResponse = {
    success: boolean;
    data: AppNotification[];
    pagination: NotificationPagination;
};

type GetUnreadCountResponse = {
    success: boolean;
    data: {
        unreadCount: number;
    };
};

type MarkNotificationAsReadResponse = {
    success: boolean;
    message: string;
    data: {
        id: string;
        user_id: string;
        is_read: boolean;
    };
};

type MarkAllNotificationsAsReadResponse = {
    success: boolean;
    message: string;
    data: {
        updatedCount: number;
    };
};

export const getNotifications = async (
    limit = 20,
    cursor?: string
): Promise<NotificationPage> => {
    const response =
        await api.get<GetNotificationsResponse>(
            "/notifications",
            {
                params: cursor
                    ? {
                          limit,
                          cursor,
                      }
                    : {
                          limit,
                      },
            }
        );

    return {
        notifications: response.data.data,
        pagination: response.data.pagination,
    };
};

export const getUnreadNotificationCount =
    async (): Promise<number> => {
        const response =
            await api.get<GetUnreadCountResponse>(
                "/notifications/unread-count"
            );

        return response.data.data.unreadCount;
    };

export const markNotificationAsRead = async (
    notificationId: string
) => {
    const response =
        await api.patch<MarkNotificationAsReadResponse>(
            `/notifications/${notificationId}/read`
        );

    return response.data.data;
};

export const markAllNotificationsAsRead =
    async (): Promise<number> => {
        const response =
            await api.patch<MarkAllNotificationsAsReadResponse>(
                "/notifications/read-all"
            );

        return response.data.data.updatedCount;
    };
