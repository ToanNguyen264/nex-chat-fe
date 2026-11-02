import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Users, X } from "lucide-react";

import {
    getFollowers,
    getFollowing,
    type FollowUserItem,
} from "../../../api/follow.api";
import defaultAvatar from "../../../assets/default-avatar.png";

export type FollowModalTab = "followers" | "following";

type FollowListModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    initialTab?: FollowModalTab;
};

export default function FollowListModal({
    isOpen,
    onClose,
    userId,
    initialTab = "followers",
}: FollowListModalProps) {
    const [activeTab, setActiveTab] = useState<FollowModalTab>(initialTab);
    const [users, setUsers] = useState<FollowUserItem[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (!isOpen || !userId) return;

        let cancelled = false;

        async function loadInitial() {
            setIsLoading(true);
            setError("");
            setUsers([]);
            setNextCursor(null);
            setHasNextPage(false);

            try {
                const fetchFn = activeTab === "followers" ? getFollowers : getFollowing; /* nếu dang ở tab followers thì biến fetchFn sẽ là getFollowers, ngược lại là getFollowing */
                const result = await fetchFn(userId);

                if (!cancelled) {
                    setUsers(result.users);
                    setNextCursor(result.nextCursor);
                    setHasNextPage(result.hasNextPage);
                }
            } catch {
                if (!cancelled) {
                    setError("Không thể tải danh sách người dùng.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadInitial();

        return () => {
            cancelled = true;
        };
    }, [isOpen, userId, activeTab]);

    async function handleLoadMore() {
        if (!hasNextPage || !nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const fetchFn =
                activeTab === "followers" ? getFollowers : getFollowing;
            const result = await fetchFn(userId, nextCursor);

            setUsers((prev) => [...prev, ...result.users]);
            setNextCursor(result.nextCursor);
            setHasNextPage(result.hasNextPage);
        } catch {
            setError("Không thể tải thêm dữ liệu.");
        } finally {
            setIsLoadingMore(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#131b2e]/55 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="flex h-[480px] max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#151c2c] border border-transparent dark:border-[#263147] shadow-[0_24px_80px_rgba(19,27,46,0.28)]">
                <header className="shrink-0 flex items-center justify-between border-b border-[#eef0ff] dark:border-[#263147] px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("followers")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                activeTab === "followers"
                                    ? "bg-[#4648d4] text-white"
                                    : "text-[#767586] dark:text-slate-400 hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b] hover:text-[#131b2e] dark:hover:text-slate-100"
                            }`}
                        >
                            Người theo dõi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("following")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                activeTab === "following"
                                    ? "bg-[#4648d4] text-white"
                                    : "text-[#767586] dark:text-slate-400 hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b] hover:text-[#131b2e] dark:hover:text-slate-100"
                            }`}
                        >
                            Đang theo dõi
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f3ff] dark:bg-[#1e293b] text-[#464554] dark:text-slate-300 hover:bg-[#e8e9fb] dark:hover:bg-[#283548] transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 overscroll-contain">
                    {isLoading ? (
                        <div className="flex flex-col gap-3 py-2">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl p-2"
                                >
                                    <div className="h-12 w-12 animate-pulse rounded-full bg-[#f0f2ff] dark:bg-[#1e293b]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 animate-pulse rounded bg-[#f0f2ff] dark:bg-[#1e293b]" />
                                        <div className="h-3 w-20 animate-pulse rounded bg-[#f0f2ff] dark:bg-[#1e293b]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                            <p className="text-sm text-rose-600">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                            <Users className="mx-auto h-10 w-10 text-[#c7c4d7] dark:text-slate-600" />
                            <p className="mt-3 text-sm text-[#767586] dark:text-slate-400">
                                {activeTab === "followers"
                                    ? "Chưa có người theo dõi nào."
                                    : "Chưa theo dõi người dùng nào."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {users.map((item) => (
                                <Link
                                    key={item.followId}
                                    to={`/profile/${item.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3.5 rounded-2xl p-3 transition hover:bg-[#f8f9ff] dark:hover:bg-[#1e293b]"
                                >
                                    <img
                                        src={item.avatar || defaultAvatar}
                                        alt={item.name}
                                        className="h-12 w-12 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-[#131b2e] dark:text-slate-100">
                                            {item.name}
                                        </p>
                                        <p className="truncate text-xs text-[#767586] dark:text-slate-400">
                                            @{item.userName || "user"}
                                        </p>
                                    </div>
                                </Link>
                            ))}

                            {hasNextPage && (
                                <div className="pt-3 text-center">
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="rounded-xl bg-[#f2f3ff] dark:bg-[#1e293b] px-5 py-2.5 text-xs font-semibold text-[#4648d4] dark:text-indigo-400 transition hover:bg-[#e8e9fb] dark:hover:bg-[#283548] disabled:opacity-50"
                                    >
                                        {isLoadingMore
                                            ? "Đang tải thêm..."
                                            : "Xem thêm"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

