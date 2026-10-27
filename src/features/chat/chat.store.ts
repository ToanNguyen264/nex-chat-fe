import { create } from "zustand";

import type {
    ChatConversation,
    MessageReactionUpdate,
    RealtimeChatMessage,
} from "./types";

type ChatState = {
    isChatOpen: boolean;
    hasUnreadMessage: boolean;
    isConversationListVisible: boolean;
    conversations: ChatConversation[];
    activeConversationId: string | null;
    messagesByConversation: Record<
        string,
        RealtimeChatMessage[]
    >;
    latestMessageByConversation: Record<
        string,
        RealtimeChatMessage
    >;
    readMessageIdsByConversation: Record<string, string>;
};

type ChatActions = {
    openConversationList: () => void;
    openConversation: (conversationId: string) => void;
    showConversationList: () => void;
    closeChat: () => void;
    setConversations: (
        conversations: ChatConversation[]
    ) => void;
    upsertConversation: (
        conversation: ChatConversation
    ) => void;
    setActiveConversation: (
        conversationId: string | null
    ) => void;
    receiveMessage: (message: RealtimeChatMessage) => void;
    updateMessageReaction: (
        update: MessageReactionUpdate
    ) => void;
    setConversationMessages: (
        conversationId: string,
        messages: RealtimeChatMessage[]
    ) => void;
    markConversationAsRead: (
        conversationId: string,
        messageId?: string
    ) => void;
    resetChat: () => void;
};

type ChatStore = ChatState & ChatActions;

const sortMessages = (
    messages: RealtimeChatMessage[]
) =>
    [...messages].sort((firstMessage, secondMessage) => {
        const firstId = BigInt(firstMessage.id);
        const secondId = BigInt(secondMessage.id);

        if (firstId === secondId) return 0;
        return firstId < secondId ? -1 : 1;
    });

const mergeMessages = (
    currentMessages: RealtimeChatMessage[],
    incomingMessages: RealtimeChatMessage[]
) => {
    const messagesById = new Map(
        currentMessages.map((message) => [
            message.id,
            message,
        ])
    );

    for (const message of incomingMessages) {
        messagesById.set(message.id, message);
    }

    return sortMessages(Array.from(messagesById.values()));
};

const sortConversations = (
    conversations: ChatConversation[]
) =>
    [...conversations].sort(
        (firstConversation, secondConversation) =>
            new Date(secondConversation.updated_at).getTime() -
            new Date(firstConversation.updated_at).getTime()
    );

const applyReactionToMessage = (
    message: RealtimeChatMessage,
    update: MessageReactionUpdate
) => {
    if (message.id !== update.messageId) return message;

    const hasCurrentReaction = Object.prototype.hasOwnProperty.call(
        update,
        "currentReaction"
    );

    return {
        ...message,
        reactionSummary: update.reactionSummary,
        reactionCount: update.reactionCount,
        ...(hasCurrentReaction
            ? {
                  currentReaction:
                      update.currentReaction ?? null,
              }
            : {}),
    };
};

const getStoredReadMessageIds = (): Record<string, string> => {
    try {
        const raw = localStorage.getItem("chat_read_message_ids");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const saveStoredReadMessageIds = (map: Record<string, string>) => {
    try {
        localStorage.setItem("chat_read_message_ids", JSON.stringify(map));
    } catch {
        // ignore
    }
};

export const useChatStore = create<ChatStore>()(
    (set) => ({
        isChatOpen: false,
        hasUnreadMessage: false,
        isConversationListVisible: true,
        conversations: [],
        activeConversationId: null,
        messagesByConversation: {},
        latestMessageByConversation: {},
        readMessageIdsByConversation: getStoredReadMessageIds(),

        openConversationList: () => {
            set({
                isChatOpen: true,
                hasUnreadMessage: false,
                isConversationListVisible: true,
            });
        },

        openConversation: (conversationId) => {
            set((state) => {
                const latest =
                    state.latestMessageByConversation[conversationId] ??
                    state.conversations.find((c) => c.id === conversationId)?.messages[0];
                const updated = latest
                    ? {
                          ...state.readMessageIdsByConversation,
                          [conversationId]: latest.id,
                      }
                    : state.readMessageIdsByConversation;

                if (latest) {
                    saveStoredReadMessageIds(updated);
                }

                return {
                    isChatOpen: true,
                    hasUnreadMessage: false,
                    isConversationListVisible: false,
                    activeConversationId: conversationId,
                    readMessageIdsByConversation: updated,
                };
            });
        },

        showConversationList: () => {
            set({
                isConversationListVisible: true,
            });
        },

        closeChat: () => {
            set({
                isChatOpen: false,
            });
        },

        markConversationAsRead: (conversationId, messageId) => {
            set((state) => {
                const targetMessageId =
                    messageId ||
                    state.latestMessageByConversation[conversationId]?.id ||
                    state.conversations.find((c) => c.id === conversationId)?.messages[0]?.id;
                if (!targetMessageId) return state;

                const updated = {
                    ...state.readMessageIdsByConversation,
                    [conversationId]: targetMessageId,
                };
                saveStoredReadMessageIds(updated);

                return {
                    readMessageIdsByConversation: updated,
                };
            });
        },

        setConversations: (conversations) => {
            set((state) => {
                const latestMessages = {
                    ...state.latestMessageByConversation,
                };

                for (const conversation of conversations) {
                    const latestMessage =
                        conversation.messages[0];

                    if (latestMessage) {
                        latestMessages[conversation.id] =
                            latestMessage;
                    }
                }

                return {
                    conversations:
                        sortConversations(conversations),
                    latestMessageByConversation:
                        latestMessages,
                };
            });
        },

        upsertConversation: (conversation) => {
            set((state) => ({
                conversations: sortConversations([
                    conversation,
                    ...state.conversations.filter(
                        (item) => item.id !== conversation.id
                    ),
                ]),
            }));
        },

        setActiveConversation: (conversationId) => {
            set({
                activeConversationId: conversationId,
            });
        },

        receiveMessage: (message) => {
            set((state) => {
                const conversationId =
                    message.conversation_id;
                const currentMessages =
                    state.messagesByConversation[
                        conversationId
                    ] ?? [];
                const messages = mergeMessages(
                    currentMessages,
                    [message]
                );
                const conversations =
                    state.conversations.map(
                        (conversation) =>
                            conversation.id === conversationId
                                ? {
                                      ...conversation,
                                      updated_at:
                                          message.created_at,
                                      messages: [message],
                                  }
                                : conversation
                    );

                const isCurrentlyActive =
                    state.isChatOpen &&
                    !state.isConversationListVisible &&
                    state.activeConversationId === conversationId;

                const updatedReadMap = isCurrentlyActive
                    ? {
                          ...state.readMessageIdsByConversation,
                          [conversationId]: message.id,
                      }
                    : state.readMessageIdsByConversation;

                if (isCurrentlyActive) {
                    saveStoredReadMessageIds(updatedReadMap);
                }

                return {
                    hasUnreadMessage:
                        state.hasUnreadMessage ||
                        !isCurrentlyActive,
                    conversations:
                        sortConversations(conversations),
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [conversationId]: messages,
                    },
                    latestMessageByConversation: {
                        ...state.latestMessageByConversation,
                        [conversationId]: message,
                    },
                    readMessageIdsByConversation: updatedReadMap,
                };
            });
        },

        updateMessageReaction: (update) => {
            set((state) => {
                const currentMessages =
                    state.messagesByConversation[
                        update.conversationId
                    ] ?? [];
                const latestMessage =
                    state.latestMessageByConversation[
                        update.conversationId
                    ];

                return {
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [update.conversationId]:
                            currentMessages.map((message) =>
                                applyReactionToMessage(
                                    message,
                                    update
                                )
                            ),
                    },
                    latestMessageByConversation: latestMessage
                        ? {
                              ...state.latestMessageByConversation,
                              [update.conversationId]:
                                  applyReactionToMessage(
                                      latestMessage,
                                      update
                                  ),
                          }
                        : state.latestMessageByConversation,
                    conversations: state.conversations.map(
                        (conversation) =>
                            conversation.id ===
                            update.conversationId
                                ? {
                                      ...conversation,
                                      messages:
                                          conversation.messages.map(
                                              (message) =>
                                                  applyReactionToMessage(
                                                      message,
                                                      update
                                                  )
                                          ),
                                  }
                                : conversation
                    ),
                };
            });
        },

        setConversationMessages: (
            conversationId,
            incomingMessages
        ) => {
            set((state) => {
                const currentMessages =
                    state.messagesByConversation[
                        conversationId
                    ] ?? [];
                const messages = mergeMessages(
                    currentMessages,
                    incomingMessages
                );
                const latestMessage =
                    messages[messages.length - 1];

                return {
                    messagesByConversation: {
                        ...state.messagesByConversation,
                        [conversationId]: messages,
                    },
                    latestMessageByConversation:
                        latestMessage
                            ? {
                                  ...state.latestMessageByConversation,
                                  [conversationId]: latestMessage,
                              }
                            : state.latestMessageByConversation,
                };
            });
        },

        resetChat: () => {
            set({
                isChatOpen: false,
                hasUnreadMessage: false,
                isConversationListVisible: true,
                conversations: [],
                activeConversationId: null,
                messagesByConversation: {},
                latestMessageByConversation: {},
            });
        },
    })
);
