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
    last_seen_at?: string | null;
};

export type FriendListItem = {
    friendship_id: string;
    friends_since: string;
    friend: FriendUser;
};

export type IncomingFriendRequest = {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: "pending";
    created_at: string;
    requester: FriendUser;
};

export type FriendSuggestion = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    profiles: {
        display_name: string;
        avatar_url: string | null;
        workplace: string | null;
        education: string | null;
        location: string | null;
    } | null;
    matchScore: number;
    matchReasons: string[];
    mutualFriendCount: number;
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

type FriendSuggestionsResponse = {
    success: boolean;
    data: FriendSuggestion[];
};

type IncomingFriendRequestsResponse = {
    success: boolean;
    data: IncomingFriendRequest[];
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

export const getFriendSuggestions = async (
    limit = 20
): Promise<FriendSuggestion[]> => {
    const response =
        await api.get<FriendSuggestionsResponse>(
            "/friends/suggestions",
            {
                params: {
                    limit,
                },
            }
        );

    return response.data.data;
};

export const getIncomingFriendRequests = async (): Promise<
    IncomingFriendRequest[]
> => {
    const response =
        await api.get<IncomingFriendRequestsResponse>(
            "/friends/requests/incoming"
        );

    return response.data.data;
};
