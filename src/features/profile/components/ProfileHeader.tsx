import {
    Camera,
    Edit3,
    Ellipsis,
    FileText,
    Image,
    Info,
    LayoutGrid,
    MessageCircle,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";

import type { CurrentUser, UserProfile } from "../../../api/user.api";
import type { Friendship } from "../../../api/friend.api";
import { getNameInitials, getUserDisplayName } from "../../../utils/user";

type ProfileHeaderProps = {
    currentUser: CurrentUser | null;
    profile: UserProfile | null;
    isOwnProfile: boolean;
    relationship: Friendship | null;
    isRelationshipLoading: boolean;
    onSendFriendRequest: () => Promise<void>;
    onAcceptFriendRequest: () => Promise<void>;
    onRejectFriendRequest: () => Promise<void>;
    onCancelFriendRequest: () => Promise<void>;
    onRemoveFriend: () => Promise<void>;
    onEditProfile: () => void;
    onUploadAvatar: (file: File) => Promise<void>;
    onUploadCover: (file: File) => Promise<void>;
    isUploadingAvatar: boolean;
    isUploadingCover: boolean;
    uploadError: string;
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
};

export type ProfileTab =
    | "posts"
    | "about"
    | "friends"
    | "media"
    | "saved"
    | "community";

const tabs = [
    { id: "posts", label: "Bài viết", icon: FileText },
    { id: "about", label: "Giới thiệu", icon: Info },
    { id: "friends", label: "Bạn bè", icon: Users },
    { id: "media", label: "Ảnh & Video", icon: Image },
    { id: "saved", label: "Đã lưu", icon: LayoutGrid },
    { id: "community", label: "Cộng đồng", icon: MessageCircle },
] satisfies Array<{ id: ProfileTab; label: string; icon: typeof FileText }>;

export default function ProfileHeader({
    currentUser,
    profile,
    isOwnProfile,
    relationship,
    isRelationshipLoading,
    onSendFriendRequest,
    onAcceptFriendRequest,
    onRejectFriendRequest,
    onCancelFriendRequest,
    onRemoveFriend,
    onEditProfile,
    onUploadAvatar,
    onUploadCover,
    isUploadingAvatar,
    isUploadingCover,
    uploadError,
    activeTab,
    onTabChange,
}: ProfileHeaderProps) {
    const displayName = profile?.display_name || getUserDisplayName(currentUser);
    const username =
        profile?.user_name ||
        currentUser?.user_name ||
        "user";
    const avatarUrl = profile?.avatar || currentUser?.avatar;
    const initials = getNameInitials(displayName);
    const isIncomingRequest =
        relationship?.status === "pending" &&
        relationship.addressee_id === currentUser?.id;
    const isOutgoingRequest =
        relationship?.status === "pending" &&
        relationship.requester_id === currentUser?.id;
    const isAcceptedFriend =
        relationship?.status === "accepted";
    const isBlocked =
        relationship?.status === "blocked";

    return (
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-56 overflow-hidden sm:h-72 lg:h-96">
                {profile?.cover_image ? (
                    <img
                        src={profile.cover_image}
                        alt="Ảnh bìa trang cá nhân"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#3537ad] via-[#5f62e9] to-[#57dffe]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/60 via-transparent to-black/10" />
                {isOwnProfile && (
                    <label
                        className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#131b2e] shadow-md backdrop-blur-md transition hover:bg-white sm:bottom-6 sm:right-6 ${isUploadingCover ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
                    >
                        <Camera className="h-4 w-4" />
                        {isUploadingCover ? "Đang tải ảnh bìa..." : "Chỉnh sửa ảnh bìa"}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={isUploadingCover}
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) void onUploadCover(file);
                                event.target.value = "";
                            }}
                        />
                    </label>
                )}
            </div>

            <div className="relative px-5 pb-4 sm:px-10">
                <div className="flex flex-col gap-4 pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="relative -mt-16 h-32 w-32 shrink-0 rounded-full bg-white p-1 sm:-mt-20 sm:h-40 sm:w-40">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="h-full w-full rounded-full object-cover ring-4 ring-[#eef0ff]"
                                />
                            ) : (
                                <div className="grid h-full w-full place-items-center rounded-full bg-[#e8e9ff] text-3xl font-bold text-[#4648d4] ring-4 ring-[#eef0ff]">
                                    {initials}
                                </div>
                            )}
                            {isOwnProfile && (
                                <label
                                    aria-label="Thay đổi ảnh đại diện"
                                    className={`absolute bottom-1 left-1 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-[#4648d4] text-white shadow-md sm:bottom-2 ${isUploadingAvatar ? "pointer-events-none opacity-70" : "cursor-pointer hover:bg-[#3d3fc2]"}`}
                                >
                                    <Camera className="h-4 w-4" />
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="hidden"
                                        disabled={isUploadingAvatar}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) void onUploadAvatar(file);
                                            event.target.value = "";
                                        }}
                                    />
                                </label>
                            )}
                            <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-4 border-white bg-[#57dffe]" />
                        </div>

                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-[#131b2e]">
                                    {displayName}
                                </h1>
                                <span className="rounded-md bg-[#f2f3ff] px-2 py-1 text-[10px] font-semibold text-[#4648d4]">
                                    @{username}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:pb-1">
                        {isOwnProfile && (
                            <>
                                <button className="flex items-center gap-2 rounded-xl bg-[#4648d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d3fc2]">
                                    <Edit3 className="h-4 w-4" />
                                    Đăng bài mới
                                </button>
                                <button
                                    type="button"
                                    onClick={onEditProfile}
                                    disabled={!profile}
                                    className="flex items-center gap-2 rounded-xl bg-[#f2f3ff] px-5 py-3 text-sm font-semibold text-[#464554] transition hover:bg-[#e8e9fb] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Chỉnh sửa hồ sơ
                                </button>
                            </>
                        )}
                        {!isOwnProfile && profile && (
                            <>
                                {isIncomingRequest ? (
                                    <>
                                        <button
                                            type="button"
                                            disabled={isRelationshipLoading}
                                            onClick={() => void onAcceptFriendRequest()}
                                            className="rounded-xl bg-[#4648d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d3fc2] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isRelationshipLoading
                                                ? "Đang xử lý..."
                                                : "Chấp nhận"}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isRelationshipLoading}
                                            onClick={() => void onRejectFriendRequest()}
                                            className="rounded-xl bg-[#f2f3ff] px-5 py-3 text-sm font-semibold text-[#464554] transition hover:bg-[#e8e9fb] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Từ chối
                                        </button>
                                    </>
                                ) : isOutgoingRequest ? (
                                    <button
                                        type="button"
                                        disabled={isRelationshipLoading}
                                        onClick={() => void onCancelFriendRequest()}
                                        className="rounded-xl bg-[#f2f3ff] px-5 py-3 text-sm font-semibold text-[#464554] transition hover:bg-[#e8e9fb] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isRelationshipLoading
                                            ? "Đang xử lý..."
                                            : "Hủy lời mời"}
                                    </button>
                                ) : isAcceptedFriend ? (
                                    <button
                                        type="button"
                                        disabled={isRelationshipLoading}
                                        onClick={() => void onRemoveFriend()}
                                        className="flex items-center gap-2 rounded-xl bg-[#f2f3ff] px-5 py-3 text-sm font-semibold text-[#464554] transition hover:bg-[#e8e9fb] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <UserCheck className="h-4 w-4" />
                                        {isRelationshipLoading
                                            ? "Đang xử lý..."
                                            : "Bạn bè"}
                                    </button>
                                ) : isBlocked ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="flex items-center gap-2 rounded-xl bg-[#e8e9fb] px-5 py-3 text-sm font-semibold text-[#767586] disabled:cursor-not-allowed"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Không thể kết bạn
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => void onSendFriendRequest()}
                                        disabled={isRelationshipLoading}
                                        className="flex items-center gap-2 rounded-xl bg-[#4648d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d3fc2] disabled:cursor-not-allowed disabled:bg-[#e8e9fb] disabled:text-[#767586]"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        {isRelationshipLoading
                                            ? "Đang gửi..."
                                            : "Kết bạn"}
                                    </button>
                                )}
                            </>
                        )}
                        <button aria-label="Tùy chọn khác" className="grid h-11 w-11 place-items-center rounded-xl bg-[#f2f3ff] text-[#464554] hover:bg-[#e8e9fb]">
                            <Ellipsis className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {isOwnProfile && uploadError && (
                    <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600">
                        {uploadError}
                    </p>
                )}

                <p className="max-w-3xl text-sm leading-6 text-[#464554]">
                    {profile?.bio || "Người dùng chưa cập nhật phần giới thiệu."}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#eef0ff] py-5 text-sm text-[#464554]">
                    {[
                        [String(profile?.friend_count ?? 0), "bạn bè"],
                        [String(profile?.follower_count ?? 0), "người theo dõi"],
                        [String(profile?.following_count ?? 0), "đang theo dõi"],
                        [String(profile?.post_count ?? 0), "bài viết"],
                    ].map(([value, label], index) => (
                        <div key={label} className="flex items-baseline gap-1.5">
                            {index > 0 && <span className="mr-3 hidden h-1 w-1 rounded-full bg-[#c7c4d7] sm:block" />}
                            <strong className="text-lg text-[#131b2e]">{value}</strong>
                            <span className="text-xs">{label}</span>
                        </div>
                    ))}
                </div>

                <nav
                    role="tablist"
                    aria-label="Nội dung trang cá nhân"
                    className="flex gap-2 overflow-x-auto pt-3 [scrollbar-width:none]"
                >
                    {tabs.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab === id;

                        return (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onTabChange(id)}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-[#f2f3ff] text-[#4648d4]" : "text-[#464554] hover:bg-[#faf8ff]"}`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                            {label === "Bạn bè" && (
                                <span className="rounded bg-[#e7e8ff] px-1.5 py-0.5 text-[10px]">
                                    {profile?.friend_count ?? 0}
                                </span>
                            )}
                        </button>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
}
