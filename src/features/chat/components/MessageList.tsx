import { useEffect, useRef, useState } from "react";
import {
    PhoneCall,
    PhoneMissed,
    Reply,
    SmilePlus,
    Video,
    VideoOff,
} from "lucide-react";

import type {
    MessageReactionType,
    RealtimeChatMessage,
} from "../types";
import defaultAvatar from "../../../assets/default-avatar.png";
import { getChatUserName } from "../chat.utils";

type MessageListProps = {
    messages: RealtimeChatMessage[];
    currentUserId: string;
    hasNextPage: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    onReply: (message: RealtimeChatMessage) => void;
    onReact: (
        messageId: string,
        reactionType: MessageReactionType
    ) => Promise<void>;
    reactingMessageId: string | null;
};

const reactionOptions: Array<{
    type: MessageReactionType;
    emoji: string;
    label: string;
}> = [
    { type: "like", emoji: "👍", label: "Thích" },
    { type: "love", emoji: "❤️", label: "Yêu thích" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Buồn" },
    { type: "angry", emoji: "😡", label: "Phẫn nộ" },
];

const reactionEmoji = Object.fromEntries(
    reactionOptions.map((reaction) => [
        reaction.type,
        reaction.emoji,
    ])
) as Record<MessageReactionType, string>;

const formatMessageTime = (value: string) =>
    new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    }).format(new Date(value));

const MessageContent = ({
    message,
    isMyMessage,
}: {
    message: RealtimeChatMessage;
    isMyMessage: boolean;
}) => {
    const attachment = message.attachments?.[0];
    const isImage =
        message.message_type === "image" ||
        attachment?.file_type?.startsWith("image/");
    const isAudio = attachment?.file_type?.startsWith("audio/");

    if (attachment && isImage) {
        return (
            <div className="overflow-hidden rounded-2xl shadow-sm">
                <a
                    href={attachment.file_url}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={attachment.file_url}
                        alt={attachment.file_name || "Ảnh trong tin nhắn"}
                        className="max-h-64 w-full max-w-[260px] object-cover"
                    />
                </a>
                {message.content && (
                    <p
                        className={`whitespace-pre-wrap break-words px-3 py-2 text-sm ${
                            isMyMessage
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-[#131b2e]"
                        }`}
                    >
                        {message.content}
                    </p>
                )}
            </div>
        );
    }

    if (attachment && isAudio) {
        return (
            <div
                className={`rounded-2xl p-2 shadow-sm ${
                    isMyMessage ? "bg-indigo-600" : "bg-white"
                }`}
            >
                <audio
                    controls
                    preload="metadata"
                    src={attachment.file_url}
                    className="h-10 w-[240px] max-w-full"
                >
                    Trình duyệt không hỗ trợ phát âm thanh.
                </audio>
            </div>
        );
    }

    if (attachment) {
        return (
            <a
                href={attachment.file_url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-2xl px-3 py-2 text-sm underline shadow-sm ${
                    isMyMessage
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-[#131b2e]"
                }`}
            >
                {attachment.file_name || "Tải tệp đính kèm"}
            </a>
        );
    }

    if (message.message_type === "system") {
        const rawContent = message.content || "Cuộc gọi";
        const isVideoCall = rawContent.toLowerCase().includes("video");
        const isMissed = rawContent.includes("nhỡ");
        const isRejected = rawContent.includes("từ chối");
        const isCancelled = rawContent.includes("huỷ");
        const isUnsuccessful = isMissed || isRejected || isCancelled;

        let title = rawContent;
        let subtitle = "";

        if (rawContent.includes(" • ")) {
            const [head, tail] = rawContent.split(" • ");
            title = head;
            subtitle = tail;
        } else if (isMissed) {
            title = isMyMessage
                ? rawContent.replace(" bị nhỡ", "")
                : "Cuộc gọi nhỡ";
            subtitle = isMyMessage
                ? "Không trả lời"
                : isVideoCall
                  ? "Cuộc gọi video"
                  : "Cuộc gọi thoại";
        } else if (isRejected) {
            title = rawContent.replace(" bị từ chối", "");
            subtitle = "Đã từ chối";
        } else if (isCancelled) {
            title = isMyMessage
                ? rawContent.replace(" đã huỷ", "")
                : "Cuộc gọi nhỡ";
            subtitle = isMyMessage
                ? "Đã huỷ"
                : isVideoCall
                  ? "Cuộc gọi video"
                  : "Cuộc gọi thoại";
        }

        const IconComponent = isUnsuccessful
            ? isVideoCall
                ? VideoOff
                : PhoneMissed
            : isVideoCall
              ? Video
              : PhoneCall;

        return (
            <div
                className={`flex min-w-[185px] items-center gap-3 rounded-2xl border px-3.5 py-2.5 shadow-sm ${
                    isMyMessage
                        ? "rounded-br-sm border-indigo-500/20 bg-indigo-600 text-white"
                        : "rounded-bl-sm border-slate-100 bg-white text-[#131b2e]"
                }`}
            >
                <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        isUnsuccessful
                            ? isMyMessage
                                ? "bg-white/20 text-rose-100"
                                : "bg-rose-50 text-rose-600"
                            : isMyMessage
                              ? "bg-white/20 text-white"
                              : "bg-indigo-50 text-indigo-600"
                    }`}
                >
                    <IconComponent className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <p
                        className={`truncate text-sm font-semibold leading-tight ${
                            !isMyMessage && isUnsuccessful
                                ? "text-rose-600"
                                : ""
                        }`}
                    >
                        {title}
                    </p>
                    {subtitle && (
                        <p
                            className={`mt-0.5 text-xs ${
                                isMyMessage
                                    ? "text-indigo-100"
                                    : "text-slate-500"
                            }`}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                isMyMessage
                    ? "rounded-br-sm bg-indigo-600 text-white"
                    : "rounded-bl-sm bg-white text-[#131b2e]"
            }`}
        >
            {message.content || "Tin nhắn không có nội dung"}
        </div>
    );
};

export default function MessageList({
    messages,
    currentUserId,
    hasNextPage,
    isLoading,
    isLoadingMore,
    onLoadMore,
    onReply,
    onReact,
    reactingMessageId,
}: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [reactionPickerMessageId, setReactionPickerMessageId] =
        useState<string | null>(null);
    const latestMessageId = messages.at(-1)?.id;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
                    {isLoadingMore ? "Đang tải..." : "Xem tin nhắn cũ hơn"}
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
                    const isMyMessage = message.sender_id === currentUserId;
                    const senderName = message.users
                        ? getChatUserName(message.users)
                        : "Người dùng";

                    return (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${
                                isMyMessage ? "justify-end" : "justify-start"
                            }`}
                        >
                            {!isMyMessage && (
                                <img
                                    src={message.users?.avatar || defaultAvatar}
                                    alt={senderName}
                                    className="mb-5 h-6 w-6 rounded-full object-cover bg-slate-100"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                    }}
                                />
                            )}

                            <div
                                className={`relative flex max-w-[80%] flex-col ${
                                    isMyMessage ? "items-end" : "items-start"
                                }`}
                            >
                                {message.reply_to && (
                                    <div
                                        className={`mb-1 max-w-full rounded-xl border-l-4 border-indigo-400 bg-slate-200/80 px-3 py-2 text-xs text-slate-600 ${
                                            isMyMessage
                                                ? "rounded-br-sm"
                                                : "rounded-bl-sm"
                                        }`}
                                    >
                                        <p className="font-semibold text-indigo-600">
                                            {message.reply_to.users
                                                ? getChatUserName(
                                                      message.reply_to.users
                                                  )
                                                : "Tin nhắn"}
                                        </p>
                                        <p className="truncate">
                                            {message.reply_to.deleted_at
                                                ? "Tin nhắn đã bị xóa"
                                                : message.reply_to.content ||
                                                  (message.reply_to
                                                      .message_type === "image"
                                                      ? "Ảnh"
                                                      : "Tệp đính kèm")}
                                        </p>
                                    </div>
                                )}

                                <MessageContent
                                    message={message}
                                    isMyMessage={isMyMessage}
                                />

                                {message.reactionCount > 0 && (
                                    <div className="mt-1 flex items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-0.5 text-[11px] shadow-sm">
                                        {message.reactionSummary.map(
                                            (reaction) => (
                                                <span key={reaction.type}>
                                                    {reactionEmoji[
                                                        reaction.type
                                                    ]}
                                                    {reaction.count > 1
                                                        ? reaction.count
                                                        : ""}
                                                </span>
                                            )
                                        )}
                                        <span className="text-slate-400">
                                            {message.reactionCount}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-1 flex items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label="Trả lời tin nhắn"
                                        onClick={() => onReply(message)}
                                        className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-indigo-600"
                                    >
                                        <Reply className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            aria-label="Bày tỏ cảm xúc"
                                            onClick={() =>
                                                setReactionPickerMessageId(
                                                    (current) =>
                                                        current === message.id
                                                            ? null
                                                            : message.id
                                                )
                                            }
                                            className={`rounded-full p-1 hover:bg-white ${
                                                message.currentReaction
                                                    ? "text-indigo-600"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {message.currentReaction ? (
                                                <span className="text-sm leading-none">
                                                    {
                                                        reactionEmoji[
                                                            message
                                                                .currentReaction
                                                        ]
                                                    }
                                                </span>
                                            ) : (
                                                <SmilePlus className="h-3.5 w-3.5" />
                                            )}
                                        </button>

                                        {reactionPickerMessageId ===
                                            message.id && (
                                            <div
                                                className={`absolute bottom-full z-30 mb-1 flex rounded-full border border-indigo-100 bg-white p-1 shadow-xl ${
                                                    isMyMessage
                                                        ? "right-0"
                                                        : "left-0"
                                                }`}
                                            >
                                                {reactionOptions.map(
                                                    (reaction) => (
                                                        <button
                                                            key={reaction.type}
                                                            type="button"
                                                            title={reaction.label}
                                                            disabled={
                                                                reactingMessageId ===
                                                                message.id
                                                            }
                                                            onClick={() => {
                                                                setReactionPickerMessageId(
                                                                    null
                                                                );
                                                                void onReact(
                                                                    message.id,
                                                                    reaction.type
                                                                );
                                                            }}
                                                            className="grid h-8 w-8 place-items-center rounded-full text-xl transition hover:-translate-y-1 hover:scale-110 hover:bg-indigo-50 disabled:opacity-50"
                                                        >
                                                            {reaction.emoji}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <span className="mt-1 px-1 text-[10px] text-slate-400">
                                    {formatMessageTime(message.created_at)}
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
