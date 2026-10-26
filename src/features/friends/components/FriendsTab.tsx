import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Users } from "lucide-react";

import {
    getFriends,
} from "../../../api/friend.api";
import type {
    FriendListItem,
} from "../../../api/friend.api";
import defaultAvatar from "../../../assets/default-avatar.png";
import {
    formatPresenceStatus,
    usePresenceStore,
} from "../../presence/presence.store";

const getFriendName = (
    friend: FriendListItem["friend"]
) => {
    const fullName = [
        friend.first_name,
        friend.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        fullName ||
        friend.user_name ||
        "Người dùng"
    );
};

export default function FriendsTab() {
    const onlineUserIds = usePresenceStore(
        (state) => state.onlineUserIds
    );
    const lastSeenByUserId = usePresenceStore(
        (state) => state.lastSeenByUserId
    );
    const [friends, setFriends] = useState<
        FriendListItem[]
    >([]);
    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState("");
    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowMs(Date.now());
        }, 60_000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadFriends = async () => {
            setIsLoading(true);
            setError("");

            try {
                const result = await getFriends();

                if (!cancelled) {
                    setFriends(result);
                }
            } catch {
                if (!cancelled) {
                    setError(
                        "Không thể tải danh sách bạn bè"
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadFriends();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            role="tabpanel"
            className="rounded-2xl bg-white p-6 shadow-sm"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#131b2e]">
                        Bạn bè
                    </h2>
                    <p className="mt-1 text-sm text-[#767586]">
                        {isLoading
                            ? "Đang tải..."
                            : `${friends.length} người bạn`}
                    </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f2f3ff] text-[#4648d4]">
                    <Users className="h-5 w-5" />
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-[88px] animate-pulse rounded-2xl bg-[#f5f5fb]"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="py-12 text-center">
                    <p className="text-sm text-rose-600">
                        {error}
                    </p>
                </div>
            ) : friends.length === 0 ? (
                <div className="py-12 text-center">
                    <Users className="mx-auto h-10 w-10 text-[#c7c4d7]" />
                    <p className="mt-3 text-sm text-[#767586]">
                        Bạn chưa có người bạn nào.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {friends.map((item) => {
                        const name = getFriendName(
                            item.friend
                        );
                        const isOnline = onlineUserIds.has(
                            item.friend.id
                        );
                        const statusText = formatPresenceStatus(
                            isOnline,
                            lastSeenByUserId[item.friend.id] ??
                                item.friend.last_seen_at,
                            nowMs
                        );

                        return (
                            <Link
                                key={item.friendship_id}
                                to={`/profile/${item.friend.id}`}
                                className="flex items-center gap-4 rounded-2xl border border-[#eef0ff] p-4 transition hover:border-[#d9dcff] hover:bg-[#fafaff]"
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={item.friend.avatar || defaultAvatar}
                                        alt={name}
                                        className="h-14 w-14 rounded-full object-cover bg-slate-100"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                        }}
                                    />
                                    <span
                                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${isOnline ? "bg-[#57dffe]" : "bg-[#c7c4d7]"}`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-[#131b2e]">
                                        {name}
                                    </p>
                                    <p className="truncate text-xs text-[#767586]">
                                        @{item.friend.user_name || "user"}
                                    </p>
                                    <p
                                        className={`mt-0.5 truncate text-[11px] font-medium ${
                                            isOnline
                                                ? "text-[#007c92]"
                                                : "text-[#767586]"
                                        }`}
                                    >
                                        {statusText}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
