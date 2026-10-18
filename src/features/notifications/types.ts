export type NotificationType =
    | "friend_request"
    | "friend_accept"
    | "message"
    | "post_reaction"
    | "comment"
    | "comment_reaction";

export type NotificationActor = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
};

export type AppNotification = {
    id: string;
    user_id: string;
    actor_id: string | null;
    type: NotificationType;
    reference_id: string | null;
    is_read: boolean;
    created_at: string;
    actor: NotificationActor | null;
};
