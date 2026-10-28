import type React from "react";
import PostCard from "./PostCard";
import type { Post } from "../types";
import type {
    PostPrivacy,
    ReactionType,
} from "../../../api/post.api";

type PostListProps = {
    posts: Post[];
    currentUserId: string | null;
    onReact: (
        postId: number,
        reactionType: ReactionType
    ) => Promise<void>;
    onEditPost: (
        postId: number,
        content: string,
        privacy: PostPrivacy
    ) => Promise<void>;
    onDeletePost: (postId: number) => Promise<void>;
    sentinelRef?: React.RefObject<HTMLDivElement | null>;
    hasNextPage?: boolean;
};

export default function PostList({
    posts,
    currentUserId,
    onReact,
    onEditPost,
    onDeletePost,
    sentinelRef,
    hasNextPage,
}: PostListProps) {
    if (posts.length === 0) {
        return (
            <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500">
                Chưa có bài viết nào.
            </p>
        );
    }

    // Kích hoạt nạp thêm bài viết trước 2 bài cuối cùng
    const triggerIndex = Math.max(posts.length - 2, 0);

    return (
        <section className="flex flex-col gap-4">
            {posts.map((post, index) => (
                <div key={post.id} className="flex flex-col gap-4">
                    {index === triggerIndex && hasNextPage && (
                        <div
                            ref={sentinelRef}
                            className="h-px w-full pointer-events-none opacity-0"
                            aria-hidden="true"
                        />
                    )}

                    <PostCard
                        post={post}
                        currentUserId={currentUserId}
                        onReact={onReact}
                        onEditPost={onEditPost}
                        onDeletePost={onDeletePost}
                    />
                </div>
            ))}
        </section>
    );
}
