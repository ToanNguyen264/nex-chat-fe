import api from "./axios";

export type ReactionType =
    | "like"
    | "love"
    | "haha"
    | "wow"
    | "sad"
    | "angry";

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
    attachments: AttachmentFromApi[];
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
    attachments: AttachmentFromApi[];
    currentReaction: ReactionType | null;
    reactionCount: number;
    commentCount: number;
};

export type SetPostReactionResult = {
    currentReaction: ReactionType | null;
    reactionCount: number;
};

export type AttachmentFromApi = {
    id: string;
    owner_type: "post" | "comment" | "message";
    owner_id: string;
    file_url: string;
    file_type: string | null;
    file_name: string | null;
    file_size: string | null;
    created_at: string;
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
    content: string,
    media: File[] = []
): Promise<CreatedPost> => {
    const formData = new FormData();

    formData.append("content", content);

    media.forEach((file) => {
        formData.append("media", file);
    });

    const response = await api.post<CreatePostResponse>(
        "/posts",
        formData
    );

    return response.data.data;
};

export const deletePost = async (postId: number): Promise<void> => {
    await api.delete(`/posts/${postId}`);
};

export const setPostReaction = async (
    postId: number,
    reactionType: ReactionType
): Promise<SetPostReactionResult> => {
    const response = await api.post<{
        success: boolean;
        data: SetPostReactionResult;
    }>(`/posts/${postId}/reaction`, {
        reactionType,
    });

    return response.data.data;
};
