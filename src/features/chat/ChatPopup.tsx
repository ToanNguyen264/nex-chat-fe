import { useState } from "react";
import { MessageCircle } from "lucide-react";

import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import type { ChatMessage } from "./types";

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        sender: "friend",
        content:
            "Chào Hải Nam! Cậu đã kịp xem qua bản demo giao diện mới chưa?",
        time: "10:39",
    },
    {
        id: 2,
        sender: "me",
        content:
            "Mình vừa thả tim bài viết xong! Giao diện nổi bật và chuyển động rất mượt.",
        time: "10:40",
    },
    {
        id: 3,
        sender: "friend",
        content:
            "Cảm ơn cậu nha! Mình vẫn đang tiếp tục hoàn thiện.",
        time: "10:41",
    },
];

export default function ChatPopup() {
    const [messages, setMessages] =
        useState<ChatMessage[]>(initialMessages);

    const [isOpen, setIsOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    function handleSend(content: string) {
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: "me",
            content,
            time: "Vừa xong",
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            newMessage,
        ]);
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                aria-label="Mở tin nhắn"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700"
            >
                <MessageCircle className="h-6 w-6" />
            </button>
        );
    }

    return (
        <section className="fixed bottom-4 right-4 z-50 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <ChatHeader
                isMinimized={isMinimized}
                onToggleMinimize={() =>
                    setIsMinimized((current) => !current)
                }
                onClose={() => setIsOpen(false)}
            />

            {!isMinimized && (
                <>
                    <MessageList messages={messages} />
                    <MessageInput onSend={handleSend} />
                </>
            )}
        </section>
    );
}