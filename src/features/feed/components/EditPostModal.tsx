import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type { PostPrivacy } from "../../../api/post.api";
import type { Post } from "../types";

type EditPostModalProps = {
    post: Post;
    onClose: () => void;
    onSave: (
        content: string,
        privacy: PostPrivacy
    ) => Promise<void>;
};

export default function EditPostModal({
    post,
    onClose,
    onSave,
}: EditPostModalProps) {
    const [content, setContent] = useState(post.content);
    const [privacy, setPrivacy] =
        useState<PostPrivacy>(post.privacy);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasMedia =
        (post.images?.length ?? 0) > 0 ||
        (post.videos?.length ?? 0) > 0;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedContent = content.trim();

        if (!normalizedContent && !hasMedia) {
            setError("Bài viết cần có nội dung.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await onSave(normalizedContent, privacy);
            onClose();
        } catch {
            setError("Không thể cập nhật bài viết. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`edit-post-title-${post.id}`}
            className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2
                        id={`edit-post-title-${post.id}`}
                        className="text-lg font-bold text-slate-900"
                    >
                        Chỉnh sửa bài viết
                    </h2>
                    <button
                        type="button"
                        aria-label="Đóng"
                        disabled={isSaving}
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="space-y-4 p-5">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Nội dung
                        </span>
                        <textarea
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            rows={6}
                            autoFocus
                            disabled={isSaving}
                            className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Quyền riêng tư
                        </span>
                        <select
                            value={privacy}
                            onChange={(event) =>
                                setPrivacy(event.target.value as PostPrivacy)
                            }
                            disabled={isSaving}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                        >
                            <option value="public">Công khai</option>
                            <option value="friends">Bạn bè</option>
                            <option value="private">Chỉ mình tôi</option>
                        </select>
                    </label>

                    {hasMedia && (
                        <div>
                            <p className="mb-2 text-xs text-slate-500">
                                Ảnh và video đã đăng được giữ nguyên.
                            </p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {post.images?.map((image) => (
                                    <img
                                        key={image}
                                        src={image}
                                        alt="Ảnh hiện có"
                                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                    />
                                ))}
                                {post.videos?.map((video) => (
                                    <video
                                        key={video}
                                        src={video}
                                        className="h-20 w-20 shrink-0 rounded-lg bg-black object-cover"
                                        muted
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-rose-600">{error}</p>
                    )}
                </div>

                <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
