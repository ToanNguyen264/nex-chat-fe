import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import EmojiPicker, {
    EmojiStyle,
    Theme,
} from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import {
    Image as ImageIcon,
    Mic,
    Smile,
    X,
} from "lucide-react";

import avatarCreatePost from "../../../assets/home/avatar-create-post.png";
import type { CurrentUser } from "../../../api/user.api";
import { getUserDisplayName } from "../../../utils/user";


type CreatePostProps = {
    currentUser: CurrentUser | null;
    onCreatePost: (
        content: string,
        media?: File[]
    ) => Promise<void>;
};


export default function CreatePost({
    currentUser,
    onCreatePost,
}: CreatePostProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const displayName = getUserDisplayName(currentUser);
    const firstName = currentUser?.first_name || displayName;
    const canSubmit = Boolean(content.trim() || selectedFiles.length > 0);

    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreviewUrls([]);
            return;
        }

        const objectUrls = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewUrls(objectUrls);

        return () => {
            objectUrls.forEach((objectUrl) =>
                URL.revokeObjectURL(objectUrl)
            );
        };
    }, [selectedFiles]);

    useEffect(() => {
        if (!isEmojiPickerOpen) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                emojiPickerRef.current &&
                event.target instanceof Node &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setIsEmojiPickerOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsEmojiPickerOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isEmojiPickerOpen]);

    function handleEmojiClick(emojiData: EmojiClickData) {
        setContent((currentContent) =>
            `${currentContent}${currentContent ? " " : ""}${emojiData.emoji}`
        );
        setIsEmojiPickerOpen(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newContent = content.trim();

        if ((!newContent && selectedFiles.length === 0) || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onCreatePost(
                newContent,
                selectedFiles
            );
            setContent("");
            setSelectedFiles([]);
            setIsEmojiPickerOpen(false);
        } catch (error) {
            console.error("Không thể tạo bài viết:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        >
            <div className="flex items-center gap-3">
                <img
                    src={currentUser?.avatar || avatarCreatePost}
                    alt={displayName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <input
                    id="create-post-content"
                    name="postContent"
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder={`${firstName} ơi, bạn đang nghĩ gì?`}
                    className="emoji-text h-[42px] min-w-0 flex-1 rounded-full bg-[#f2f3ff] px-4 text-sm text-[#131b2e] outline-none placeholder:text-[#8b8998] focus:ring-2 focus:ring-[#4648d4]/20"
                />
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-3">
                    <p className="mb-2 text-xs text-slate-500">
                        Đã chọn {selectedFiles.length}/20 file
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={`${file.name}-${file.lastModified}-${index}`}
                                className="relative overflow-hidden rounded-xl bg-slate-100"
                            >
                                {file.type.startsWith("image/") ? (
                                    <img
                                        src={previewUrls[index]}
                                        alt={`Xem trước ${file.name}`}
                                        className="h-32 w-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={previewUrls[index]}
                                        className="h-32 w-full object-cover"
                                    />
                                )}

                                <button
                                    type="button"
                                    aria-label={`Bỏ file ${file.name}`}
                                    onClick={() =>
                                        setSelectedFiles((currentFiles) =>
                                            currentFiles.filter(
                                                (_, fileIndex) => fileIndex !== index
                                            )
                                        )
                                    }
                                    className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/75"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3 flex items-center justify-between">
                <div className="grid flex-1 grid-cols-3">
                    <label
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                    >
                        <ImageIcon className="h-4 w-4 text-rose-500" />
                        Hình ảnh / Video
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(event) => {
                                const files = Array.from(
                                    event.target.files ?? []
                                );

                                setSelectedFiles((currentFiles) =>
                                    [...currentFiles, ...files].slice(0, 20)
                                );
                                event.target.value = "";
                            }}
                        />
                    </label>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                    >
                        <Mic className="h-4 w-4 text-indigo-500" />
                        Pulse Audio
                    </button>

                    <div ref={emojiPickerRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={isEmojiPickerOpen}
                            onClick={() =>
                                setIsEmojiPickerOpen((current) => !current)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                        >
                            <Smile className="h-4 w-4 text-cyan-500" />
                            Cảm xúc
                        </button>

                        {isEmojiPickerOpen && (
                            <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-indigo-100 bg-white p-2 shadow-[0_20px_60px_rgba(40,48,68,0.22)]">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width="100%"
                                    height={360}
                                    theme={Theme.LIGHT}
                                    emojiStyle={EmojiStyle.FACEBOOK}
                                    previewConfig={{ showPreview: false }}
                                    searchPlaceholder="Tìm cảm xúc..."
                                    autoFocusSearch={false}
                                    lazyLoadEmojis
                                    style={{
                                        border: "none",
                                        borderRadius: "12px",
                                        boxShadow: "none",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className={`ml-2 rounded-xl bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition ${canSubmit
                            ? "opacity-100"
                            : "pointer-events-none w-0 overflow-hidden px-0 opacity-0"
                        }`}
                >
                    {isSubmitting ? "Đang đăng..." : "Đăng"}
                </button>
            </div>
        </form>
    );
}
