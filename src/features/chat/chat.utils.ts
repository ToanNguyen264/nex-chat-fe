import type {
    ChatConversation,
    ChatUser,
} from "./types";

export const getChatUserName = (user: ChatUser) => {
    const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ");

    return fullName || user.user_name || "Người dùng";
};

export const getOtherConversationUser = (
    conversation: ChatConversation,
    currentUserId: string
) =>
    conversation.conversation_members.find(
        (member) => member.user_id !== currentUserId
    )?.users ?? null;

export const getConversationName = (
    conversation: ChatConversation,
    currentUserId: string
) => {
    if (conversation.type === "group") {
        return conversation.name || "Nhóm trò chuyện";
    }

    const otherUser = getOtherConversationUser(
        conversation,
        currentUserId
    );

    return otherUser
        ? getChatUserName(otherUser)
        : "Cuộc trò chuyện";
};

export const getConversationAvatar = (
    conversation: ChatConversation,
    currentUserId: string
) => {
    if (conversation.type === "group") {
        return conversation.avatar_url;
    }

    return (
        getOtherConversationUser(
            conversation,
            currentUserId
        )?.avatar ?? null
    );
};
