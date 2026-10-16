import type { ChatMessage } from "../types";
import avatarChat from "../../../assets/home/avatar-chat.png";

type MessageListProps = {
    messages: ChatMessage[];
};

export default function MessageList({
    messages,
}: MessageListProps) {
    return (
        <div className="flex h-[374px] flex-col gap-3 overflow-y-auto bg-[#faf8ff] p-4">
            <p className="mx-auto rounded-full bg-[#e5e7ff] px-3 py-1 text-[11px] text-[#767586]">
                Hôm nay, 10:38
            </p>

            {messages.map((message) => {
                const isMyMessage = message.sender === "me";

                return (
                    <div
                        key={message.id}
                        className={`flex items-end gap-2 ${
                            isMyMessage
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        {!isMyMessage && <img src={avatarChat} alt="" className="mb-5 h-6 w-6 rounded-full object-cover" />}
                        <div
                            className={`max-w-[80%] ${
                                isMyMessage
                                    ? "items-end"
                                    : "items-start"
                            } flex flex-col`}
                        >
                            <div
                                className={`rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                                    isMyMessage
                                        ? "rounded-br-sm bg-indigo-600 text-white"
                                        : "rounded-bl-sm bg-white text-[#131b2e]"
                                }`}
                            >
                                {message.content}
                            </div>

                            {message.media && <img src={message.media} alt="Bảng màu thiết kế" className="mt-1 h-28 w-[220px] rounded-xl object-cover shadow-sm" />}

                            <span className="mt-1 px-1 text-[10px] text-slate-400">
                                {message.time}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
