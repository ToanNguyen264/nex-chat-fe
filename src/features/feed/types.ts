import type { ReactionType } from "../../api/post.api";

/* cấu trúc dữ liệu cho một bài viết */
export type Post = {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    currentReaction: ReactionType | null;
    reactionCount: number;
    avatar?: string;
    images?: string[];
    videos?: string[];
    tags?: string[];
    commentCount?: number;
    shareCount?: number;
    isVerified?: boolean;
};
