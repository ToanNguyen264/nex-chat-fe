import api from "./axios";

export type CurrentUser = {
    id: string;
    email: string;
    status: "active" | "inactive" | "blocked";
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
};

export type UserProfile = {
    id: string;
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    display_name: string;
    cover_image: string | null;
    bio: string | null;
    birthday: string | null;
    workplace: string | null;
    education: string | null;
    location: string | null;
    website: string | null;
    friend_count: number;
    follower_count: number;
    following_count: number;
    post_count: number;
    created_at: string;
};

export type UpdateMyProfileInput = {
    displayName: string;
    bio: string | null;
    birthday: string | null;
    workplace: string | null;
    education: string | null;
    location: string | null;
    website: string | null;
};

export type UpdatedProfile = {
    id: string;
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    cover_image: string | null;
    bio: string | null;
    birthday: string | null;
    workplace: string | null;
    education: string | null;
    location: string | null;
    website: string | null;
    created_at: string;
    updated_at: string;
};

type GetCurrentUserResponse = {
    success: boolean;
    data: CurrentUser;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
    const response = await api.get<GetCurrentUserResponse>("/users/me");

    return response.data.data;
};

export const getUserProfile = async (
    userId: string
): Promise<UserProfile> => {
    const response = await api.get<{
        success: boolean;
        data: UserProfile;
    }>(`/users/${userId}/profile`);

    return response.data.data;
};

export const updateMyProfile = async (
    data: UpdateMyProfileInput
): Promise<UpdatedProfile> => {
    const response = await api.patch<{
        success: boolean;
        message: string;
        data: UpdatedProfile;
    }>("/users/me/profile", data);

    return response.data.data;
};

type UpdatedProfileImageResponse = {
    success: boolean;
    message: string;
    data: {
        imageUrl: string;
    };
};

export const updateMyAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.patch<UpdatedProfileImageResponse>(
        "/users/me/avatar",
        formData
    );

    return response.data.data.imageUrl;
};

export const updateMyCoverImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("coverImage", file);

    const response = await api.patch<UpdatedProfileImageResponse>(
        "/users/me/cover-image",
        formData
    );

    return response.data.data.imageUrl;
};
