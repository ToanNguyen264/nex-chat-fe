import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

type MessageInputProps = {
    onSend: (content: string) => Promise<void>;
    isSending: boolean;
};

export default function MessageInput({
    onSend,
    isSending,
}: MessageInputProps) {
    const [content, setContent] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const newContent = content.trim();

        if (!newContent || isSending) return;

        try {
            await onSend(newContent);
            setContent("");
        } catch {
            // Giữ lại nội dung để người dùng có thể thử gửi lại.
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-100 bg-white p-3 shadow-[0_-2px_4px_rgba(0,0,0,0.03)]"
        >
            <div className="flex h-12 items-center gap-2 rounded-2xl bg-[#f2f3ff] px-2">
                <input
                    id="chat-message"
                    name="chatMessage"
                    type="text"
                    value={content}
                    disabled={isSending}
                    maxLength={5000}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Nhập tin nhắn..."
                    className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-wait"
                />

                <button
                    type="submit"
                    aria-label="Gửi tin nhắn"
                    disabled={!content.trim() || isSending}
                    className="rounded-full bg-[#4648d4] p-2.5 text-white shadow-sm disabled:opacity-40"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}
