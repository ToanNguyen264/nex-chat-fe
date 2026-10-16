import { useState } from "react";
import type { FormEvent } from "react";
import {
    Image as ImageIcon,
    Mic,
    Smile,
} from "lucide-react";

import avatarCreatePost from "../../../assets/home/avatar-create-post.png";
import type { CurrentUser } from "../../../api/user.api";
import { getUserDisplayName } from "../../../utils/user";


type CreatePostProps = {
    currentUser: CurrentUser | null;
    onCreatePost: (content: string) => Promise<void>;
};


export default function CreatePost({
    currentUser,
    onCreatePost,
}: CreatePostProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const displayName = getUserDisplayName(currentUser);
    const firstName = currentUser?.first_name || displayName;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newContent = content.trim();

        if (!newContent || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onCreatePost(newContent);
            setContent("");
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
                    className="h-[42px] min-w-0 flex-1 rounded-full bg-[#f2f3ff] px-4 text-sm text-[#131b2e] outline-none placeholder:text-[#8b8998] focus:ring-2 focus:ring-[#4648d4]/20"
                />
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="grid flex-1 grid-cols-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                    >
                        <ImageIcon className="h-4 w-4 text-rose-500" />
                        Hình ảnh / Video
                    </button>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                    >
                        <Mic className="h-4 w-4 text-indigo-500" />
                        Pulse Audio
                    </button>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] text-[#464554] hover:bg-[#f2f3ff]"
                    >
                        <Smile className="h-4 w-4 text-cyan-500" />
                        Cảm xúc
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className={`ml-2 rounded-xl bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition ${content.trim()
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
