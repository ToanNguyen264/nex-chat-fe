import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { getFriends } from "../../../api/friend.api";
import type { FriendListItem } from "../../../api/friend.api";
import { usePresenceStore } from "../../presence/presence.store";
import { getNameInitials } from "../../../utils/user";

const getFriendName = (friend: FriendListItem["friend"]) => {
    const fullName = [friend.first_name, friend.last_name]
        .filter(Boolean)
        .join(" ");

    return fullName || friend.user_name || "Người dùng";
};

export default function OnlineFriends() {
    const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);
    const [friends, setFriends] = useState<FriendListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const onlineFriends = useMemo(
        () =>
            friends.filter((item) =>
                onlineUserIds.has(item.friend.id)
            ),
        [friends, onlineUserIds]
    );

    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-[#131b2e]">
                    Bạn bè online
                    <span className="h-2 w-2 rounded-full bg-[#57dffe]" />
                </h2>
                <span className="text-xs font-semibold text-[#4648d4]">
                    {onlineFriends.length}
                </span>
            </header>

            {isLoading ? (
                <p className="py-5 text-center text-xs text-[#767586]">
                    Đang tải...
                </p>
            ) : onlineFriends.length === 0 ? (
                <p className="py-5 text-center text-xs text-[#767586]">
                    Chưa có bạn bè nào đang online.
                </p>
            ) : (
                <div className="flex flex-col gap-1">
                    {onlineFriends.map((item) => {
                        const name = getFriendName(item.friend);

                        return (
                            <Link
                                key={item.friendship_id}
                                to={`/profile/${item.friend.id}`}
                                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f2f3ff]"
                            >
                                <div className="relative shrink-0">
                                    {item.friend.avatar ? (
                                        <img
                                            src={item.friend.avatar}
                                            alt={name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8e9ff] text-xs font-bold text-[#4648d4]">
                                            {getNameInitials(name)}
                                        </span>
                                    )}
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#57dffe]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#131b2e]">
                                        {name}
                                    </p>
                                    <p className="truncate text-xs text-[#007c92]">
                                        Đang hoạt động
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
