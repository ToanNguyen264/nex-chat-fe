import { useEffect, useState } from "react";
import { BarChart3, Bookmark, Newspaper, Network } from "lucide-react";

import ProfileCard from "./ProfileCard";
import { getUserProfile } from "../../api/user.api";
import type { CurrentUser, UserProfile } from "../../api/user.api";
import { getUserDisplayName } from "../../utils/user";
const menuItems = [
    { label: "Bảng tin bạn bè", icon: Newspaper, active: true },
    { label: "Đã lưu", icon: Bookmark },
    { label: "Cộng đồng sáng tạo", icon: Network },
    { label: "Thống kê tương tác", icon: BarChart3 },
];

type SidebarProps = {
    currentUser: CurrentUser | null;
};

export default function Sidebar({ currentUser }: SidebarProps) {
    const displayName = getUserDisplayName(currentUser);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        let isActive = true;

        getUserProfile(currentUser.id)
            .then((data) => {
                if (isActive) setProfile(data);
            })
            .catch((error) => {
                console.error("Không thể tải thống kê hồ sơ:", error);
            });

        return () => {
            isActive = false;
        };
    }, [currentUser]);

    return (
        <div className="flex flex-col gap-4">
            <ProfileCard
                userId={currentUser?.id}
                avatar={profile?.avatar || currentUser?.avatar}
                name={profile?.display_name || displayName}
                username={currentUser?.user_name ? `@${currentUser.user_name}` : "@user"}
                postCount={profile?.post_count ?? 0}
                followerCount={profile?.follower_count ?? 0}
                followingCount={profile?.following_count ?? 0}
            />

            <nav className="rounded-2xl bg-white p-3 shadow-sm">
                {menuItems.map(({ label, icon: Icon, active }) => (
                    <button
                        key={label}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                            active ? "bg-[#e9e9fb] text-[#4648d4]" : "text-[#464554] hover:bg-[#f2f3ff]"
                        }`}
                    >
                        <Icon className="h-[18px] w-[18px]" />
                        <span className="flex-1">{label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
