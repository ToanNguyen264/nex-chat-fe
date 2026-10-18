import { create } from "zustand";

import type {
    ChatConversation,
    MessageReactionUpdate,
    RealtimeChatMessage,
} from "./types";

type ChatState = {
    isChatOpen: boolean;
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

export const useChatStore = create<ChatStore>()(
    (set) => ({
        isChatOpen: false,
        isConversationListVisible: true,
        conversations: [],
        activeConversationId: null,
        messagesByConversation: {},
        latestMessageByConversation: {},

        openConversationList: () => {
            set({
                isChatOpen: true,
                isConversationListVisible: true,
            });
        },

        openConversation: (conversationId) => {
            set({
                isChatOpen: true,
                isConversationListVisible: false,
                activeConversationId: conversationId,
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

                return {
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
                isConversationListVisible: true,
                conversations: [],
                activeConversationId: null,
                messagesByConversation: {},
                latestMessageByConversation: {},
            });
        },
    })
);
