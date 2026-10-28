import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Compass, Search, UserRoundPlus } from "lucide-react";

import {
    acceptFriendRequest,
    getFriendCount,
    getFriendSuggestions,
    getIncomingFriendRequests,
    rejectFriendRequest,
    sendFriendRequest,
} from "../api/friend.api";
import type {
    FriendSuggestion,
    IncomingFriendRequest,
} from "../api/friend.api";
import { getCurrentUser } from "../api/user.api";
import type { CurrentUser } from "../api/user.api";
import FriendRequestCard from "../features/friends/components/FriendRequestCard";
import FriendSuggestionCard from "../features/friends/components/FriendSuggestionCard";
import MainLayout from "../layouts/MainLayout";
import type { FriendshipChangedPayload } from "../socket/friendship.events";
import { socket } from "../socket/socket";
import { showError, showSuccess } from "../utils/swal";

type FilterKey = "all" | "mutual" | "incoming";

const normalizeSearchText = (value: string | null | undefined) =>
    value?.trim().toLocaleLowerCase("vi-VN") ?? "";

const getRequestName = (request: IncomingFriendRequest) =>
    [request.requester.first_name, request.requester.last_name]
        .filter(Boolean)
        .join(" ") || request.requester.user_name || "";

const getSuggestionName = (suggestion: FriendSuggestion) =>
    suggestion.profiles?.display_name ||
    [suggestion.first_name, suggestion.last_name]
        .filter(Boolean)
        .join(" ") ||
    suggestion.user_name ||
    "";

export default function FriendsPage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [requests, setRequests] = useState<IncomingFriendRequest[]>([]);
    const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
    const [friendCount, setFriendCount] = useState(0);
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [suggestionLimit, setSuggestionLimit] = useState(20);
    const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processingRequestIds, setProcessingRequestIds] =
        useState<Set<string>>(new Set());
    const [sendingSuggestionIds, setSendingSuggestionIds] =
        useState<Set<string>>(new Set());

    useEffect(() => {
        async function loadFriendsPage() {
            try {
                setIsLoading(true);
                setError(null);

                const [user, friendCountResult, incomingRequests, friendSuggestions] =
                    await Promise.all([
                        getCurrentUser(),
                        getFriendCount(),
                        getIncomingFriendRequests(),
                        getFriendSuggestions(20),
                    ]);

                setCurrentUser(user);
                setFriendCount(friendCountResult);
                setRequests(incomingRequests);
                setSuggestions(friendSuggestions);
                setHasMoreSuggestions(friendSuggestions.length === 20);
            } catch (loadError) {
                console.error("Không thể tải trang bạn bè:", loadError);
                setError("Không thể tải dữ liệu bạn bè. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadFriendsPage();
    }, []);

    useEffect(() => {
        let isActive = true;

        const handleFriendshipChanged = async (
            payload: FriendshipChangedPayload
        ) => {
            try {
                const [friendCountResult, incomingRequests, friendSuggestions] =
                    await Promise.all([
                        getFriendCount(),
                        getIncomingFriendRequests(),
                        getFriendSuggestions(suggestionLimit),
                    ]);

                if (!isActive) return;

                setFriendCount(friendCountResult);
                setRequests(incomingRequests);
                setSuggestions(friendSuggestions);
                setHasMoreSuggestions(
                    friendSuggestions.length === suggestionLimit &&
                        suggestionLimit < 50
                );

                console.log(
                    "Friendship data synchronized:",
                    payload.action
                );
            } catch (syncError) {
                console.error(
                    "Không thể đồng bộ quan hệ bạn bè:",
                    syncError
                );
            }
        };

        socket.on("friendship:changed", handleFriendshipChanged);

        return () => {
            isActive = false;
            socket.off("friendship:changed", handleFriendshipChanged);
        };
    }, [suggestionLimit]);

    const normalizedSearchTerm = normalizeSearchText(searchTerm);

    const filteredRequests = useMemo(() => {
        if (!normalizedSearchTerm) return requests;

        return requests.filter((request) =>
            normalizeSearchText(
                `${getRequestName(request)} ${request.requester.user_name ?? ""}`
            ).includes(normalizedSearchTerm)
        );
    }, [normalizedSearchTerm, requests]);

    const filteredSuggestions = useMemo(() => {
        return suggestions.filter((suggestion) => {
            if (activeFilter === "mutual" && suggestion.mutualFriendCount === 0) {
                return false;
            }

            if (!normalizedSearchTerm) return true;

            const searchableText = [
                getSuggestionName(suggestion),
                suggestion.user_name,
                suggestion.profiles?.workplace,
                suggestion.profiles?.education,
                suggestion.profiles?.location,
            ]
                .filter(Boolean)
                .join(" ");

            return normalizeSearchText(searchableText).includes(
                normalizedSearchTerm
            );
        });
    }, [activeFilter, normalizedSearchTerm, suggestions]);

    const setRequestProcessing = (id: string, value: boolean) => {
        setProcessingRequestIds((currentIds) => {
            const nextIds = new Set(currentIds);
            if (value) nextIds.add(id);
            else nextIds.delete(id);
            return nextIds;
        });
    };

    const handleAcceptRequest = async (friendshipId: string) => {
        try {
            setRequestProcessing(friendshipId, true);
            await acceptFriendRequest(friendshipId);
            setRequests((current) =>
                current.filter((request) => request.id !== friendshipId)
            );
            setFriendCount((count) => count + 1);
            void showSuccess("Đã chấp nhận lời mời kết bạn");
        } catch (actionError) {
            console.error("Không thể chấp nhận lời mời:", actionError);
            void showError("Không thể chấp nhận lời mời kết bạn");
        } finally {
            setRequestProcessing(friendshipId, false);
        }
    };

    const handleRejectRequest = async (friendshipId: string) => {
        try {
            setRequestProcessing(friendshipId, true);
            await rejectFriendRequest(friendshipId);
            setRequests((current) =>
                current.filter((request) => request.id !== friendshipId)
            );
            void showSuccess("Đã từ chối lời mời kết bạn");
        } catch (actionError) {
            console.error("Không thể từ chối lời mời:", actionError);
            void showError("Không thể từ chối lời mời kết bạn");
        } finally {
            setRequestProcessing(friendshipId, false);
        }
    };

    const handleAddFriend = async (userId: string) => {
        setSendingSuggestionIds((currentIds) =>
            new Set(currentIds).add(userId)
        );

        try {
            await sendFriendRequest(userId);
            setSuggestions((current) =>
                current.filter((suggestion) => suggestion.id !== userId)
            );
            void showSuccess("Đã gửi lời mời kết bạn");
        } catch (actionError) {
            console.error("Không thể gửi lời mời:", actionError);
            void showError("Không thể gửi lời mời kết bạn");
        } finally {
            setSendingSuggestionIds((currentIds) => {
                const nextIds = new Set(currentIds);
                nextIds.delete(userId);
                return nextIds;
            });
        }
    };

    const handleLoadMore = async () => {
        try {
            setIsLoadingMore(true);
            const nextLimit = Math.min(suggestionLimit + 20, 50);
            const nextSuggestions = await getFriendSuggestions(nextLimit);

            setSuggestions(nextSuggestions);
            setSuggestionLimit(nextLimit);
            setHasMoreSuggestions(
                nextSuggestions.length === nextLimit && nextLimit < 50
            );
        } catch (loadError) {
            console.error("Không thể tải thêm gợi ý:", loadError);
            void showError("Không thể tải thêm gợi ý kết bạn");
        } finally {
            setIsLoadingMore(false);
        }
    };

    const filters: Array<{ key: FilterKey; label: string }> = [
        { key: "all", label: "Tất cả gợi ý" },
        { key: "mutual", label: "Có bạn chung" },
        { key: "incoming", label: "Lời mời đã nhận" },
    ];

    const showRequests = activeFilter === "all" || activeFilter === "incoming";
    const showSuggestions = activeFilter !== "incoming";

    return (
        <MainLayout currentUser={currentUser}>
            <div className="flex flex-col gap-9">
                <section className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:p-9 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex rounded-full bg-[#e1e0ff] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#07006c]">
                            Mạng lưới Pulse
                        </span>
                        <h1 className="mt-2 text-2xl font-bold tracking-[-0.8px] text-[#131b2e] md:text-[32px] md:leading-10">
                            Bạn bè &amp; Mạng lưới kết nối
                        </h1>
                        <p className="mt-1 max-w-xl text-sm leading-6 text-[#464554]">
                            Khám phá những người có bạn chung và hồ sơ phù hợp với bạn.
                        </p>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-5 rounded-xl bg-[#f2f3ff] px-6 py-4 sm:w-auto sm:flex-nowrap sm:gap-6">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#464554]">
                                Bạn bè hiện tại
                            </p>
                            <strong className="mt-1 block text-2xl text-[#131b2e]">
                                {friendCount}
                            </strong>
                        </div>
                        <div className="hidden h-8 w-px bg-[#dae2fd] sm:block" />
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#464554]">
                                Lời mời mới
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <strong className="text-2xl text-[#4648d4]">
                                    {requests.length}
                                </strong>
                                {requests.length > 0 && (
                                    <span className="rounded-full bg-[#ffdadb] px-2 py-0.5 text-[11px] font-bold text-[#92002a]">
                                        Chờ duyệt
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <label className="flex h-12 max-w-lg items-center gap-3 rounded-full bg-white px-4 shadow-sm">
                        <Search className="h-[18px] w-[18px] shrink-0 text-[#767586]" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm theo tên, công ty, trường học..."
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#131b2e] outline-none placeholder:text-[#767586]"
                        />
                    </label>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => setActiveFilter(filter.key)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition ${activeFilter === filter.key ? "bg-[#4648d4] text-white" : "bg-white text-[#464554] hover:bg-[#f2f3ff]"}`}
                            >
                                {filter.label}
                                {filter.key === "incoming" && requests.length > 0 && (
                                    <span className="ml-2 rounded-full bg-[#b90538] px-1.5 py-0.5 text-[10px] text-white">
                                        {requests.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl bg-[#ffdadb] p-4 text-sm text-[#92002a]">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#767586] shadow-sm">
                        Đang tải dữ liệu bạn bè...
                    </div>
                ) : (
                    <>
                        {showRequests && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <UserRoundPlus className="h-5 w-5 text-[#4648d4]" />
                                    <h2 className="text-xl font-semibold tracking-[-0.3px] text-[#131b2e]">
                                        Lời mời kết bạn đang chờ
                                    </h2>
                                    {requests.length > 0 && (
                                        <span className="rounded-full bg-[#e1e0ff] px-2 py-1 text-[11px] font-bold text-[#07006c]">
                                            {requests.length} lời mời mới
                                        </span>
                                    )}
                                </div>

                                {filteredRequests.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {filteredRequests.map((request) => (
                                            <FriendRequestCard
                                                key={request.id}
                                                request={request}
                                                isProcessing={processingRequestIds.has(request.id)}
                                                onAccept={handleAcceptRequest}
                                                onReject={handleRejectRequest}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#767586] shadow-sm">
                                        Không có lời mời kết bạn phù hợp.
                                    </div>
                                )}
                            </section>
                        )}

                        {showSuggestions && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Compass className="h-5 w-5 text-[#007c92]" />
                                    <h2 className="text-xl font-semibold tracking-[-0.3px] text-[#131b2e]">
                                        Gợi ý kết bạn thông minh
                                    </h2>
                                </div>

                                {filteredSuggestions.length > 0 ? (
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {filteredSuggestions.map((suggestion) => (
                                            <FriendSuggestionCard
                                                key={suggestion.id}
                                                suggestion={suggestion}
                                                isSending={sendingSuggestionIds.has(suggestion.id)}
                                                onAddFriend={handleAddFriend}
                                                onDismiss={(userId) =>
                                                    setSuggestions((current) =>
                                                        current.filter(
                                                            (item) => item.id !== userId
                                                        )
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#767586] shadow-sm">
                                        Chưa có gợi ý kết bạn phù hợp.
                                    </div>
                                )}

                                {hasMoreSuggestions && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            type="button"
                                            disabled={isLoadingMore}
                                            onClick={() => void handleLoadMore()}
                                            className="flex items-center gap-2 rounded-full bg-white px-9 py-3 text-sm font-semibold text-[#4648d4] shadow-sm transition hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                            {isLoadingMore
                                                ? "Đang tải..."
                                                : "Khám phá thêm gợi ý"}
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
