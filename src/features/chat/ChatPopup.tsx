import { useState } from "react";
import { MessageCircle } from "lucide-react";

import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import type { ChatMessage } from "./types";
import avatarHoangLong from "../../assets/home/avatar-hoang-long.png";
import chatMedia from "../../assets/home/chat-media.jpeg";

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
            "Cảm ơn cậu nha! Đây là ảnh cận cảnh bảng màu và nút phản hồi cảm xúc nè:",
        time: "10:41",
        media: chatMedia,
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
        <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3">
          {!isMinimized && (
            <button type="button" className="relative hidden h-14 w-14 rounded-full bg-white p-1 shadow-xl xl:block" aria-label="Tin nhắn chưa đọc từ Hoàng Long">
                <img src={avatarHoangLong} alt="Trần Hoàng Long" className="h-12 w-12 rounded-full object-cover" />
                <span className="absolute -right-0.5 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#b90538] text-[10px] font-bold text-white">1</span>
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#57dffe]" />
            </button>
          )}
        <section className="w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(25,25,45,0.22)]">
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
        </div>
    );
}
