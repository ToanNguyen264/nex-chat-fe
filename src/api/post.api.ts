import api from "./axios";

export type ReactionType =
    | "like"
    | "love"
    | "haha"
    | "wow"
    | "sad"
    | "angry";

export type ReactionSummaryItem = {
    reactionType: ReactionType;
    count: number;
};

export type PostPrivacy =
    | "public"
    | "friends"
    | "private";

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
    privacy: PostPrivacy;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: PostAuthorFromApi;
    attachments: AttachmentFromApi[];
    tags?: string[];
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
    privacy: PostPrivacy;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: PostAuthorFromApi;
    attachments: AttachmentFromApi[];
    currentReaction: ReactionType | null;
    reactionCount: number;
    reactionSummary: ReactionSummaryItem[];
    commentCount: number;
    tags?: string[];
};

export type SetPostReactionResult = {
    currentReaction: ReactionType | null;
    reactionCount: number;
    reactionSummary: ReactionSummaryItem[];
};

export type UpdatedPost = {
    id: string;
    content: string | null;
    privacy: PostPrivacy;
    updated_at: string;
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
    pagination: PostPagination;
};

export type PostPagination = {
    nextCursor: string | null;
    hasNextPage: boolean;
};

export type PaginatedPosts = {
    posts: PostFromApi[];
    pagination: PostPagination;
};

type GetPostsOptions = {
    cursor?: string | null;
    limit?: number;
};

const getPostListParams = ({
    cursor,
    limit = 10,
}: GetPostsOptions) => ({
    ...(cursor ? { cursor } : {}),
    limit,
});

export const getPosts = async (
    options: GetPostsOptions = {}
): Promise<PaginatedPosts> => {
    const response = await api.get<GetPostsResponse>("/posts", {
        params: getPostListParams(options),
    });

    return {
        posts: response.data.data,
        pagination: response.data.pagination,
    };
};

export const getUserPosts = async (
    userId: string,
    options: GetPostsOptions = {}
): Promise<PaginatedPosts> => {
    const response = await api.get<GetPostsResponse>(
        `/posts/users/${userId}`,
        {
            params: getPostListParams(options),
        }
    );

    return {
        posts: response.data.data,
        pagination: response.data.pagination,
    };
};


export const createPost = async (
    content: string,
    media: File[] = [],
    privacy: PostPrivacy = "public"
): Promise<CreatedPost> => {
    const formData = new FormData();

    formData.append("content", content);
    formData.append("privacy", privacy);

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

export const updatePost = async (
    postId: number,
    content: string,
    privacy: PostPrivacy
): Promise<UpdatedPost> => {
    const response = await api.patch<{
        success: boolean;
        message: string;
        data: UpdatedPost;
    }>(`/posts/${postId}`, {
        content,
        privacy,
    });

    return response.data.data;
};

export const setPostReaction = async (
    postId: number,
    reactionType: ReactionType | null
): Promise<SetPostReactionResult> => {
    const response = await api.post<{
        success: boolean;
        data: SetPostReactionResult;
    }>(`/posts/${postId}/reaction`, {
        reactionType,
    });

    return response.data.data;
};
