export type ChatUser = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
};

export type RealtimeChatMessage = {
    id: string;
    conversation_id: string;
    sender_id: string | null;
    content: string | null;
    message_type: "text" | "image" | "file" | "system";
    reply_to_message_id: string | null;
    created_at: string;
    updated_at: string;
    users: ChatUser | null;
};

export type ConversationMember = {
    id: string;
    conversation_id: string;
    user_id: string;
    role: "member" | "admin";
    joined_at: string;
    left_at: string | null;
    users: ChatUser;
};

export type ChatConversation = {
    id: string;
    type: "direct" | "group";
    direct_key: string | null;
    name: string | null;
    avatar_url: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    conversation_members: ConversationMember[];
    messages: RealtimeChatMessage[];
};

export type CursorPagination = {
    nextCursor: string | null;
    hasNextPage: boolean;
};
