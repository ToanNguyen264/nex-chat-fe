import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import EmojiPicker, {
    EmojiStyle,
    Theme,
} from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import {
    Globe2,
    Hash,
    Image as ImageIcon,
    Lock,
    Smile,
    Users,
    X,
} from "lucide-react";

import type { CurrentUser } from "../../../api/user.api";
import type { PostPrivacy } from "../../../api/post.api";
import { getTagSuggestions, type TagSuggestion } from "../../../api/tag.api";
import { getUserDisplayName } from "../../../utils/user";
import defaultAvatar from "../../../assets/default-avatar.png";


type CreatePostProps = {
    currentUser: CurrentUser | null;
    onCreatePost: (
        content: string,
        media: File[],
        privacy: PostPrivacy
    ) => Promise<void>;
};

type MediaPreviewProps = {
    file: File;
};

function MediaPreview({ file }: MediaPreviewProps) {
    const [previewUrl] = useState(() => URL.createObjectURL(file));

    useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    if (file.type.startsWith("image/")) {
        return (
            <img
                src={previewUrl}
                alt={`Xem trước ${file.name}`}
                className="h-32 w-full object-cover"
            />
        );
    }

    return (
        <video
            src={previewUrl}
            className="h-32 w-full object-cover"
        />
    );
}


export default function CreatePost({
    currentUser,
    onCreatePost,
}: CreatePostProps) {
    const { resolvedTheme } = useTheme();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [privacy, setPrivacy] =
        useState<PostPrivacy>("public");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // State cho gợi ý hashtag
    const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [activeTagPrefix, setActiveTagPrefix] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const displayName = getUserDisplayName(currentUser);
    const firstName = currentUser?.first_name || displayName;
    const canSubmit = Boolean(content.trim() || selectedFiles.length > 0);

    // Bắt sự kiện khi gõ vào ô nhập để phát hiện ký tự #
    function handleContentChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        setContent(val);

        const cursor = event.target.selectionStart ?? val.length;
        const textBeforeCursor = val.slice(0, cursor);
        const match = textBeforeCursor.match(/#([\p{L}\p{N}_]*)$/u);

        if (match) {
            setActiveTagPrefix(match[1] || "");
            setIsSuggestionsOpen(true);
        } else {
            setIsSuggestionsOpen(false);
            setSuggestions([]);
        }
    }

    // Debounce 200ms gọi API gợi ý hashtag
    useEffect(() => {
        if (!isSuggestionsOpen) return;

        const timer = setTimeout(async () => {
            try {
                const results = await getTagSuggestions(activeTagPrefix);
                setSuggestions(results);
            } catch (err) {
                console.error("Lỗi lấy gợi ý tag:", err);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [activeTagPrefix, isSuggestionsOpen]);

    // Khi click chọn một hashtag từ popup gợi ý
    function handleSelectTag(tagName: string) {
        const cursor = inputRef.current?.selectionStart ?? content.length;
        const textBeforeCursor = content.slice(0, cursor);
        const textAfterCursor = content.slice(cursor);

        const updatedBefore = textBeforeCursor.replace(/#([\p{L}\p{N}_]*)$/u, `#${tagName} `);
        const newContent = updatedBefore + textAfterCursor;
        setContent(newContent);
        setIsSuggestionsOpen(false);
        setSuggestions([]);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newCursor = updatedBefore.length;
                inputRef.current.setSelectionRange(newCursor, newCursor);
            }
        }, 0);
    }

    useEffect(() => {
        if (!isEmojiPickerOpen && !isSuggestionsOpen) {
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
            if (
                suggestionsRef.current &&
                event.target instanceof Node &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsSuggestionsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsEmojiPickerOpen(false);
                setIsSuggestionsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isEmojiPickerOpen, isSuggestionsOpen]);

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
                selectedFiles,
                privacy
            );
            setContent("");
            setSelectedFiles([]);
            setPrivacy("public");
            setIsEmojiPickerOpen(false);
            setIsSuggestionsOpen(false);
            setSuggestions([]);
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
                <Link
                    to="/profile"
                    className="shrink-0 transition hover:opacity-90"
                    title="Xem trang cá nhân của bạn"
                >
                    <img
                        src={currentUser?.avatar || defaultAvatar}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover bg-slate-100"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                        }}
                    />
                </Link>

                <div className="relative min-w-0 flex-1">
                    <input
                        ref={inputRef}
                        id="create-post-content"
                        name="postContent"
                        type="text"
                        value={content}
                        onChange={handleContentChange}
                        placeholder={`${firstName} ơi, bạn đang nghĩ gì? (Gõ # để gắn thẻ)`}
                        className="emoji-text h-[42px] w-full rounded-full bg-[#f2f3ff] px-4 text-sm text-[#131b2e] outline-none placeholder:text-[#8b8998] focus:ring-2 focus:ring-[#4648d4]/20"
                    />

                    {/* Popup menu gợi ý Hashtag */}
                    {isSuggestionsOpen && suggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-indigo-100 bg-white p-2 shadow-[0_12px_36px_rgba(40,48,68,0.18)]"
                        >
                            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                                <Hash className="h-3 w-3 text-indigo-500" />
                                <span>GỢI Ý HASHTAG</span>
                            </div>
                            {suggestions.map((item) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => handleSelectTag(item.name)}
                                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition hover:bg-[#f2f3ff]"
                                >
                                    <span className="font-semibold text-[#4648d4]">#{item.name}</span>
                                    <span className="text-[11px] text-slate-400">
                                        {item.post_count} bài viết
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <label className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                {privacy === "public" ? (
                    <Globe2 className="h-4 w-4" />
                ) : privacy === "friends" ? (
                    <Users className="h-4 w-4" />
                ) : (
                    <Lock className="h-4 w-4" />
                )}

                <span>Ai có thể xem:</span>
                <select
                    value={privacy}
                    onChange={(event) =>
                        setPrivacy(
                            event.target.value as PostPrivacy
                        )
                    }
                    className="bg-transparent font-semibold text-indigo-600 outline-none"
                >
                    <option value="public">Công khai</option>
                    <option value="friends">Bạn bè</option>
                    <option value="private">Chỉ mình tôi</option>
                </select>
            </label>

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
                                <MediaPreview file={file} />

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
                <div className="grid flex-1 grid-cols-2">
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
                                    theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
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
