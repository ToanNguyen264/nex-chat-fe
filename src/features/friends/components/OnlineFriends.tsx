import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { getFriends } from "../../../api/friend.api";
import type { FriendListItem } from "../../../api/friend.api";
import {
    formatPresenceStatus,
    usePresenceStore,
} from "../../presence/presence.store";
import defaultAvatar from "../../../assets/default-avatar.png";

const getFriendName = (friend: FriendListItem["friend"]) => {
    const fullName = [friend.first_name, friend.last_name]
        .filter(Boolean)
        .join(" ");

    return fullName || friend.user_name || "Người dùng";
};

export default function OnlineFriends() {
    const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);
    const lastSeenByUserId = usePresenceStore(
        (state) => state.lastSeenByUserId
    );
    const [friends, setFriends] = useState<FriendListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
        let isActive = true;

        getFriends()
            .then((items) => {
                if (isActive) setFriends(items);
            })
            .catch((error) => {
                console.error("Không thể tải bạn bè online:", error);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowMs(Date.now());
        }, 60_000);

        return () => window.clearInterval(timer);
    }, []);

    const onlineCount = useMemo(
        () =>
            friends.filter((item) =>
                onlineUserIds.has(item.friend.id)
            ).length,
        [friends, onlineUserIds]
    );

    const sortedFriends = useMemo(() => {
        return [...friends].sort((a, b) => {
            const aOnline = onlineUserIds.has(a.friend.id);
            const bOnline = onlineUserIds.has(b.friend.id);

            if (aOnline !== bOnline) {
                return aOnline ? -1 : 1;
            }

            const aLastSeen =
                lastSeenByUserId[a.friend.id] ??
                a.friend.last_seen_at;
            const bLastSeen =
                lastSeenByUserId[b.friend.id] ??
                b.friend.last_seen_at;

            const aTime = aLastSeen
                ? new Date(aLastSeen).getTime()
                : 0;
            const bTime = bLastSeen
                ? new Date(bLastSeen).getTime()
                : 0;

            return bTime - aTime;
        });
    }, [friends, lastSeenByUserId, onlineUserIds]);

    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-[#131b2e]">
                    Bạn bè online
                    <span className="h-2 w-2 rounded-full bg-[#57dffe]" />
                </h2>
                <span className="text-xs font-semibold text-[#4648d4]">
                    {onlineCount}
                </span>
            </header>

            {isLoading ? (
                <p className="py-5 text-center text-xs text-[#767586]">
                    Đang tải...
                </p>
            ) : sortedFriends.length === 0 ? (
                <p className="py-5 text-center text-xs text-[#767586]">
                    Chưa có bạn bè nào.
                </p>
            ) : (
                <div className="flex flex-col gap-1">
                    {sortedFriends.map((item) => {
                        const name = getFriendName(item.friend);
                        const isOnline = onlineUserIds.has(
                            item.friend.id
                        );
                        const lastSeenAt =
                            lastSeenByUserId[item.friend.id] ??
                            item.friend.last_seen_at;
                        const statusText = formatPresenceStatus(
                            isOnline,
                            lastSeenAt,
                            nowMs
                        );

                        return (
                            <Link
                                key={item.friendship_id}
                                to={`/profile/${item.friend.id}`}
                                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f2f3ff]"
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={item.friend.avatar || defaultAvatar}
                                        alt={name}
                                        className="h-10 w-10 rounded-full object-cover bg-slate-100"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                        }}
                                    />
                                    <span
                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                            isOnline
                                                ? "bg-[#57dffe]"
                                                : "bg-[#c7c4d7]"
                                        }`}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#131b2e]">
                                        {name}
                                    </p>
                                    <p
                                        className={`truncate text-xs ${
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
