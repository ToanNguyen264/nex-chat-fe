import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
    BriefcaseBusiness,
    CalendarDays,
    GraduationCap,
    Link2,
    MapPin,
    Image as ImageIcon,
    Users,
} from "lucide-react";
import type { UserProfile, UserMediaItem } from "../../../api/user.api";
import { getUserMedia } from "../../../api/user.api";
import { getFriends, type FriendListItem } from "../../../api/friend.api";
import type { ProfileTab } from "./ProfileHeader";
import defaultAvatar from "../../../assets/default-avatar.png";

function CardTitle({
    children,
    action,
    onAction,
}: {
    children: ReactNode;
    action?: string;
    onAction?: () => void;
}) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#131b2e] dark:text-slate-100">
                {children}
            </h2>
            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="text-xs font-semibold text-[#4648d4] hover:underline cursor-pointer"
                >
                    {action}
                </button>
            )}
        </div>
    );
}

const getFriendDisplayName = (friend: FriendListItem["friend"]) => {
    const fullName = [friend.first_name, friend.last_name]
        .filter(Boolean)
        .join(" ");

    return fullName || friend.user_name || "Người dùng";
};

type ProfileDetailsProps = {
    profile: UserProfile | null;
    isOwnProfile: boolean;
    onEditProfile: () => void;
    onTabChange?: (tab: ProfileTab) => void;
};

export default function ProfileDetails({
    profile,
    isOwnProfile,
    onEditProfile,
    onTabChange,
}: ProfileDetailsProps) {
    const [recentPhotos, setRecentPhotos] = useState<UserMediaItem[]>([]);
    const [isPhotosLoading, setIsPhotosLoading] = useState(true);

    const [friends, setFriends] = useState<FriendListItem[]>([]);
    const [isFriendsLoading, setIsFriendsLoading] = useState(true);

    useEffect(() => {
        if (!profile?.id) return;

        let cancelled = false;

        const loadRecentPhotos = async () => {
            setIsPhotosLoading(true);
            try {
                const photos = await getUserMedia(profile.id, "image", 9);
                if (!cancelled) {
                    setRecentPhotos(photos);
                }
            } catch (err) {
                console.error("Không thể tải ảnh gần đây:", err);
            } finally {
                if (!cancelled) {
                    setIsPhotosLoading(false);
                }
            }
        };

        const loadProfileFriends = async () => {
            setIsFriendsLoading(true);
            try {
                const friendList = await getFriends(profile.id);
                if (!cancelled) {
                    setFriends(friendList);
                }
            } catch (err) {
                console.error("Không thể tải danh sách bạn bè:", err);
            } finally {
                if (!cancelled) {
                    setIsFriendsLoading(false);
                }
            }
        };

        void loadRecentPhotos();
        void loadProfileFriends();

        return () => {
            cancelled = true;
        };
    }, [profile?.id]);

    const details = [
        {
            icon: BriefcaseBusiness,
            text: profile?.workplace ? (
                <>Làm việc tại <strong>{profile.workplace}</strong></>
            ) : (
                <>Chưa cập nhật nơi làm việc</>
            ),
        },
        {
            icon: GraduationCap,
            text: profile?.education ? (
                <>Từng học tại <strong>{profile.education}</strong></>
            ) : (
                <>Chưa cập nhật học vấn</>
            ),
        },
        {
            icon: MapPin,
            text: profile?.location ? (
                <>Sống tại <strong>{profile.location}</strong></>
            ) : (
                <>Chưa cập nhật nơi sống</>
            ),
        },
        {
            icon: CalendarDays,
            text: (
                <>Tham gia từ {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("vi-VN") : "..."}</>
            ),
        },
        {
            icon: Link2,
            text: profile?.website ? (
                <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#4648d4] hover:underline"
                >
                    {profile.website}
                </a>
            ) : (
                "Chưa cập nhật website"
            ),
        },
    ];

    return (
        <aside className="flex flex-col gap-5">
            {/* Giới thiệu */}
            <section className="rounded-2xl bg-white dark:bg-[#151c2c] p-6 shadow-sm border border-slate-100 dark:border-[#263147]">
                <CardTitle
                    action={isOwnProfile ? "Chỉnh sửa" : undefined}
                    onAction={isOwnProfile ? onEditProfile : undefined}
                >
                    Giới thiệu
                </CardTitle>
                <ul className="space-y-3">
                    {details.map(({ icon: Icon, text }, index) => (
                        <li key={index} className="flex items-center gap-3 text-xs leading-5 text-[#464554] dark:text-slate-300">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f2f3ff] dark:bg-[#1e293b] text-[#4648d4] dark:text-indigo-400">
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 break-words">{text}</span>
                        </li>
                    ))}
                </ul>
                {isOwnProfile && (
                    <button
                        type="button"
                        onClick={onEditProfile}
                        className="mt-5 w-full rounded-xl bg-[#f2f3ff] dark:bg-[#1e293b] py-3 text-xs font-semibold text-[#464554] dark:text-slate-200 hover:bg-[#e8e9fb] dark:hover:bg-[#283548] transition cursor-pointer"
                    >
                        Chỉnh sửa chi tiết công khai
                    </button>
                )}
            </section>

            {/* Ảnh gần đây */}
            <section className="rounded-2xl bg-white dark:bg-[#151c2c] p-6 shadow-sm border border-slate-100 dark:border-[#263147]">
                <CardTitle
                    action={recentPhotos.length > 0 ? "Xem tất cả" : undefined}
                    onAction={() => onTabChange?.("media")}
                >
                    Ảnh gần đây
                </CardTitle>

                {isPhotosLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                            />
                        ))}
                    </div>
                ) : recentPhotos.length === 0 ? (
                    <div className="rounded-xl bg-[#f8f8ff] dark:bg-[#1e293b] px-4 py-8 text-center text-xs text-[#767586] dark:text-slate-400">
                        <ImageIcon className="mx-auto mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
                        Chưa có ảnh nào để hiển thị.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {recentPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                            >
                                <img
                                    src={photo.file_url}
                                    alt={photo.file_name || "Ảnh bài viết"}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Bạn bè */}
            <section className="rounded-2xl bg-white dark:bg-[#151c2c] p-6 shadow-sm border border-slate-100 dark:border-[#263147]">
                <CardTitle
                    action={friends.length > 0 ? "Xem tất cả" : undefined}
                    onAction={() => onTabChange?.("friends")}
                >
                    Bạn bè
                </CardTitle>
                <p className="-mt-3 mb-4 text-xs text-[#767586] dark:text-slate-400">
                    {friends.length} bạn bè
                </p>

                {isFriendsLoading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 animate-pulse">
                                <div className="aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
                                <div className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : friends.length === 0 ? (
                    <div className="rounded-xl bg-[#f8f8ff] dark:bg-[#1e293b] px-4 py-8 text-center text-xs text-[#767586] dark:text-slate-400">
                        <Users className="mx-auto mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
                        Chưa có bạn bè nào để hiển thị.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {friends.slice(0, 9).map(({ friend }) => {
                            const friendName = getFriendDisplayName(friend);

                            return (
                                <Link
                                    key={friend.id}
                                    to={`/profile/${friend.id}`}
                                    className="group flex flex-col items-center text-center focus:outline-none"
                                >
                                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 transition group-hover:ring-[#4648d4]">
                                        <img
                                            src={friend.avatar || defaultAvatar}
                                            alt={friendName}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                                            }}
                                        />
                                    </div>
                                    <span className="mt-1.5 line-clamp-1 w-full text-[11px] font-semibold text-[#131b2e] dark:text-slate-200 group-hover:text-[#4648d4] dark:group-hover:text-indigo-400">
                                        {friendName}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </aside>
    );
}
