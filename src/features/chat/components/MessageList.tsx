import { useEffect, useRef } from "react";

import type { RealtimeChatMessage } from "../types";
import { getNameInitials } from "../../../utils/user";
import { getChatUserName } from "../chat.utils";

type MessageListProps = {
    messages: RealtimeChatMessage[];
    currentUserId: string;
    hasNextPage: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
};

const formatMessageTime = (value: string) =>
    new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    }).format(new Date(value));

export default function MessageList({
    messages,
    currentUserId,
    hasNextPage,
    isLoading,
    isLoadingMore,
    onLoadMore,
}: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const latestMessageId = messages.at(-1)?.id;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [latestMessageId]);

    return (
        <div className="flex h-[374px] flex-col gap-3 overflow-y-auto bg-[#faf8ff] p-4">
            {hasNextPage && (
                <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={onLoadMore}
                    className="mx-auto rounded-full bg-[#e5e7ff] px-3 py-1 text-[11px] font-semibold text-[#4648d4] disabled:opacity-50"
                >
                    {isLoadingMore
                        ? "Đang tải..."
                        : "Xem tin nhắn cũ hơn"}
                </button>
            )}

            {isLoading ? (
                <p className="m-auto text-sm text-slate-400">
                    Đang tải tin nhắn...
                </p>
            ) : messages.length === 0 ? (
                <p className="m-auto max-w-[240px] text-center text-sm text-slate-400">
                    Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.
                </p>
            ) : (
                messages.map((message) => {
                    const isMyMessage =
                        message.sender_id === currentUserId;
                    const senderName = message.users
                        ? getChatUserName(message.users)
                        : "Người dùng";

                    return (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${
                                isMyMessage
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {!isMyMessage && (
                                message.users?.avatar ? (
                                    <img
                                        src={message.users.avatar}
                                        alt={senderName}
                                        className="mb-5 h-6 w-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="mb-5 grid h-6 w-6 place-items-center rounded-full bg-[#e8e9ff] text-[8px] font-bold text-[#4648d4]">
                                        {getNameInitials(senderName)}
                                    </span>
                                )
                            )}

                            <div
                                className={`flex max-w-[80%] flex-col ${
                                    isMyMessage
                                        ? "items-end"
                                        : "items-start"
                                }`}
                            >
                                <div
                                    className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                                        isMyMessage
                                            ? "rounded-br-sm bg-indigo-600 text-white"
                                            : "rounded-bl-sm bg-white text-[#131b2e]"
                                    }`}
                                >
                                    {message.content ??
                                        "Tin nhắn không có nội dung"}
                                </div>

                                <span className="mt-1 px-1 text-[10px] text-slate-400">
                                    {formatMessageTime(
                                        message.created_at
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}

            <div ref={bottomRef} />
        </div>
    );
}
