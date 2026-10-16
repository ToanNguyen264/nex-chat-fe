import { useEffect, useRef, useState } from "react";
import {
    BadgeCheck,
    Globe2,
    Heart,
    Images,
    MessageCircle,
    MoreHorizontal,
    Share2,
    Trash2,
} from "lucide-react";

import type { Post } from "../types";

type PostCardProps = {
    post: Post;
    onToggleLike: (postId: number) => void;
    onDeletePost: (postId: number) => Promise<void>;
};

export default function PostCard({
    post,
    onToggleLike,
    onDeletePost,
}: PostCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                event.target instanceof Node &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen]);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa bài viết này không?"
        );

        if (!confirmed || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            await onDeletePost(post.id);
        } catch {
            window.alert("Không thể xóa bài viết này.");
            setIsDeleting(false);
        }
    }

    return (
        <article className="rounded-2xl bg-white p-5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {post.avatar ? (
                        <span className="relative shrink-0">
                            <img src={post.avatar} alt={post.author} className="h-11 w-11 rounded-full object-cover" />
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#57dffe]" />
                        </span>
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">{post.author.charAt(0)}</div>
                    )}

                    <div>
                        <h2 className="flex items-center gap-1 text-lg font-bold tracking-[-0.18px] text-[#131b2e]">
                            {post.author}
                            {post.isVerified && <BadgeCheck className="h-4 w-4 fill-[#4648d4] text-white" />}
                        </h2>

                        <p className="flex items-center gap-1.5 text-[11px] text-[#767586]">
                            {post.createdAt} <span>•</span> <Globe2 className="h-3 w-3" /> Công khai
                        </p>
                    </div>
                </div>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        aria-label="Tùy chọn bài viết"
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        disabled={isDeleting}
                        onClick={() => setIsMenuOpen((current) => !current)}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
                        >
                            <button
                                type="button"
                                role="menuitem"
                                disabled={isDeleting}
                                onClick={() => void handleDelete()}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[25px] text-[#131b2e]">
                {post.content}
            </p>

            {post.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => <span key={tag} className="rounded-full bg-[#eaedff] px-2.5 py-1 text-[11px] font-semibold text-[#4648d4]">{tag}</span>)}
                </div>
            )}

            {post.image && (
                <div className="relative mt-4 overflow-hidden rounded-xl bg-[#eaedff] shadow-sm">
                    <img src={post.image} alt="Giao diện Pulse Messenger" className="h-auto w-full object-cover" />
                    <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#283044]/80 px-3 py-1 text-[11px] text-[#eef0ff] backdrop-blur-md"><Images className="h-3.5 w-3.5" />1/3 hình ảnh</span>
                </div>
            )}

            <div className="mt-4 flex items-center justify-between text-[11px] text-[#767586]">
                <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#b90538] text-white">♥</span>
                    <span>Trần Hoàng Long và {post.likeCount} người khác</span>
                </div>
                <div className="flex gap-3"><span>{post.commentCount ?? 0} bình luận</span><span>{post.shareCount ?? 0} lượt chia sẻ</span></div>
            </div>

            <footer className="mt-3 grid grid-cols-3 rounded-xl bg-[#f2f3ff]/50 p-1.5">
                <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold hover:bg-white ${
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
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-[#464554] hover:bg-white"
                >
                    <MessageCircle className="h-4 w-4" />
                    Bình luận
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-[#464554] hover:bg-white"
                >
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                </button>
            </footer>
        </article>
    );
}
