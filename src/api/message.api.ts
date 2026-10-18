import api from "./axios";

import type {
    CursorPagination,
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
