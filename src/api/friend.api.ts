import api from "./axios";

export type FriendshipStatus =
    | "pending"
    | "accepted"
    | "rejected"
    | "blocked";

export type Friendship = {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: FriendshipStatus;
    blocked_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type FriendUser = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
};

export type FriendListItem = {
    friendship_id: string;
    friends_since: string;
    friend: FriendUser;
};

type GetRelationshipResponse = {
    success: boolean;
    data: Friendship | null;
};

type FriendshipResponse = {
    success: boolean;
    message: string;
    data: Friendship;
};

type FriendActionResponse = {
    success: boolean;
    message: string;
};

type FriendListResponse = {
    success: boolean;
    data: FriendListItem[];
};

export const getRelationshipWithUser = async (
    otherUserId: string
): Promise<Friendship | null> => {
    const response =
        await api.get<GetRelationshipResponse>(
            `/friends/relationship/${otherUserId}`
        );

    return response.data.data;
};

export const sendFriendRequest = async (
    addresseeId: string
): Promise<Friendship> => {
    const response =
        await api.post<FriendshipResponse>(
            `/friends/requests/${addresseeId}`
        );

    return response.data.data;
};

export const acceptFriendRequest = async (
    friendshipId: string
): Promise<Friendship> => {
    const response =
        await api.patch<FriendshipResponse>(
            `/friends/requests/${friendshipId}/accept`
        );

    return response.data.data;
};

export const rejectFriendRequest = async (
    friendshipId: string
): Promise<Friendship> => {
    const response =
        await api.patch<FriendshipResponse>(
            `/friends/requests/${friendshipId}/reject`
        );

    return response.data.data;
};

export const cancelFriendRequest = async (
    friendshipId: string
): Promise<void> => {
    await api.delete<FriendActionResponse>(
        `/friends/requests/${friendshipId}`
    );
};

export const removeFriend = async (
    friendshipId: string
): Promise<void> => {
    await api.delete<FriendActionResponse>(
        `/friends/${friendshipId}`
    );
};

export const getFriends = async (): Promise<
    FriendListItem[]
> => {
    const response =
        await api.get<FriendListResponse>(
            "/friends"
        );

    return response.data.data;
};
