export type ChatUser = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    last_seen_at?: string | null;
};

export type ChatAttachment = {
    id: string;
    owner_type: "message";
    owner_id: string;
    file_url: string;
    file_type: string | null;
    file_name: string | null;
    file_size: string | null;
    created_at: string;
};

export type MessageReactionType =
    | "like"
    | "love"
    | "haha"
    | "wow"
    | "sad"
    | "angry";

export type MessageReactionSummary = {
    type: MessageReactionType;
    count: number;
};

export type RepliedChatMessage = {
    id: string;
    sender_id: string | null;
    content: string | null;
    message_type: "text" | "image" | "file" | "system";
    deleted_at: string | null;
    users: ChatUser | null;
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
    attachments: ChatAttachment[];
    reply_to: RepliedChatMessage | null;
    reactionSummary: MessageReactionSummary[];
    reactionCount: number;
    currentReaction: MessageReactionType | null;
};

export type MessageReactionUpdate = {
    conversationId: string;
    messageId: string;
    reactionSummary: MessageReactionSummary[];
    reactionCount: number;
    currentReaction?: MessageReactionType | null;
};

export type RealtimeMessageReactionUpdate = MessageReactionUpdate & {
    actorUserId: string;
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
