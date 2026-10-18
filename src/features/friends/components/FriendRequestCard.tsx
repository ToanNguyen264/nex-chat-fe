import { UserRoundCheck } from "lucide-react";

import type { IncomingFriendRequest } from "../../../api/friend.api";
import { usePresenceStore } from "../../presence/presence.store";

type FriendRequestCardProps = {
    request: IncomingFriendRequest;
    isProcessing?: boolean;
    onAccept: (friendshipId: string) => void;
    onReject: (friendshipId: string) => void;
};

const getDisplayName = (request: IncomingFriendRequest) => {
    const fullName = [
        request.requester.first_name,
        request.requester.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return fullName || request.requester.user_name || "Người dùng";
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

const formatRequestTime = (createdAt: string) => {
    const elapsedMilliseconds =
        Date.now() - new Date(createdAt).getTime();
    const elapsedMinutes = Math.max(
        0,
        Math.floor(elapsedMilliseconds / 60_000)
    );

    if (elapsedMinutes < 1) return "Vừa xong";
    if (elapsedMinutes < 60) return `${elapsedMinutes} phút trước`;

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) return `${elapsedHours} giờ trước`;

    return `${Math.floor(elapsedHours / 24)} ngày trước`;
};

export default function FriendRequestCard({
    request,
    isProcessing = false,
    onAccept,
    onReject,
}: FriendRequestCardProps) {
    const displayName = getDisplayName(request);
    const avatar = request.requester.avatar;
    const isOnline = usePresenceStore((state) =>
        state.onlineUserIds.has(request.requester.id)
    );

    return (
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-start gap-2">
                <div className="relative shrink-0">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={displayName}
                            className="h-14 w-14 rounded-full object-cover shadow-[0_0_0_2px_rgba(70,72,212,0.2)]"
                        />
                    ) : (
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#e1e0ff] text-sm font-bold text-[#07006c] shadow-[0_0_0_2px_rgba(70,72,212,0.2)]">
                            {getInitials(displayName)}
                        </span>
                    )}
                    <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? "bg-[#57dffe]" : "bg-[#c7c4d7]"}`}
                    />
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold tracking-[-0.18px] text-[#131b2e]">
                        {displayName}
                    </h3>
                    <p className="truncate text-[13px] text-[#464554]">
                        {request.requester.user_name
                            ? `@${request.requester.user_name}`
                            : "Thành viên Pulse"}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#767586]">
                        {formatRequestTime(request.created_at)}
                    </p>
                </div>
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#f2f3ff] px-2 py-1.5">
                <UserRoundCheck className="h-4 w-4 shrink-0 text-[#4648d4]" />
                <p className="truncate text-xs text-[#464554]">
                    Đã gửi cho bạn một lời mời kết bạn
                </p>
            </div>

            <div className="mt-auto flex items-center gap-1 pt-1">
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onAccept(request.id)}
                    className="flex-1 rounded-full bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d3fc2]"
                >
                    {isProcessing ? "Đang xử lý..." : "Chấp nhận"}
                </button>
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onReject(request.id)}
                    className="rounded-full bg-[#eaedff] px-4 py-2 text-xs font-semibold text-[#464554] transition hover:bg-[#dde1fb]"
                >
                    Xóa
                </button>
            </div>
        </article>
    );
}
