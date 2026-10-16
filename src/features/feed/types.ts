/* cấu trúc dữ liệu cho một bài viết */
export type Post = {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    isLiked: boolean;
    likeCount: number;
};