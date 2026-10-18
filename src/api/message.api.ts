import api from "./axios";

import type {
    CursorPagination,
    MessageReactionType,
    MessageReactionUpdate,
    RealtimeChatMessage,
} from "../features/chat/types";

type MessageListResponse = {
    success: boolean;
    data: RealtimeChatMessage[];
    pagination: CursorPagination;
};

type SendMessageResponse = {
    success: boolean;
    message: string;
    data: RealtimeChatMessage;
};

type MessageReactionResponse = {
    success: boolean;
    message: string;
    data: MessageReactionUpdate;
};

export const getConversationMessages = async (
    conversationId: string,
    options?: {
        cursor?: string;
        limit?: number;
    }
) => {
    const response = await api.get<MessageListResponse>(
        `/conversations/${conversationId}/messages`,
        {
            params: options,
        }
    );

    return {
        messages: response.data.data,
        pagination: response.data.pagination,
    };
};

export const sendTextMessage = async (
    conversationId: string,
    content: string,
    replyToMessageId?: string
): Promise<RealtimeChatMessage> => {
    const response = await api.post<SendMessageResponse>(
        `/conversations/${conversationId}/messages`,
        {
            content,
            replyToMessageId: replyToMessageId ?? null,
        }
    );

    return response.data.data;
};

export const sendMediaMessage = async (
    conversationId: string,
    file: File,
    content?: string,
    replyToMessageId?: string
): Promise<RealtimeChatMessage> => {
    const formData = new FormData();
    formData.append("media", file);

    if (content?.trim()) {
        formData.append("content", content.trim());
    }

    if (replyToMessageId) {
        formData.append("replyToMessageId", replyToMessageId);
    }

    const response = await api.post<SendMessageResponse>(
        `/conversations/${conversationId}/messages/media`,
        formData
    );

    return response.data.data;
};

export const setMessageReaction = async (
    conversationId: string,
    messageId: string,
    reactionType: MessageReactionType
): Promise<MessageReactionUpdate> => {
    const response = await api.put<MessageReactionResponse>(
        `/conversations/${conversationId}/messages/${messageId}/reaction`,
        { reactionType }
    );

    return response.data.data;
};
