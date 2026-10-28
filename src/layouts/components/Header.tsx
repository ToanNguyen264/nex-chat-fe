import { useEffect, useRef, useState } from "react";
import {
    Bell,
    ChevronDown,
    LogOut,
    Moon,
    Search,
    Sun,
    UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTheme } from "next-themes";


import { logout } from "../../api/auth.api";
import { getUnreadNotificationCount } from "../../api/notification.api";
import type { CurrentUser } from "../../api/user.api";
import { getUserDisplayName } from "../../utils/user";
import defaultAvatar from "../../assets/default-avatar.png";
import NotificationPopover from "../../features/notifications/components/NotificationPopover";
import { useNotificationStore } from "../../features/notifications/notification.store";
import { usePresenceStore } from "../../features/presence/presence.store";
import { disconnectSocket } from "../../socket/socket";
import { queryClient } from "../../lib/query-client";
import { useChatStore } from "../../features/chat/chat.store";
import { useFeedRealtimeStore } from "../../features/feed/feed-realtime.store";


const navItems = [
    { label: "Bảng tin", to: "/home" },
    { label: "Khám phá", to: "/friends" },
];

type HeaderProps = {
    currentUser: CurrentUser | null;
};

export default function Header({ currentUser }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const menuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const displayName = getUserDisplayName(currentUser);
    const isCurrentUserOnline = usePresenceStore((state) =>
        currentUser ? state.onlineUserIds.has(currentUser.id) : false
    );

    const unreadCount = useNotificationStore((state) => state.unreadCount); //lấy uneadCount từ store
    const setUnreadCount = useNotificationStore(
        (state) => state.setUnreadCount
    );
    const resetUnread = useNotificationStore((state) => state.resetUnread);

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    useEffect(() => {
        if (!currentUser) return;

        let isActive = true;

        getUnreadNotificationCount()
            .then((count) => {
                if (isActive) setUnreadCount(count);
            })
            .catch((error) => {
                console.error("Không thể tải số thông báo chưa đọc:", error);
            });

        return () => {
            isActive = false;
        };
    }, [currentUser, setUnreadCount]);

    useEffect(() => {
        if (!isAccountMenuOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsAccountMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsAccountMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isAccountMenuOpen]);

    useEffect(() => {
        if (!isNotificationOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsNotificationOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isNotificationOpen]);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);
            await logout();
        } catch (error) {
            console.error("Không thể thu hồi refresh token:", error);
        } finally {
            localStorage.removeItem("accessToken");
            queryClient.clear();
            disconnectSocket();
            resetUnread();
            useChatStore.getState().resetChat();
            useFeedRealtimeStore.getState().resetFeedRealtime();
            usePresenceStore.getState().resetPresence();
            setIsNotificationOpen(false);
            setIsAccountMenuOpen(false);
            navigate("/", { replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-[#eef0ff] dark:border-[#263147] bg-white/95 dark:bg-[#151c2c]/95 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur transition-colors duration-200">
            <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
                <Link to="/home" className="flex shrink-0 items-center gap-2">
                    <img src="/logo.svg" alt="Nex Chat" className="h-8 w-8 rounded-sm" />
                    <span className="text-xl font-bold tracking-[-0.4px] text-[#4648d4] dark:text-indigo-400">Nex Chat</span>
                </Link>

                <label className="hidden h-[34px] w-[323px] items-center gap-2 rounded-full bg-[#f2f3ff] dark:bg-[#1e293b] px-4 md:flex">
                    <Search className="h-4 w-4 shrink-0 text-[#767586] dark:text-slate-400" />
                    <input
                        id="global-search"
                        name="globalSearch"
                        type="search"
                        placeholder="Tìm kiếm bạn bè, bài viết, hashtag..."
                        className="min-w-0 flex-1 bg-transparent text-xs text-[#131b2e] dark:text-slate-100 outline-none placeholder:text-[#8b8998] dark:placeholder:text-slate-400"
                    />
                </label>

                <nav className="hidden items-center justify-center rounded-full bg-[#f2f3ff] dark:bg-[#1e293b] p-1 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                location.pathname === item.to
                                    ? "bg-[#4648d4] text-white shadow-sm"
                                    : "text-[#464554] dark:text-slate-300 hover:text-[#4648d4] dark:hover:text-indigo-400"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                        title={isDark ? "Chế độ sáng" : "Chế độ tối"}
                        className="rounded-full p-2 text-[#464554] dark:text-slate-300 transition hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b] hover:text-[#4648d4] dark:hover:text-amber-300"
                    >
                        {isDark ? (
                            <Sun className="h-[18px] w-[18px] text-amber-400" />
                        ) : (
                            <Moon className="h-[18px] w-[18px]" />
                        )}
                    </button>

                    <div ref={notificationRef} className="relative">
                        <button
                            type="button"
                            aria-label="Mở thông báo"
                            aria-haspopup="dialog"
                            aria-expanded={isNotificationOpen}
                            onClick={() => {
                                setIsNotificationOpen((isOpen) => !isOpen);
                                setIsAccountMenuOpen(false);
                            }}
                            className={`relative rounded-full p-2 text-[#464554] dark:text-slate-300 transition hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b] ${isNotificationOpen ? "bg-[#f2f3ff] dark:bg-[#1e293b] text-[#4648d4] dark:text-indigo-400" : ""}`}
                        >
                            <Bell className="h-[18px] w-[18px]" />
                            {unreadCount > 0 && (
                                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#b90538] px-1 text-[9px] font-bold text-white">
                                    {unreadCount > 99 ? "+99" : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <NotificationPopover
                                onClose={() => setIsNotificationOpen(false)}
                            />
                        )}
                    </div>

                    <div ref={menuRef} className="relative ml-1">
                        <button
                            type="button"
                            aria-label="Mở menu tài khoản"
                            aria-haspopup="menu"
                            aria-expanded={isAccountMenuOpen}
                            onClick={() => {
                                setIsAccountMenuOpen((isOpen) => !isOpen);
                                setIsNotificationOpen(false);
                            }}
                            className="flex items-center gap-1 rounded-full p-1 transition hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
                        >
                            <span className="relative">
                                <img
                                    src={currentUser?.avatar || defaultAvatar}
                                    alt={displayName}
                                    className="h-8 w-8 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                    }}
                                />
                                {isCurrentUserOnline && (
                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#151c2c] bg-[#57dffe]" />
                                )}
                            </span>
                            <ChevronDown
                                className={`h-3 w-3 text-[#767586] dark:text-slate-400 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isAccountMenuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-[#e4e6f7] dark:border-[#263147] bg-white dark:bg-[#151c2c] p-2 shadow-[0_16px_45px_rgba(27,31,59,0.16)]"
                            >
                                <div className="border-b border-[#eef0ff] dark:border-[#263147] px-3 py-3">
                                    <p className="truncate text-sm font-bold text-[#131b2e] dark:text-slate-100">
                                        {displayName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-[#767586] dark:text-slate-400">
                                        {currentUser?.email ?? "Tài khoản Pulse"}
                                    </p>
                                </div>

                                <Link
                                    to="/profile"
                                    role="menuitem"
                                    onClick={() => setIsAccountMenuOpen(false)}
                                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#343343] dark:text-slate-200 transition hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b]"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e9ff] dark:bg-indigo-950/60 text-[#4648d4] dark:text-indigo-400">
                                        <UserRound className="h-4 w-4" />
                                    </span>
                                    Thông tin cá nhân
                                </Link>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#343343] dark:text-slate-200 transition hover:bg-[#f2f3ff] dark:hover:bg-[#1e293b]"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e9ff] dark:bg-indigo-950/60 text-[#4648d4] dark:text-amber-400">
                                            {isDark ? (
                                                <Sun className="h-4 w-4" />
                                            ) : (
                                                <Moon className="h-4 w-4" />
                                            )}
                                        </span>
                                        Giao diện: {isDark ? "Tối" : "Sáng"}
                                    </span>
                                    <span
                                        className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                                            isDark ? "bg-[#4648d4]" : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                isDark ? "translate-x-4" : "translate-x-0"
                                            }`}
                                        />
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    disabled={isLoggingOut}
                                    onClick={() => void handleLogout()}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#b90538] dark:text-rose-400 transition hover:bg-[#fff0f1] dark:hover:bg-rose-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffdadb] dark:bg-rose-950/60 text-[#b90538] dark:text-rose-400">
                                        <LogOut className="h-4 w-4" />
                                    </span>
                                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
