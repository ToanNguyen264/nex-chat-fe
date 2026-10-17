import api from "./axios";

export type CommentAuthorFromApi = {
    first_name: string | null;
    last_name: string | null;
    user_name: string | null;
    avatar: string | null;
};

export type CommentFromApi = {
    id: string;
    post_id: string;
    user_id: string;
    parent_comment_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: CommentAuthorFromApi;
};

type CommentsResponse = {
    success: boolean;
    data: CommentFromApi[];
};

type CreateCommentResponse = {
    success: boolean;
    message: string;
    data: CommentFromApi;
};

export const getPostComments = async (
    postId: number
): Promise<CommentFromApi[]> => {
    const response = await api.get<CommentsResponse>(
        `/posts/${postId}/comments`
    );

    return response.data.data;
};

export const createPostComment = async (
    postId: number,
    content: string
): Promise<CommentFromApi> => {
    const response = await api.post<CreateCommentResponse>(
        `/posts/${postId}/comments`,
        { content }
    );

    return response.data.data;
};
