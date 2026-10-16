/* cấu trúc dữ liệu cho một bài viết */
export type Post = {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    isLiked: boolean;
    likeCount: number;
    avatar?: string;
    image?: string;
    tags?: string[];
    commentCount?: number;
    shareCount?: number;
    isVerified?: boolean;
};
