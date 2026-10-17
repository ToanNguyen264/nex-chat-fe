import { useEffect, useRef, useState } from "react";
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Globe2,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Share2,
    Trash2,
    X,
} from "lucide-react";
import {
    Emoji,
    EmojiStyle,
} from "emoji-picker-react";

import type { Post } from "../types";
import type { ReactionType } from "../../../api/post.api";
import CommentSection from "./CommentSection";

const reactionOptions: Array<{
    type: ReactionType;
    unified: string;
    label: string;
    textClass: string;
}> = [
    { type: "like", unified: "1f44d", label: "Thích", textClass: "text-blue-600" },
    { type: "love", unified: "2764-fe0f", label: "Yêu thích", textClass: "text-rose-600" },
    { type: "haha", unified: "1f602", label: "Haha", textClass: "text-amber-500" },
    { type: "wow", unified: "1f62e", label: "Wow", textClass: "text-amber-500" },
    { type: "sad", unified: "1f622", label: "Buồn", textClass: "text-amber-500" },
    { type: "angry", unified: "1f621", label: "Phẫn nộ", textClass: "text-orange-600" },
];

type PostCardProps = {
    post: Post;
    onReact: (
        postId: number,
        reactionType: ReactionType
    ) => Promise<void>;
    onDeletePost: (postId: number) => Promise<void>;
};

export default function PostCard({
    post,
    onReact,
    onDeletePost,
}: PostCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReactionToggling, setIsReactionToggling] = useState(false);
    const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(
        post.commentCount ?? 0
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const allImages = post.images ?? [];
    const allVideos = post.videos ?? [];
    const visibleImages = allImages.slice(0, 4);
    const remainingImageCount = Math.max(
        allImages.length - visibleImages.length,
        0
    );
    const selectedReaction = reactionOptions.find(
        (reaction) => reaction.type === post.currentReaction
    );
    const reactionCount = post.reactionCount ?? 0;

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

    useEffect(() => {
        setCommentCount(post.commentCount ?? 0);
    }, [post.commentCount]);

    useEffect(() => {
        if (selectedImageIndex === null) {
            return;
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setSelectedImageIndex(null);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [selectedImageIndex]);

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

    async function handleReaction(reactionType: ReactionType) {
        if (isReactionToggling) {
            return;
        }

        setIsReactionToggling(true);

        try {
            await onReact(post.id, reactionType);
            setIsReactionPickerOpen(false);
        } catch {
            window.alert("Không thể cập nhật cảm xúc.");
        } finally {
            setIsReactionToggling(false);
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

            <p className="emoji-text mt-4 whitespace-pre-wrap text-[15px] leading-[25px] text-[#131b2e]">
                {post.content}
            </p>

            {post.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => <span key={tag} className="rounded-full bg-[#eaedff] px-2.5 py-1 text-[11px] font-semibold text-[#4648d4]">{tag}</span>)}
                </div>
            )}

            {visibleImages.length > 0 && (
                <div
                    className={`relative mt-4 grid overflow-hidden rounded-xl bg-[#eaedff] shadow-sm ${
                        visibleImages.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2 gap-1"
                    }`}
                >
                    {visibleImages.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setSelectedImageIndex(index)}
                            className="relative cursor-pointer overflow-hidden"
                            aria-label={`Xem ảnh ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`Ảnh bài viết ${index + 1}`}
                                className={
                                    visibleImages.length === 1
                                        ? "max-h-[520px] w-full object-cover"
                                        : "h-56 w-full object-cover"
                                }
                            />

                            {index === 3 && remainingImageCount > 0 && (
                                <div className="absolute inset-0 grid place-items-center bg-black/60 text-4xl font-semibold text-white">
                                    +{remainingImageCount}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {allVideos.length > 0 && (
                <div className="relative mt-4 overflow-hidden rounded-xl bg-black shadow-sm">
                    <video
                        key={allVideos[selectedVideoIndex]}
                        src={allVideos[selectedVideoIndex]}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-h-[520px] w-full bg-black object-contain"
                    >
                        Trình duyệt của bạn không hỗ trợ phát video.
                    </video>

                    {allVideos.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Xem video trước"
                                onClick={() =>
                                    setSelectedVideoIndex((currentIndex) =>
                                        (currentIndex - 1 + allVideos.length) %
                                        allVideos.length
                                    )
                                }
                                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                                type="button"
                                aria-label="Xem video tiếp theo"
                                onClick={() =>
                                    setSelectedVideoIndex((currentIndex) =>
                                        (currentIndex + 1) % allVideos.length
                                    )
                                }
                                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                {selectedVideoIndex + 1}/{allVideos.length}
                            </span>
                        </>
                    )}
                </div>
            )}

            {selectedImageIndex !== null && allImages.length > 0 && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Xem ảnh bài viết"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <div
                        className="relative flex h-full w-full items-center justify-center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={allImages[selectedImageIndex]}
                            alt={`Ảnh bài viết ${selectedImageIndex + 1}`}
                            className="max-h-full max-w-full object-contain"
                        />

                        <button
                            type="button"
                            onClick={() => setSelectedImageIndex(null)}
                            aria-label="Đóng trình xem ảnh"
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {allImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Xem ảnh trước"
                                    onClick={() =>
                                        setSelectedImageIndex((currentIndex) =>
                                            currentIndex === null
                                                ? null
                                                : (currentIndex - 1 + allImages.length) % allImages.length
                                        )
                                    }
                                    className="absolute left-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                                >
                                    <ChevronLeft className="h-7 w-7" />
                                </button>

                                <button
                                    type="button"
                                    aria-label="Xem ảnh tiếp theo"
                                    onClick={() =>
                                        setSelectedImageIndex((currentIndex) =>
                                            currentIndex === null
                                                ? null
                                                : (currentIndex + 1) % allImages.length
                                        )
                                    }
                                    className="absolute right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                                >
                                    <ChevronRight className="h-7 w-7" />
                                </button>
                            </>
                        )}

                        <span className="absolute bottom-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                            {selectedImageIndex + 1}/{allImages.length}
                        </span>
                    </div>
                </div>
            )}

            <div className="mt-4 flex items-center justify-between text-[11px] text-[#767586]">
                {reactionCount > 0 ? (
                    <div className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center">
                            <Emoji
                                unified={selectedReaction?.unified ?? "1f44d"}
                                size={18}
                                emojiStyle={EmojiStyle.FACEBOOK}
                            />
                        </span>
                        <span>
                            {post.currentReaction && reactionCount === 1
                                ? "Bạn đã bày tỏ cảm xúc"
                                : post.currentReaction
                                  ? `Bạn và ${reactionCount - 1} người khác`
                                  : `${reactionCount} lượt bày tỏ cảm xúc`}
                        </span>
                    </div>
                ) : (
                    <span />
                )}
                <div className="flex gap-3"><span>{commentCount} bình luận</span><span>{post.shareCount ?? 0} lượt chia sẻ</span></div>
            </div>

            <footer className="mt-3 grid grid-cols-3 rounded-xl bg-[#f2f3ff]/50 p-1.5">
                <div
                    className="relative"
                    onMouseEnter={() => setIsReactionPickerOpen(true)}
                    onMouseLeave={() => setIsReactionPickerOpen(false)}
                >
                    {isReactionPickerOpen && (
                        <div className="absolute bottom-[calc(100%-2px)] left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-indigo-100 bg-white/95 px-2.5 py-2 shadow-[0_12px_35px_rgba(40,48,68,0.2)] backdrop-blur-md">
                            {reactionOptions.map((reaction) => (
                                <button
                                    key={reaction.type}
                                    type="button"
                                    aria-label={reaction.label}
                                    disabled={isReactionToggling}
                                    onClick={() =>
                                        void handleReaction(reaction.type)
                                    }
                                    className="group relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition duration-150 hover:-translate-y-1 hover:scale-125 hover:bg-indigo-50 disabled:opacity-50"
                                >
                                    <Emoji
                                        unified={reaction.unified}
                                        size={30}
                                        emojiStyle={EmojiStyle.FACEBOOK}
                                    />
                                    <span className="pointer-events-none absolute -top-8 hidden whitespace-nowrap rounded-md bg-[#283044] px-2 py-1 text-[10px] font-medium text-white shadow group-hover:block">
                                        {reaction.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            void handleReaction(
                                post.currentReaction ?? "like"
                            )
                        }
                        disabled={isReactionToggling}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold hover:bg-white ${
                            selectedReaction
                                ? selectedReaction.textClass
                                : "text-slate-600"
                        } disabled:cursor-wait disabled:opacity-60`}
                    >
                        {selectedReaction ? (
                            <span className="grid h-5 w-5 place-items-center">
                                <Emoji
                                    unified={selectedReaction.unified}
                                    size={18}
                                    emojiStyle={EmojiStyle.FACEBOOK}
                                />
                            </span>
                        ) : (
                            <Heart className="h-4 w-4" />
                        )}
                        {selectedReaction?.label ?? "Thích"}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCommentsOpen((current) => !current)}
                    aria-expanded={isCommentsOpen}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-[#464554] hover:bg-white"
                >
                    <span className="relative">
                        <MessageCircle className="h-4 w-4" />
                        {commentCount > 0 && (
                            <span className="absolute -right-2.5 -top-2.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#4648d4] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#f2f3ff]">
                                {commentCount > 99
                                    ? "99+"
                                    : commentCount}
                            </span>
                        )}
                    </span>
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

            <CommentSection
                postId={post.id}
                isOpen={isCommentsOpen}
                onCountChange={setCommentCount}
            />
        </article>
    );
}
