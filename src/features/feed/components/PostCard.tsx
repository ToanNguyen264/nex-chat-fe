import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Share2,
} from "lucide-react";

import type { Post } from "../types";

type PostCardProps = {
    post: Post;
    onToggleLike: (postId: number) => void;
};

export default function PostCard({
    post,
    onToggleLike,
}: PostCardProps) {
    return (
        <article className="rounded-2xl bg-white p-5 shadow-sm">
            <header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {post.author.charAt(0)}
                    </div>

                    <div>
                        <h2 className="font-semibold text-[#131b2e]">
                            {post.author}
                        </h2>

                        <p className="text-xs text-[#767586]">
                            {post.createdAt} · Công khai
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label="Tùy chọn bài viết"
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </header>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#131b2e]">
                {post.content}
            </p>

            <div className="mt-4 text-xs text-slate-500">
                {post.likeCount} lượt thích
            </div>

            <footer className="mt-5 grid grid-cols-3 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm hover:bg-slate-50 ${
                        post.isLiked
                            ? "font-semibold text-rose-600"
                            : "text-slate-600"
                    }`}
                >
                    <Heart
                        className={`h-4 w-4 ${
                            post.isLiked ? "fill-current" : ""
                        }`}
                    />
                    {post.isLiked ? "Đã thích" : "Thích"}
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <MessageCircle className="h-4 w-4" />
                    Bình luận
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                </button>
            </footer>
        </article>
    );
}
