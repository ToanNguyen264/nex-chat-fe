import { useState } from "react";
import type { FormEvent } from "react";
import {
    Image as ImageIcon,
    Mic,
    Smile,
} from "lucide-react";

import avatarCreatePost from "../../../assets/home/avatar-create-post.png";

type CreatePostProps = {
    onCreatePost: (content: string) => void;
};


export default function CreatePost({
    onCreatePost,
}: CreatePostProps) {
    const [content, setContent] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newContent = content.trim();

        if (!newContent) {
            return;
        }

        onCreatePost(newContent);

        setContent("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        >
            <div className="flex items-center gap-3">
                <img src={avatarCreatePost} alt="Hải Nam" className="h-10 w-10 shrink-0 rounded-full object-cover" />

                <input
                    id="create-post-content"
                    name="postContent"
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Hải Nam ơi, bạn đang nghĩ gì?"
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
                    disabled={!content.trim()}
                    className={`ml-2 rounded-xl bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition ${content.trim() ? "opacity-100" : "pointer-events-none w-0 overflow-hidden px-0 opacity-0"}`}
                >
                    Đăng
                </button>
            </div>
        </form>
    );
}
