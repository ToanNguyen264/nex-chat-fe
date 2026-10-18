import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import type { CurrentUser } from "../../api/user.api";
import type { CursorPagination } from "./types";
import { getConversations } from "../../api/conversation.api";
import {
    getConversationMessages,
    sendTextMessage,
} from "../../api/message.api";
import { useChatStore } from "./chat.store";
import {
    getConversationAvatar,
    getConversationName,
    getOtherConversationUser,
} from "./chat.utils";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { getNameInitials } from "../../utils/user";
import { usePresenceStore } from "../presence/presence.store";

type ChatPopupProps = {
    currentUser: CurrentUser | null;
};

const emptyPagination: CursorPagination = {
    nextCursor: null,
    hasNextPage: false,
};

const formatConversationTime = (value: string) =>
    new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    }).format(new Date(value));

export default function ChatPopup({
    currentUser,
}: ChatPopupProps) {
    const conversations = useChatStore(
        (state) => state.conversations
    );
    const isOpen = useChatStore(
        (state) => state.isChatOpen
    );
    const showConversationList = useChatStore(
        (state) => state.isConversationListVisible
    );
    const activeConversationId = useChatStore(
        (state) => state.activeConversationId
    );
    const messagesByConversation = useChatStore(
        (state) => state.messagesByConversation
    );
    const latestMessages = useChatStore(
        (state) => state.latestMessageByConversation
    );
    const setConversations = useChatStore(
        (state) => state.setConversations
    );
    const openConversationList = useChatStore(
        (state) => state.openConversationList
    );
    const openConversation = useChatStore(
        (state) => state.openConversation
    );
    const showConversationListView = useChatStore(
        (state) => state.showConversationList
    );
    const closeChat = useChatStore(
        (state) => state.closeChat
    );
    const setConversationMessages = useChatStore(
        (state) => state.setConversationMessages
    );
    const receiveMessage = useChatStore(
        (state) => state.receiveMessage
    );
    const onlineUserIds = usePresenceStore(
        (state) => state.onlineUserIds
    );

    const [isMinimized, setIsMinimized] =
        useState(false);
    const [isLoadingConversations, setIsLoadingConversations] =
        useState(false);
    const [isLoadingMessages, setIsLoadingMessages] =
        useState(false);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paginationByConversation, setPaginationByConversation] =
        useState<Record<string, CursorPagination>>({});

    const activeConversation = useMemo(
        () =>
            conversations.find(
                (conversation) =>
                    conversation.id === activeConversationId
            ) ?? null,
        [activeConversationId, conversations]
    );

    const activeMessages = activeConversationId
        ? messagesByConversation[activeConversationId] ?? []
        : [];
    const activePagination = activeConversationId
        ? paginationByConversation[activeConversationId] ??
          emptyPagination
        : emptyPagination;

    useEffect(() => {
        if (!isOpen || !currentUser) return;

        let isActive = true;
        setIsLoadingConversations(true);
        setError(null);

        getConversations({ limit: 50 })
            .then((result) => {
                if (!isActive) return;
                setConversations(result.conversations);
            })
            .catch((loadError) => {
                console.error(
                    "Không thể tải danh sách trò chuyện:",
                    loadError
                );
                if (isActive) {
                    setError(
                        "Không thể tải danh sách trò chuyện."
                    );
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoadingConversations(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [isOpen, currentUser, setConversations]);

    const loadMessages = async (
        conversationId: string,
        cursor?: string
    ) => {
        cursor
            ? setIsLoadingMore(true)
            : setIsLoadingMessages(true);
        setError(null);

        try {
            const result = await getConversationMessages(
                conversationId,
                {
                    cursor,
                    limit: 30,
                }
            );

            setConversationMessages(
                conversationId,
                result.messages
            );
            setPaginationByConversation((current) => ({
                ...current,
                [conversationId]: result.pagination,
            }));
        } catch (loadError) {
            console.error(
                "Không thể tải tin nhắn:",
                loadError
            );
            setError("Không thể tải lịch sử tin nhắn.");
        } finally {
            setIsLoadingMessages(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (
            !isOpen ||
            showConversationList ||
            !activeConversationId ||
            messagesByConversation[activeConversationId]
        ) {
            return;
        }

        void loadMessages(activeConversationId);
    }, [
        activeConversationId,
        isOpen,
        messagesByConversation,
        showConversationList,
    ]);

    const handleSelectConversation = (
        conversationId: string
    ) => {
        openConversation(conversationId);
        setIsMinimized(false);
    };

    const handleLoadMore = async () => {
        if (
            !activeConversationId ||
            !activePagination.nextCursor
        ) {
            return;
        }

        await loadMessages(
            activeConversationId,
            activePagination.nextCursor
        );
    };

    const handleSend = async (content: string) => {
        if (!activeConversationId) return;

        setIsSending(true);
        setError(null);

        try {
            const message = await sendTextMessage(
                activeConversationId,
                content
            );

            // Socket cũng trả về message này; store chống trùng bằng id.
            receiveMessage(message);
        } catch (sendError) {
            console.error("Không thể gửi tin nhắn:", sendError);
            setError("Không thể gửi tin nhắn. Hãy thử lại.");
            throw sendError;
        } finally {
            setIsSending(false);
        }
    };

    if (!currentUser) {
        return null;
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                aria-label="Mở tin nhắn"
                onClick={openConversationList}
                className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:bg-indigo-700"
            >
                <MessageCircle className="h-6 w-6" />
            </button>
        );
    }

    return (
        <section className="fixed bottom-4 right-4 z-50 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(25,25,45,0.22)]">
            {showConversationList || !activeConversation ? (
                <>
                    <header className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
                        <div>
                            <h2 className="font-bold text-[#131b2e]">
                                Tin nhắn
                            </h2>
                            <p className="text-xs text-slate-400">
                                {conversations.length} cuộc trò chuyện
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Đóng"
                            onClick={closeChat}
                            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </header>

                    <div className="h-[438px] overflow-y-auto bg-[#faf8ff] p-2">
                        {isLoadingConversations ? (
                            <p className="grid h-full place-items-center text-sm text-slate-400">
                                Đang tải cuộc trò chuyện...
                            </p>
                        ) : conversations.length === 0 ? (
                            <p className="grid h-full place-items-center px-8 text-center text-sm text-slate-400">
                                Bạn chưa có cuộc trò chuyện nào.
                            </p>
                        ) : (
                            conversations.map((conversation) => {
                                const name = getConversationName(
                                    conversation,
                                    currentUser.id
                                );
                                const avatar = getConversationAvatar(
                                    conversation,
                                    currentUser.id
                                );
                                const otherUser =
                                    getOtherConversationUser(
                                        conversation,
                                        currentUser.id
                                    );
                                const isOnline = otherUser
                                    ? onlineUserIds.has(
                                          otherUser.id
                                      )
                                    : false;
                                const latestMessage =
                                    latestMessages[
                                        conversation.id
                                    ] ?? conversation.messages[0];

                                return (
                                    <button
                                        key={conversation.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectConversation(
                                                conversation.id
                                            )
                                        }
                                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white"
                                    >
                                        <div className="relative shrink-0">
                                            {avatar ? (
                                                <img
                                                    src={avatar}
                                                    alt={name}
                                                    className="h-11 w-11 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8e9ff] text-xs font-bold text-[#4648d4]">
                                                    {getNameInitials(
                                                        name
                                                    )}
                                                </span>
                                            )}
                                            {conversation.type ===
                                                "direct" && (
                                                <span
                                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                                        isOnline
                                                            ? "bg-cyan-400"
                                                            : "bg-slate-300"
                                                    }`}
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-semibold text-[#131b2e]">
                                                    {name}
                                                </p>
                                                {latestMessage && (
                                                    <span className="shrink-0 text-[10px] text-slate-400">
                                                        {formatConversationTime(
                                                            latestMessage.created_at
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="truncate text-xs text-slate-400">
                                                {latestMessage?.content ??
                                                    "Chưa có tin nhắn"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </>
            ) : (
                <>
                    <ChatHeader
                        conversation={activeConversation}
                        currentUserId={currentUser.id}
                        isMinimized={isMinimized}
                        onBack={() =>
                            showConversationListView()
                        }
                        onToggleMinimize={() =>
                            setIsMinimized((current) => !current)
                        }
                        onClose={closeChat}
                    />

                    {!isMinimized && (
                        <>
                            {error && (
                                <p className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-600">
                                    {error}
                                </p>
                            )}
                            <MessageList
                                messages={activeMessages}
                                currentUserId={currentUser.id}
                                hasNextPage={
                                    activePagination.hasNextPage
                                }
                                isLoading={isLoadingMessages}
                                isLoadingMore={isLoadingMore}
                                onLoadMore={() =>
                                    void handleLoadMore()
                                }
                            />
                            <MessageInput
                                onSend={handleSend}
                                isSending={isSending}
                            />
                        </>
                    )}
                </>
            )}

            {showConversationList && error && (
                <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-600">
                    {error}
                </p>
            )}
        </section>
    );
}
