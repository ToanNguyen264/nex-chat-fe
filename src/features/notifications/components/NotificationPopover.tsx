import { useEffect, useState } from "react";
import {
    Bell,
    CheckCheck,
    Heart,
    LoaderCircle,
    MessageCircle,
    UserRoundPlus,
} from "lucide-react";
import { useNavigate } from "react-router";

import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../../api/notification.api";
import { socket } from "../../../socket/socket";
import { useNotificationStore } from "../notification.store";
import type { AppNotification, NotificationType } from "../types";

type NotificationPopoverProps = {
    onClose: () => void;
};

const notificationMessages: Record<NotificationType, string> = {
    friend_request: "đã gửi cho bạn một lời mời kết bạn",
    friend_accept: "đã chấp nhận lời mời kết bạn của bạn",
    message: "đã gửi cho bạn một tin nhắn",
    post_reaction: "đã bày tỏ cảm xúc về bài viết của bạn",
    comment: "đã bình luận về bài viết của bạn",
    comment_reaction: "đã bày tỏ cảm xúc về bình luận của bạn",
};

const getActorName = (notification: AppNotification) => {
    if (!notification.actor) return "Hệ thống";

    return (
        [notification.actor.first_name, notification.actor.last_name]
            .filter(Boolean)
            .join(" ") ||
        notification.actor.user_name ||
        "Người dùng"
    );
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

const formatRelativeTime = (createdAt: string) => {
    const elapsedMinutes = Math.max(
        0,
        Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
    );

    if (elapsedMinutes < 1) return "Vừa xong";
    if (elapsedMinutes < 60) return `${elapsedMinutes} phút trước`;

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) return `${elapsedHours} giờ trước`;

    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 7) return `${elapsedDays} ngày trước`;

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(createdAt));
};

const getNotificationIcon = (type: NotificationType) => {
    if (type === "friend_request" || type === "friend_accept") {
        return <UserRoundPlus className="h-4 w-4" />;
    }

    if (type === "message") {
        return <MessageCircle className="h-4 w-4" />;
    }

    if (type === "post_reaction" || type === "comment_reaction") {
        return <Heart className="h-4 w-4" />;
    }

    return <Bell className="h-4 w-4" />;
};

export default function NotificationPopover({
    onClose,
}: NotificationPopoverProps) {
    const navigate = useNavigate();
    const decreaseUnread = useNotificationStore(
        (state) => state.decreaseUnread
    );
    const resetUnread = useNotificationStore((state) => state.resetUnread);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadNotifications = async () => {
            try {
                setError(null);
                const page = await getNotifications(10);

                if (!isActive) return;

                setNotifications(page.notifications);
                setNextCursor(page.pagination.nextCursor);
                setHasNextPage(page.pagination.hasNextPage);
            } catch (loadError) {
                console.error("Không thể tải thông báo:", loadError);
                if (isActive) setError("Không thể tải thông báo.");
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        const handleNewNotification = (notification: AppNotification) => {
            setNotifications((current) => {
                if (current.some((item) => item.id === notification.id)) {
                    return current;
                }

                return [notification, ...current];
            });
        };

        void loadNotifications();
        socket.on("notification:new", handleNewNotification);

        return () => {
            isActive = false;
            socket.off("notification:new", handleNewNotification);
        };
    }, []);

    const handleNotificationClick = async (
        notification: AppNotification
    ) => {
        if (!notification.is_read) {
            try {
                await markNotificationAsRead(notification.id);
                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id
                            ? { ...item, is_read: true }
                            : item
                    )
                );
                decreaseUnread();
            } catch (markError) {
                console.error("Không thể đánh dấu thông báo:", markError);
                return;
            }
        }

        onClose();

        if (
            notification.type === "friend_request" ||
            notification.type === "friend_accept"
        ) {
            navigate("/friends");
            return;
        }

        navigate("/home");
    };

    const handleMarkAllAsRead = async () => {
        try {
            setIsMarkingAll(true);
            await markAllNotificationsAsRead();
            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );
            resetUnread();
        } catch (markError) {
            console.error("Không thể đánh dấu tất cả thông báo:", markError);
        } finally {
            setIsMarkingAll(false);
        }
    };

    const handleLoadMore = async () => {
        if (!nextCursor || isLoadingMore) return;

        try {
            setIsLoadingMore(true);
            const page = await getNotifications(10, nextCursor);
            setNotifications((current) => {
                const existingIds = new Set(current.map((item) => item.id));
                return [
                    ...current,
                    ...page.notifications.filter(
                        (item) => !existingIds.has(item.id)
                    ),
                ];
            });
            setNextCursor(page.pagination.nextCursor);
            setHasNextPage(page.pagination.hasNextPage);
        } catch (loadError) {
            console.error("Không thể tải thêm thông báo:", loadError);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const hasUnreadNotifications = notifications.some(
        (notification) => !notification.is_read
    );

    return (
        <div className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e4e6f7] bg-white shadow-[0_16px_45px_rgba(27,31,59,0.16)]">
            <div className="flex items-center justify-between border-b border-[#eef0ff] px-4 py-3">
                <div>
                    <h2 className="text-base font-bold text-[#131b2e]">
                        Thông báo
                    </h2>
                    <p className="text-[11px] text-[#767586]">
                        Những hoạt động mới nhất của bạn
                    </p>
                </div>
                {hasUnreadNotifications && (
                    <button
                        type="button"
                        disabled={isMarkingAll}
                        onClick={() => void handleMarkAllAsRead()}
                        className="flex items-center gap-1 text-xs font-semibold text-[#4648d4] hover:underline disabled:opacity-60"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Đọc tất cả
                    </button>
                )}
            </div>

            <div className="max-h-[min(30rem,70vh)] overflow-y-auto p-2">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-[#767586]">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Đang tải thông báo...
                    </div>
                ) : error ? (
                    <p className="px-4 py-10 text-center text-sm text-[#b90538]">
                        {error}
                    </p>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                        <Bell className="mx-auto h-8 w-8 text-[#aaa9b8]" />
                        <p className="mt-2 text-sm font-semibold text-[#464554]">
                            Chưa có thông báo
                        </p>
                    </div>
                ) : (
                    <>
                        {notifications.map((notification) => {
                            const actorName = getActorName(notification);
                            const actorAvatar = notification.actor?.avatar;

                            return (
                                <button
                                    key={notification.id}
                                    type="button"
                                    onClick={() =>
                                        void handleNotificationClick(notification)
                                    }
                                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#f2f3ff] ${notification.is_read ? "bg-white" : "bg-[#f5f4ff]"}`}
                                >
                                    <span className="relative shrink-0">
                                        {actorAvatar ? (
                                            <img
                                                src={actorAvatar}
                                                alt={actorName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e1e0ff] text-xs font-bold text-[#4648d4]">
                                                {getInitials(actorName)}
                                            </span>
                                        )}
                                        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[#4648d4] shadow-sm">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[13px] leading-5 text-[#464554]">
                                            <strong className="font-semibold text-[#131b2e]">
                                                {actorName}
                                            </strong>{" "}
                                            {notificationMessages[notification.type]}
                                        </span>
                                        <span className="mt-1 block text-[11px] text-[#767586]">
                                            {formatRelativeTime(notification.created_at)}
                                        </span>
                                    </span>

                                    {!notification.is_read && (
                                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#4648d4]" />
                                    )}
                                </button>
                            );
                        })}

                        {hasNextPage && (
                            <button
                                type="button"
                                disabled={isLoadingMore}
                                onClick={() => void handleLoadMore()}
                                className="mt-1 w-full rounded-xl py-2.5 text-xs font-semibold text-[#4648d4] transition hover:bg-[#f2f3ff] disabled:opacity-60"
                            >
                                {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
