import { BarChart3, Bookmark, Newspaper, Network, TrendingUp } from "lucide-react";

import profileNam from "../../assets/home/profile-nam.png";
import ProfileCard from "./ProfileCard";
import type { CurrentUser } from "../../api/user.api";
import { getUserDisplayName } from "../../utils/user";
const menuItems = [
    { label: "Bảng tin bạn bè", icon: Newspaper, active: true },
    { label: "Đã lưu", icon: Bookmark },
    { label: "Cộng đồng sáng tạo", icon: Network, badge: "+12" },
    { label: "Thống kê tương tác", icon: BarChart3 },
];

type SidebarProps = {
    currentUser: CurrentUser | null;
};

export default function Sidebar({ currentUser }: SidebarProps) {
    const displayName = getUserDisplayName(currentUser);

    return (
        <div className="flex flex-col gap-4">
            <ProfileCard
                avatar={currentUser?.avatar || profileNam}
                name={displayName}
                username={currentUser?.user_name ? `@${currentUser.user_name}` : "@user"}
                postCount={842}
                followerCount="14.6k"
                followingCount={589}
            />

            <nav className="rounded-2xl bg-white p-3 shadow-sm">
                {menuItems.map(({ label, icon: Icon, active, badge }) => (
                    <button
                        key={label}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                            active ? "bg-[#e9e9fb] text-[#4648d4]" : "text-[#464554] hover:bg-[#f2f3ff]"
                        }`}
                    >
                        <Icon className="h-[18px] w-[18px]" />
                        <span className="flex-1">{label}</span>
                        {badge && <span className="rounded-full bg-[#b90538]/10 px-2 py-0.5 text-[10px] font-semibold text-[#b90538]">{badge}</span>}
                    </button>
                ))}
            </nav>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4648d4] to-[#665ff4] p-5 text-white shadow-[0_8px_24px_rgba(70,72,212,0.24)]">
                <div className="absolute -bottom-12 -right-8 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
                <div className="relative flex items-center justify-between">
                    <p className="text-[11px] font-medium text-white/70">PULSE INDEX</p>
                    <TrendingUp className="h-4 w-4 text-cyan-200" />
                </div>
                <strong className="relative mt-1 block text-2xl">+28.4%</strong>
                <p className="relative mt-1 max-w-[210px] text-[11px] leading-4 text-white/70">
                    Mức độ tương tác trong 24 giờ qua của bạn tăng vượt bậc.
                </p>
                <div className="relative mt-4 flex h-8 items-end gap-1.5">
                    {[12, 16, 24, 16, 28, 20, 24].map((height, index) => (
                        <span key={index} className="w-2 rounded-full bg-white/70" style={{ height }} />
                    ))}
                </div>
            </section>
        </div>
    );
}
