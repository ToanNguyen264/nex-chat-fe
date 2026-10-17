import PostCard from "./PostCard";
import type { Post } from "../types";
import type { ReactionType } from "../../../api/post.api";

type PostListProps = {
    posts: Post[];
    onReact: (
        postId: number,
        reactionType: ReactionType
    ) => Promise<void>;
    onDeletePost: (postId: number) => Promise<void>;
};

export default function PostList({
    posts,
    onReact,
    onDeletePost,
}: PostListProps) {
    if (posts.length === 0) {
        return (
            <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500">
                Chưa có bài viết nào.
            </p>
        );
    }

    return (
        <section className="flex flex-col gap-4">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onReact={onReact}
                    onDeletePost={onDeletePost}
                />
            ))}
        </section>
    );
}
