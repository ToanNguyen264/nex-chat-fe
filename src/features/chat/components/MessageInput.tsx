import { useState } from "react";
import type { FormEvent } from "react";
import {
    Image as ImageIcon,
    Paperclip,
    Send,
    Smile,
} from "lucide-react";

type MessageInputProps = {
    onSend: (content: string) => void;
};

export default function MessageInput({
    onSend,
}: MessageInputProps) {
    const [content, setContent] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newContent = content.trim();

        if (!newContent) {
            return;
        }

        onSend(newContent);
        setContent("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-100 bg-white p-3 shadow-[0_-2px_4px_rgba(0,0,0,0.03)]"
        >
            <div className="flex h-12 items-center gap-1 rounded-2xl bg-[#f2f3ff] px-1.5">
                <button
                    type="button"
                    aria-label="Gửi hình ảnh"
                    className="rounded-full p-2 text-slate-500 hover:bg-white"
                >
                    <ImageIcon className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Đính kèm tệp"
                    className="rounded-full p-2 text-slate-500 hover:bg-white"
                >
                    <Paperclip className="h-4 w-4" />
                </button>

                <input
                    id="chat-message"
                    name="chatMessage"
                    type="text"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Nhập tin nhắn..."
                    className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
                />

                <button
                    type="button"
                    aria-label="Chọn biểu tượng cảm xúc"
                    className="rounded-full p-2 text-slate-500 hover:bg-white"
                >
                    <Smile className="h-4 w-4" />
                </button>

                <button
                    type="submit"
                    aria-label="Gửi tin nhắn"
                    disabled={!content.trim()}
                    className="rounded-full bg-[#4648d4] p-2.5 text-white shadow-sm disabled:opacity-40"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}
