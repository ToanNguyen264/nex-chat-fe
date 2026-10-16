import { useState } from "react";
import type { FormEvent } from "react";
import {
    Image as ImageIcon,
    Mic,
    Smile,
} from "lucide-react";

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
            className="rounded-2xl bg-white p-4 shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                    N
                </div>

                <input
                    type="text"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Hải Nam ơi, bạn đang nghĩ gì?"
                    className="h-11 flex-1 rounded-full bg-[#f2f3ff] px-5 text-sm text-[#131b2e] outline-none placeholder:text-[#767586] focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                    >
                        <ImageIcon className="h-4 w-4 text-rose-500" />
                        Hình ảnh / Video
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                    >
                        <Mic className="h-4 w-4 text-indigo-500" />
                        Nex Audio
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                    >
                        <Smile className="h-4 w-4 text-cyan-500" />
                        Cảm xúc
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Đăng
                </button>
            </div>
        </form>
    );
}