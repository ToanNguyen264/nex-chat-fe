import { useEffect, useState } from "react";

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
