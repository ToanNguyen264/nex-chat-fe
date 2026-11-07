import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LogIn, UserPlus } from "lucide-react";

import ProfileCard from "./ProfileCard";
import { getUserProfile } from "../../api/user.api";
import type { CurrentUser, UserProfile } from "../../api/user.api";
import { getUserDisplayName } from "../../utils/user";

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
                console.error(
                    "Không thể tải thống kê hồ sơ:",
                    error
                );
            });

        return () => {
            isActive = false;
        };
    }, [currentUser]);

    if (!currentUser) {
        return (
            <section className="rounded-2xl border border-transparent dark:border-[#263147] bg-white dark:bg-[#151c2c] p-5 shadow-sm transition-colors">
                <div className="flex flex-col items-center text-center">
                    <img src="/logo.svg" alt="Nex Chat" className="h-14 w-14 rounded-full mb-3" />
                    <h2 className="text-base font-bold text-[#131b2e] dark:text-slate-100">
                        Chào mừng đến với Nex Chat!
                    </h2>
                    <p className="mt-1.5 text-xs text-[#767586] dark:text-slate-400">
                        Đăng nhập để kết nối bạn bè, chia sẻ khoảnh khắc và nhắn tin tức thì.
                    </p>

                    <div className="mt-4 flex w-full flex-col gap-2">
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#4648d4] dark:bg-[#5d5fee] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            <LogIn className="h-4 w-4" />
                            Đăng nhập ngay
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#f2f3ff] dark:bg-[#1e293b] py-2.5 text-xs font-semibold text-[#4648d4] dark:text-indigo-400 transition hover:bg-[#e8e9fb] dark:hover:bg-[#283548]"
                        >
                            <UserPlus className="h-4 w-4" />
                            Tạo tài khoản mới
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <ProfileCard
            userId={currentUser?.id}
            avatar={profile?.avatar || currentUser?.avatar}
            name={profile?.display_name || displayName}
            username={
                currentUser?.user_name
                    ? `@${currentUser.user_name}`
                    : "@user"
            }
            postCount={profile?.post_count ?? 0}
            followerCount={profile?.follower_count ?? 0}
            followingCount={profile?.following_count ?? 0}
        />
    );
}
