import api from "./axios";

export type PostAuthorFromApi = {
    first_name: string | null;
    last_name: string | null;
    user_name: string | null;
    avatar: string | null;
};


export type CreatedPost = {
    id: string;
    user_id: string;
    content: string;
    privacy: "public" | "friends" | "private";
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: PostAuthorFromApi;
};

type CreatePostResponse = {
    success: boolean;
    message: string;
    data: CreatedPost;
};

export type PostFromApi = {
    id: string;
    user_id: string;
    content: string | null;
    privacy: "public" | "friends" | "private";
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: PostAuthorFromApi;
};

type GetPostsResponse = {
    success: boolean;
    data: PostFromApi[];
};

export const getPosts = async (): Promise<PostFromApi[]> => {
    const response = await api.get<GetPostsResponse>("/posts");

    return response.data.data;
};


export const createPost = async (
    content: string
): Promise<CreatedPost> => {
    const response = await api.post<CreatePostResponse>(
        "/posts",
        { content }
    );

    return response.data.data;
};

export const deletePost = async (postId: number): Promise<void> => {
    await api.delete(`/posts/${postId}`);
};
