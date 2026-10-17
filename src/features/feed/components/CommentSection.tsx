import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";

import {
    createPostComment,
    getPostComments,
} from "../../../api/comment.api";
import type { CommentFromApi } from "../../../api/comment.api";

type CommentSectionProps = {
    postId: number;
    isOpen: boolean;
    onCountChange: (count: number) => void;
};

function getAuthorName(comment: CommentFromApi) {
    const fullName = [
        comment.users.first_name,
        comment.users.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return fullName || comment.users.user_name || "Người dùng";
}

function formatCommentDate(value: string) {
    const date = new Date(value);

    return {
        time: date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        date: date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    };
}

export default function CommentSection({
    postId,
    isOpen,
    onCountChange,
}: CommentSectionProps) {
    const [comments, setComments] = useState<CommentFromApi[]>([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!isOpen || hasLoaded) {
            return;
        }

        let isCancelled = false;

        async function loadComments() {
            setIsLoading(true);

            try {
                const data = await getPostComments(postId);

                if (!isCancelled) {
                    setComments(data);
                    onCountChange(data.length);
                    setHasLoaded(true);
                }
            } catch (error) {
                console.error("Không thể lấy bình luận:", error);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadComments();

        return () => {
            isCancelled = true;
        };
    }, [hasLoaded, isOpen, onCountChange, postId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newContent = content.trim();

        if (!newContent || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const newComment = await createPostComment(
                postId,
                newContent
            );
            const nextComments = [...comments, newComment];

            setComments(nextComments);
            setContent("");
            setHasLoaded(true);
            onCountChange(nextComments.length);
        } catch (error) {
            console.error("Không thể tạo bình luận:", error);
            window.alert("Không thể gửi bình luận.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <section className="mt-3 border-t border-slate-100 pt-3">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
            >
                <input
                    type="text"
                    value={content}
                    maxLength={2000}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Viết bình luận..."
                    className="emoji-text h-10 min-w-0 flex-1 rounded-full bg-[#f2f3ff] px-4 text-sm outline-none focus:ring-2 focus:ring-[#4648d4]/20"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    aria-label="Gửi bình luận"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#4648d4] text-white hover:bg-[#3c3ebe] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </form>

            <div className="mt-3 space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-4 text-slate-400">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="py-3 text-center text-xs text-slate-400">
                        Hãy là người đầu tiên bình luận.
                    </p>
                ) : (
                    comments.map((comment) => {
                        const authorName = getAuthorName(comment);
                        const commentDate = formatCommentDate(
                            comment.created_at
                        );

                        return (
                            <article
                                key={comment.id}
                                className="flex items-start gap-2.5"
                            >
                                {comment.users.avatar ? (
                                    <img
                                        src={comment.users.avatar}
                                        alt={authorName}
                                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
                                    />
                                ) : (
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 ring-2 ring-white">
                                        {authorName.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                <div className="min-w-0 max-w-[85%]">
                                    <div className="rounded-2xl rounded-tl-md bg-[#f2f3ff] px-3.5 py-2.5">
                                        <p className="text-xs font-semibold text-[#131b2e]">
                                            {authorName}
                                        </p>
                                        <p className="emoji-text mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-[#464554]">
                                            {comment.content}
                                        </p>
                                    </div>

                                    <div className="mt-1 flex items-center gap-1.5 pl-2 text-[10px] font-medium text-slate-400">
                                        <time dateTime={comment.created_at}>
                                            {commentDate.time}
                                        </time>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <time dateTime={comment.created_at}>
                                            {commentDate.date}
                                        </time>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}
