import {
    ArrowLeft,
    Maximize2,
    Minus,
    Phone,
    Video,
    X,
} from "lucide-react";

import type { ChatConversation } from "../types";
import {
    getConversationAvatar,
    getConversationName,
    getOtherConversationUser,
} from "../chat.utils";
import { getNameInitials } from "../../../utils/user";
import { usePresenceStore } from "../../presence/presence.store";

type ChatHeaderProps = {
    conversation: ChatConversation;
    currentUserId: string;
    isMinimized: boolean;
    isCallDisabled: boolean;
    onBack: () => void;
    onStartAudioCall: () => void;
    onStartVideoCall: () => void;
    onToggleMinimize: () => void;
    onClose: () => void;
};

export default function ChatHeader({
    conversation,
    currentUserId,
    isMinimized,
    isCallDisabled,
    onBack,
    onStartAudioCall,
    onStartVideoCall,
    onToggleMinimize,
    onClose,
}: ChatHeaderProps) {
    const name = getConversationName(
        conversation,
        currentUserId
    );
    const avatar = getConversationAvatar(
        conversation,
        currentUserId
    );
    const otherUser = getOtherConversationUser(
        conversation,
        currentUserId
    );
    const isOnline = usePresenceStore((state) =>
        otherUser
            ? state.onlineUserIds.has(otherUser.id)
            : false
    );

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-3">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    aria-label="Danh sách cuộc trò chuyện"
                    onClick={onBack}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="relative shrink-0">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-[#4648d4]/20"
                        />
                    ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8e9ff] text-xs font-bold text-[#4648d4]">
                            {getNameInitials(name)}
                        </span>
                    )}

                    {conversation.type === "direct" && (
                        <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isOnline
                                ? "bg-cyan-400"
                                : "bg-slate-300"
                                }`}
                        />
                    )}
                </div>

                <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-[#131b2e]">
                        {name}
                    </h2>
                    {conversation.type === "direct" && (
                        <p
                            className={`text-[11px] font-semibold ${isOnline
                                ? "text-[#0098ad]"
                                : "text-slate-400"
                                }`}
                        >
                            {isOnline
                                ? "Đang hoạt động"
                                : "Đang offline"}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center">
                {conversation.type === "direct" && (
                    <>
                        <button
                            type="button"
                            aria-label="Gọi thoại"
                            title="Gọi thoại"
                            disabled={isCallDisabled}
                            onClick={onStartAudioCall}
                            className="rounded-full p-2 text-[#4648d4] transition hover:bg-[#eef0ff] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Phone className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Gọi video"
                            title="Gọi video"
                            disabled={isCallDisabled}
                            onClick={onStartVideoCall}
                            className="rounded-full p-2 text-[#4648d4] transition hover:bg-[#eef0ff] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Video className="h-4 w-4" />
                        </button>
                    </>
                )}
                <button
                    type="button"
                    aria-label={
                        isMinimized ? "Mở rộng" : "Thu nhỏ"
                    }
                    onClick={onToggleMinimize}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    {isMinimized ? (
                        <Maximize2 className="h-4 w-4" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                </button>

                <button
                    type="button"
                    aria-label="Đóng"
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    <X className="h-4 w-4" />
                </button>

            </div>
        </header>
    );
}
