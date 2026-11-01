import api from "./axios";

export type FollowResponseData = {
    isFollowing: boolean;
    followerCount: number;
    followingCount: number;
};

export type FollowUserItem = {
    followId: string;
    followedAt: string;
    id: string;
    name: string;
    userName: string | null;
    avatar: string | null;
};

export type FollowListResponseData = {
    users: FollowUserItem[];
    nextCursor: string | null;
    hasNextPage: boolean;
};

export const followUser = async (
    targetUserId: string
): Promise<FollowResponseData> => {
    const response = await api.post<{
        success: boolean;
        data: FollowResponseData;
    }>(`/follows/${targetUserId}`);
    return response.data.data;
};

export const unfollowUser = async (
    targetUserId: string
): Promise<FollowResponseData> => {
    const response = await api.delete<{
        success: boolean;
        data: FollowResponseData;
    }>(`/follows/${targetUserId}`);
    return response.data.data;
};

export const getFollowStatus = async (
    targetUserId: string
): Promise<FollowResponseData> => {
    const response = await api.get<{
        success: boolean;
        data: FollowResponseData;
    }>(`/follows/${targetUserId}/status`);
    return response.data.data;
};

export const getFollowers = async (
    targetUserId: string,
    cursor?: string,
    limit: number = 20
): Promise<FollowListResponseData> => {
    const response = await api.get<{
        success: boolean;
        data: FollowListResponseData;
    }>(`/follows/${targetUserId}/followers`, {
        params: {
            ...(cursor ? { cursor } : {}),
            limit,
        },
    });
    return response.data.data;
};

export const getFollowing = async (
    targetUserId: string,
    cursor?: string,
    limit: number = 20
): Promise<FollowListResponseData> => {
    const response = await api.get<{
        success: boolean;
        data: FollowListResponseData;
    }>(`/follows/${targetUserId}/following`, {
        params: {
            ...(cursor ? { cursor } : {}),
            limit,
        },
    });
    return response.data.data;
};

