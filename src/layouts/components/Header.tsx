import { Bell, ChevronDown, MessageSquare, Plus, Search } from "lucide-react";
import { Link } from "react-router";

import profileImage from "../../assets/home/profile-header.png";
import pulseLogo from "../../assets/home/pulse-logo.png";

const navItems = ["Bảng tin", "Khám phá", "Video", "Nhóm"];

export default function Header() {
    return (
        <header className="sticky top-0 z-40 h-16 border-b border-[#eef0ff] bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur">
            <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
                <div className="flex shrink-0 items-center gap-2">
                    <img src={pulseLogo} alt="Pulse" className="h-8 w-8 rounded-sm" />
                    <span className="text-xl font-bold tracking-[-0.4px] text-[#4648d4]">Pulse</span>
                </div>

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

                <nav className="hidden flex-1 items-center justify-center rounded-full bg-[#f2f3ff] p-1 lg:flex">
                    {navItems.map((item, index) => (
                        <Link
                            key={item}
                            to="/home"
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                index === 0
                                    ? "bg-[#4648d4] text-white shadow-sm"
                                    : "text-[#464554] hover:text-[#4648d4]"
                            }`}
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <button className="hidden items-center gap-1 rounded-full bg-[#4648d4] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3c3ec3] sm:flex">
                        <Plus className="h-3.5 w-3.5" />
                        Đăng bài
                    </button>

                    <button type="button" aria-label="Tin nhắn" className="relative rounded-full p-2 text-[#464554] hover:bg-[#f2f3ff]">
                        <MessageSquare className="h-[18px] w-[18px]" />
                        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#b90538] px-1 text-[9px] font-bold text-white">2</span>
                    </button>

                    <button type="button" aria-label="Thông báo" className="relative rounded-full p-2 text-[#464554] hover:bg-[#f2f3ff]">
                        <Bell className="h-[18px] w-[18px]" />
                        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#b90538] px-1 text-[9px] font-bold text-white">3</span>
                    </button>

                    <button type="button" className="ml-1 flex items-center gap-1">
                        <span className="relative">
                            <img src={profileImage} alt="Văn Hải Nam" className="h-8 w-8 rounded-full object-cover" />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#57dffe]" />
                        </span>
                        <ChevronDown className="h-3 w-3 text-[#767586]" />
                    </button>
                </div>
            </div>
        </header>
    );
}
