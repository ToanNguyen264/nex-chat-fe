import api from "./axios";

import type {
    ChatConversation,
    CursorPagination,
} from "../features/chat/types";

type ConversationListResponse = {
    success: boolean;
    data: ChatConversation[];
    pagination: CursorPagination;
};

type DirectConversationResponse = {
    success: boolean;
    created: boolean;
    message: string;
    data: Omit<ChatConversation, "messages">;
};

export const getConversations = async (options?: {
    cursor?: string;
    limit?: number;
}) => {
    const response = await api.get<ConversationListResponse>(
        "/conversations",
        {
            params: options,
        }
    );

    return {
        conversations: response.data.data,
        pagination: response.data.pagination,
    };
};

export const getOrCreateDirectConversation = async (
    otherUserId: string
): Promise<ChatConversation> => {
    const response =
        await api.post<DirectConversationResponse>(
            `/conversations/direct/${otherUserId}`
        );

    return {
        ...response.data.data,
        messages: [],
    };
};
