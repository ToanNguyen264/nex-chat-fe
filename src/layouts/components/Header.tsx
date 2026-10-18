import { useEffect, useRef, useState } from "react";
import {
    Bell,
    ChevronDown,
    LogOut,
    MessageSquare,
    Search,
    UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import pulseLogo from "../../assets/home/pulse-logo.png";
import { logout } from "../../api/auth.api";
import { getUnreadNotificationCount } from "../../api/notification.api";
import type { CurrentUser } from "../../api/user.api";
import { getNameInitials, getUserDisplayName } from "../../utils/user";
import NotificationPopover from "../../features/notifications/components/NotificationPopover";
import { useNotificationStore } from "../../features/notifications/notification.store";
import { usePresenceStore } from "../../features/presence/presence.store";
import { disconnectSocket } from "../../socket/socket";


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
    const menuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const displayName = getUserDisplayName(currentUser);
    const initials = getNameInitials(displayName);
    const isCurrentUserOnline = usePresenceStore((state) =>
        currentUser ? state.onlineUserIds.has(currentUser.id) : false
    );

    const unreadCount = useNotificationStore((state) => state.unreadCount); //lấy uneadCount từ store
    const setUnreadCount = useNotificationStore(
        (state) => state.setUnreadCount
    );
    const resetUnread = useNotificationStore((state) => state.resetUnread);

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
            disconnectSocket();
            resetUnread();
            setIsNotificationOpen(false);
            setIsAccountMenuOpen(false);
            navigate("/", { replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-[#eef0ff] bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur">
            <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
                <Link to="/home" className="flex shrink-0 items-center gap-2">
                    <img src={pulseLogo} alt="Pulse" className="h-8 w-8 rounded-sm" />
                    <span className="text-xl font-bold tracking-[-0.4px] text-[#4648d4]">Pulse</span>
                </Link>

                <label className="hidden h-[34px] w-[323px] items-center gap-2 rounded-full bg-[#f2f3ff] px-4 md:flex">
                    <Search className="h-4 w-4 shrink-0 text-[#767586]" />
                    <input
                        id="global-search"
                        name="globalSearch"
                        type="search"
                        placeholder="Tìm kiếm bạn bè, bài viết, hashtag..."
                        className="min-w-0 flex-1 bg-transparent text-xs text-[#131b2e] outline-none placeholder:text-[#8b8998]"
                    />
                </label>

                <nav className="hidden items-center justify-center rounded-full bg-[#f2f3ff] p-1 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                location.pathname === item.to
                                    ? "bg-[#4648d4] text-white shadow-sm"
                                    : "text-[#464554] hover:text-[#4648d4]"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <button type="button" aria-label="Tin nhắn" className="relative rounded-full p-2 text-[#464554] hover:bg-[#f2f3ff]">
                        <MessageSquare className="h-[18px] w-[18px]" />
                        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#b90538] px-1 text-[9px] font-bold text-white">2</span>
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
                            className={`relative rounded-full p-2 text-[#464554] transition hover:bg-[#f2f3ff] ${isNotificationOpen ? "bg-[#f2f3ff] text-[#4648d4]" : ""}`}
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
                            className="flex items-center gap-1 rounded-full p-1 transition hover:bg-[#f2f3ff] focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
                        >
                            <span className="relative">
                                {currentUser?.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={displayName}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e9ff] text-[10px] font-bold text-[#4648d4]">
                                        {initials}
                                    </span>
                                )}
                                {isCurrentUserOnline && (
                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#57dffe]" />
                                )}
                            </span>
                            <ChevronDown
                                className={`h-3 w-3 text-[#767586] transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isAccountMenuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-[#e4e6f7] bg-white p-2 shadow-[0_16px_45px_rgba(27,31,59,0.16)]"
                            >
                                <div className="border-b border-[#eef0ff] px-3 py-3">
                                    <p className="truncate text-sm font-bold text-[#131b2e]">
                                        {displayName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-[#767586]">
                                        {currentUser?.email ?? "Tài khoản Pulse"}
                                    </p>
                                </div>

                                <Link
                                    to="/profile"
                                    role="menuitem"
                                    onClick={() => setIsAccountMenuOpen(false)}
                                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#343343] transition hover:bg-[#f2f3ff]"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e9ff] text-[#4648d4]">
                                        <UserRound className="h-4 w-4" />
                                    </span>
                                    Thông tin cá nhân
                                </Link>

                                <button
                                    type="button"
                                    role="menuitem"
                                    disabled={isLoggingOut}
                                    onClick={() => void handleLogout()}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#b90538] transition hover:bg-[#fff0f1] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffdadb] text-[#b90538]">
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
