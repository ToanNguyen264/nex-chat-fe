import type { ChatMessage } from "../types";

type MessageListProps = {
    messages: ChatMessage[];
};

export default function MessageList({
    messages,
}: MessageListProps) {
    return (
        <div className="flex h-[360px] flex-col gap-3 overflow-y-auto bg-[#faf8ff] p-4">
            <p className="text-center text-xs text-slate-400">
                Hôm nay
            </p>

            {messages.map((message) => {
                const isMyMessage = message.sender === "me";

                return (
                    <div
                        key={message.id}
                        className={`flex ${
                            isMyMessage
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
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