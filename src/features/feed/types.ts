import type {
    PostPrivacy,
    ReactionType,
    ReactionSummaryItem,
} from "../../api/post.api";

/* cấu trúc dữ liệu cho một bài viết */
export type Post = {
    id: number;
    userId: string;
    privacy: PostPrivacy;
    author: string;
    content: string;
    createdAt: string;
    currentReaction: ReactionType | null;
    reactionCount: number;
    reactionSummary: ReactionSummaryItem[];
    avatar?: string;
    images?: string[];
    videos?: string[];
    tags?: string[];
    commentCount?: number;
    shareCount?: number;
    isVerified?: boolean;
};
