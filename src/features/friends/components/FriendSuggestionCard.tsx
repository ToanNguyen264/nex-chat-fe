import {
    GraduationCap,
    MapPin,
    MessageSquareText,
    UserPlus,
    UsersRound,
    X,
} from "lucide-react";

import type { FriendSuggestion } from "../../../api/friend.api";
import { usePresenceStore } from "../../presence/presence.store";

type FriendSuggestionCardProps = {
    suggestion: FriendSuggestion;
    isSending?: boolean;
    onAddFriend: (userId: string) => void;
    onDismiss: (userId: string) => void;
};

const accentClasses = [
    "from-[#c6c8fa] to-[#b9d9dd]",
    "from-[#b9dddd] to-[#d8d8fa]",
    "from-[#ffd8df] to-[#f5cbd6]",
    "from-[#c8cefa] to-[#c8f1f8]",
];

const getDisplayName = (suggestion: FriendSuggestion) => {
    const fullName = [suggestion.first_name, suggestion.last_name]
        .filter(Boolean)
        .join(" ");

    return (
        suggestion.profiles?.display_name ||
        fullName ||
        suggestion.user_name ||
        "Người dùng"
    );
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

export default function FriendSuggestionCard({
    suggestion,
    isSending = false,
    onAddFriend,
    onDismiss,
}: FriendSuggestionCardProps) {
    const displayName = getDisplayName(suggestion);
    const isOnline = usePresenceStore((state) =>
        state.onlineUserIds.has(suggestion.id)
    );
    const avatar =
        suggestion.profiles?.avatar_url ?? suggestion.avatar;
    const contextText =
        suggestion.matchReasons
            .filter((reason) => !reason.includes("bạn chung"))
            .join(" • ") ||
        suggestion.profiles?.location ||
        suggestion.profiles?.education ||
        "Hồ sơ mới trên Pulse";
    const role =
        suggestion.profiles?.workplace ||
        suggestion.profiles?.education ||
        suggestion.profiles?.location ||
        "Thành viên Pulse";
    const accentIndex =
        Number.parseInt(suggestion.id.slice(-2), 10) %
        accentClasses.length;

    return (
        <article className="overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm">
            <div
                className={`relative h-20 bg-gradient-to-r ${accentClasses[Number.isNaN(accentIndex) ? 0 : accentIndex]}`}
            >
                <button
                    type="button"
                    onClick={() => onDismiss(suggestion.id)}
                    aria-label={`Ẩn gợi ý ${displayName}`}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/80 text-[#767586] backdrop-blur transition hover:bg-white"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="relative px-4 pb-4 pt-8">
                <div className="absolute -top-10 left-4 right-4 flex items-end justify-between">
                    <span className="relative block">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={displayName}
                                className="h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-sm"
                            />
                        ) : (
                            <span className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-white bg-[#e1e0ff] text-sm font-bold text-[#07006c] shadow-sm">
                                {getInitials(displayName)}
                            </span>
                        )}
                        <span
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? "bg-[#57dffe]" : "bg-[#c7c4d7]"}`}
                        />
                    </span>
                    <span className="mb-0 rounded-full bg-[#e1e0ff] px-2 py-1 text-[10px] font-semibold text-[#07006c]">
                        {suggestion.matchScore} điểm phù hợp
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-bold tracking-[-0.18px] text-[#131b2e]">
                        {displayName}
                    </h3>
                    <p className="text-[11px] text-[#767586]">
                        {suggestion.user_name
                            ? `@${suggestion.user_name}`
                            : "Thành viên Pulse"}
                    </p>
                    <p className="mt-1 truncate text-[13px] text-[#464554]">
                        {role}
                    </p>
                </div>

                <div className="mt-3 space-y-1 rounded-xl bg-[#f2f3ff] p-2 text-xs text-[#464554]">
                    <p className="flex items-center gap-1.5">
                        <UsersRound className="h-4 w-4 shrink-0 text-[#4648d4]" />
                        <span className="truncate">
                            {suggestion.mutualFriendCount > 0
                                ? `${suggestion.mutualFriendCount} bạn chung`
                                : "Chưa có bạn chung"}
                        </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                        {suggestion.profiles?.location ? (
                            <MapPin className="h-4 w-4 shrink-0 text-[#007c92]" />
                        ) : (
                            <GraduationCap className="h-4 w-4 shrink-0 text-[#007c92]" />
                        )}
                        <span className="truncate">
                            {contextText}
                        </span>
                    </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        disabled={isSending}
                        onClick={() => onAddFriend(suggestion.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3d3fc2]"
                    >
                        <UserPlus className="h-4 w-4" />
                        {isSending ? "Đang gửi..." : "Kết bạn"}
                    </button>
                    <button
                        type="button"
                        aria-label={`Nhắn tin cho ${displayName}`}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#eaedff] text-[#464554] transition hover:bg-[#dde1fb]"
                    >
                        <MessageSquareText className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}
