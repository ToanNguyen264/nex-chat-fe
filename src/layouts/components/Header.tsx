import { useEffect, useRef, useState } from "react";
import {
    Bell,
    ChevronDown,
    Home,
    LogOut,
    Moon,
    Search,
    Sun,
    UserRound,
    Users,
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
    { label: "Bảng tin", to: "/home", icon: Home },
    { label: "Bạn bè", to: "/friends", icon: Users },
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

    const unreadCount = useNotificationStore((state) => state.unreadCount);
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
        <header className="sticky top-0 z-40 h-14 border-b border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-none transition-colors duration-200">
            <div className="mx-auto grid h-full w-full max-w-[1280px] grid-cols-[auto_1fr_auto] xl:grid-cols-[286px_minmax(0,596px)_286px] items-center px-4 sm:px-6 lg:px-8 gap-4 xl:gap-6">
                {/* CỘT TRÁI: KHỚP VỚI CỘT SIDEBAR TRÁI (286px) */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <Link to="/home" className="flex shrink-0 items-center gap-2" aria-label="Nex Chat Trang chủ">
                        <img src="/logo.svg" alt="Nex Chat" className="h-10 w-10 rounded-full" />
                        <span className="hidden sm:inline text-xl font-bold tracking-tight text-[#4648d4] dark:text-[#5d5fee]">
                            Nex Chat
                        </span>
                    </Link>

                    <label className="hidden md:flex h-10 min-w-0 flex-1 max-w-[145px] xl:max-w-[155px] items-center gap-2 rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3 transition-colors">
                        <Search className="h-4 w-4 shrink-0 text-[#65676b] dark:text-[#b0b3b8]" />
                        <input
                            id="global-search"
                            name="globalSearch"
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#050505] dark:text-[#e4e6eb] outline-none placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8]"
                        />
                    </label>
                </div>

                {/* CỘT GIỮA: CĂN THẲNG TRỤC CHÍNH XÁC VỚI BẢNG TIN FEED (596px) */}
                <nav className="flex items-center justify-center h-full w-full px-2">
                    {navItems.map((item) => {
                        const isActive =
                            item.to === "/home"
                                ? location.pathname === "/home" || location.pathname === "/"
                                : location.pathname.startsWith("/friends");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                title={item.label}
                                aria-label={item.label}
                                className="group relative flex h-full flex-1 max-w-[140px] items-center justify-center cursor-pointer"
                            >
                                <div
                                    className={`flex h-[46px] w-full items-center justify-center rounded-xl transition ${
                                        isActive
                                            ? ""
                                            : "hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
                                    }`}
                                >
                                    <Icon
                                        className={`h-6 w-6 transition ${
                                            isActive
                                                ? "text-[#4648d4] dark:text-[#5d5fee]"
                                                : "text-[#65676b] dark:text-[#b0b3b8] group-hover:text-[#050505] dark:group-hover:text-[#e4e6eb]"
                                        }`}
                                    />
                                </div>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm bg-[#4648d4] dark:bg-[#5d5fee]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* CỘT PHẢI: CÂN BẰNG VỚI CỘT PHẢI (286px) */}
                <div className="flex items-center justify-end gap-2">
                    {/* Nút Đổi giao diện Sáng / Tối */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                        title={isDark ? "Chế độ sáng" : "Chế độ tối"}
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] transition hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50]"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5 text-amber-400" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {currentUser ? (
                        <>
                            {/* Nút Chuông Thông báo */}
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
                                    className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
                                        isNotificationOpen
                                            ? "bg-[#e8e9ff] dark:bg-[#313264] text-[#4648d4] dark:text-[#5d5fee]"
                                            : "bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50]"
                                    }`}
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e41e3f] px-1 text-[11px] font-bold text-white border-2 border-white dark:border-[#242526]">
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

                            {/* Nút Avatar tài khoản có mũi tên nhỏ ở góc đúng style FB */}
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
                                    className="relative flex items-center rounded-full p-0.5 transition hover:brightness-95 focus:outline-none"
                                >
                                    <img
                                        src={currentUser?.avatar || defaultAvatar}
                                        alt={displayName}
                                        className="h-10 w-10 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                        }}
                                    />
                                    {isCurrentUserOnline && (
                                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#242526] bg-[#57dffe]" />
                                    )}
                                    <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] border-2 border-white dark:border-[#242526] text-[#050505] dark:text-[#e4e6eb]">
                                        <ChevronDown className={`h-2.5 w-2.5 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
                                    </span>
                                </button>

                                {isAccountMenuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] p-2 shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                                    >
                                        <div className="border-b border-[#e4e6eb] dark:border-[#393a3b] px-3 py-3">
                                            <p className="truncate text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                                                {displayName}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                                {currentUser?.email ?? "Tài khoản Nex"}
                                            </p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            role="menuitem"
                                            onClick={() => setIsAccountMenuOpen(false)}
                                            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#050505] dark:text-[#e4e6eb] transition hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
                                        >
                                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]">
                                                <UserRound className="h-4 w-4" />
                                            </span>
                                            Thông tin cá nhân
                                        </Link>

                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={toggleTheme}
                                            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#050505] dark:text-[#e4e6eb] transition hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]">
                                                    {isDark ? (
                                                        <Sun className="h-4 w-4 text-amber-400" />
                                                    ) : (
                                                        <Moon className="h-4 w-4" />
                                                    )}
                                                </span>
                                                Chế độ tối: {isDark ? "Bật" : "Tắt"}
                                            </span>
                                            <span
                                                className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                                                    isDark ? "bg-[#4648d4]" : "bg-[#ccd0d5]"
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
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#e41e3f] transition hover:bg-[#ffebe8] dark:hover:bg-[#3d1e22] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffebe8] dark:bg-[#3d1e22] text-[#e41e3f]">
                                                <LogOut className="h-4 w-4" />
                                            </span>
                                            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                className="rounded-xl bg-[#4648d4] dark:bg-[#5d5fee] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="hidden sm:inline-block rounded-xl bg-[#e4e6eb] dark:bg-[#3a3b3c] px-3.5 py-2 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] transition hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50]"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
