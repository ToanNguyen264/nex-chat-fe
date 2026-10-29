import { useEffect, useState } from "react";
import axios from "axios";

import {
    getCurrentUser,
    getUserProfile,
    updateMyAvatar,
    updateMyCoverImage,
    updateMyProfile,
} from "../api/user.api";
import type {
    CurrentUser,
    UpdateMyProfileInput,
    UserProfile,
} from "../api/user.api";
import Feed from "../features/feed/Feed";
import ProfileDetails from "../features/profile/components/ProfileDetails";
import ProfileHeader from "../features/profile/components/ProfileHeader";
import type { ProfileTab } from "../features/profile/components/ProfileHeader";
import EditProfileModal from "../features/profile/components/EditProfileModal";
import MainLayout from "../layouts/MainLayout";
import { useParams } from "react-router";
import {
    acceptFriendRequest,
    cancelFriendRequest,
    getRelationshipWithUser,
    rejectFriendRequest,
    removeFriend,
    sendFriendRequest,
} from "../api/friend.api";
import type { Friendship } from "../api/friend.api";
import { showError, showSuccess } from "../utils/swal";
import { socket } from "../socket/socket";
import type { FriendshipChangedPayload } from "../features/friends/types";
import FriendsTab from "../features/friends/components/FriendsTab";
import ProfileMediaTab from "../features/profile/components/ProfileMediaTab";

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [imageUploadError, setImageUploadError] = useState("");
    const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
    const [relationship, setRelationship] =
        useState<Friendship | null>(null);
    const [
        isRelationshipLoading,
        setIsRelationshipLoading,
    ] = useState(false);

    const { userId: routeUserId } = useParams<{ userId: string }>();

    const isOwnProfile = Boolean(
        currentUser &&
        profile &&
        currentUser.id === profile.id
    );

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            setIsLoading(true);
            setProfile(null);

            try {
                // Người đang đăng nhập
                const loggedInUser =
                    await getCurrentUser();

                if (cancelled) {
                    return;
                }

                setCurrentUser(loggedInUser);

                // Có ID trên URL thì xem người đó.
                // Không có thì xem chính mình.
                const profileUserId =
                    routeUserId ?? loggedInUser.id;

                const userProfile =
                    await getUserProfile(
                        profileUserId
                    );

                if (!cancelled) {
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error(
                    "Không thể lấy trang cá nhân:",
                    error
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, [routeUserId]);

    useEffect(() => {
        if (
            !currentUser ||
            !profile ||
            isOwnProfile
        ) {
            setRelationship(null);
            setIsRelationshipLoading(false);
            return;
        }

        const profileUserId = profile.id;
        let cancelled = false;

        async function loadRelationship() {
            setIsRelationshipLoading(true);

            try {
                const result =
                    await getRelationshipWithUser(
                        profileUserId
                    );

                if (!cancelled) {
                    setRelationship(result);
                }
            } catch (error) {
                console.error(
                    "Không thể lấy quan hệ bạn bè:",
                    error
                );

                if (!cancelled) {
                    setRelationship(null);
                }
            } finally {
                if (!cancelled) {
                    setIsRelationshipLoading(false);
                }
            }
        }

        void loadRelationship();

        return () => {
            cancelled = true;
        };
    }, [currentUser, profile, isOwnProfile]);

    useEffect(() => {
        if (
            !currentUser ||
            !profile ||
            isOwnProfile
        ) {
            return;
        }

        const currentUserId = currentUser.id;
        const profileUserId = profile.id;

        const handleFriendshipChanged = (
            payload: FriendshipChangedPayload
        ) => {
            const isCurrentRelationship =
                (payload.requesterId === currentUserId &&
                    payload.addresseeId === profileUserId) ||
                (payload.requesterId === profileUserId &&
                    payload.addresseeId === currentUserId);

            if (!isCurrentRelationship) {
                return;
            }

            async function reloadRelationship() {
                try {
                    const [
                        latestRelationship,
                        latestProfile,
                    ] = await Promise.all([
                        getRelationshipWithUser(
                            profileUserId
                        ),
                        getUserProfile(profileUserId),
                    ]);

                    setRelationship(latestRelationship);
                    setProfile(latestProfile);
                } catch (error) {
                    console.error(
                        "Không thể đồng bộ quan hệ bạn bè:",
                        error
                    );
                }
            }

            void reloadRelationship();
        };

        socket.on(
            "friendship:changed",
            handleFriendshipChanged
        );

        return () => {
            socket.off(
                "friendship:changed",
                handleFriendshipChanged
            );
        };
    }, [currentUser, profile, isOwnProfile]);

    async function handleUpdateProfile(data: UpdateMyProfileInput) {
        const updatedProfile = await updateMyProfile(data);

        setProfile((currentProfile) => {
            if (!currentProfile) {
                return currentProfile;
            }

            return {
                ...currentProfile,
                display_name: updatedProfile.display_name,
                avatar: updatedProfile.avatar_url || currentProfile.avatar,
                cover_image: updatedProfile.cover_image,
                bio: updatedProfile.bio,
                birthday: updatedProfile.birthday,
                workplace: updatedProfile.workplace,
                education: updatedProfile.education,
                location: updatedProfile.location,
                website: updatedProfile.website,
            };
        });

        setIsEditModalOpen(false);
    }

    function getUploadErrorMessage(error: unknown) {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || "Không thể tải ảnh lên.";
        }

        return "Không thể tải ảnh lên.";
    }

    function getFriendActionErrorMessage(
        error: unknown,
        fallbackMessage: string
    ) {
        if (
            axios.isAxiosError<{
                message?: string;
            }>(error)
        ) {
            return (
                error.response?.data?.message ||
                fallbackMessage
            );
        }

        return fallbackMessage;
    }

    function validateProfileImage(file: File): string | null {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedTypes.includes(file.type)) {
            return "Chỉ chấp nhận ảnh JPEG, PNG, WebP hoặc GIF.";
        }

        if (file.size > 10 * 1024 * 1024) {
            return "Ảnh không được vượt quá 10 MB.";
        }

        return null;
    }

    async function handleAvatarUpload(file: File) {
        const validationError = validateProfileImage(file);

        if (validationError) {
            setImageUploadError(validationError);
            return;
        }

        setIsUploadingAvatar(true);
        setImageUploadError("");

        try {
            const imageUrl = await updateMyAvatar(file);

            setCurrentUser((user) => user ? { ...user, avatar: imageUrl } : user);
            setProfile((currentProfile) => currentProfile
                ? { ...currentProfile, avatar: imageUrl }
                : currentProfile
            );
        } catch (error) {
            setImageUploadError(getUploadErrorMessage(error));
        } finally {
            setIsUploadingAvatar(false);
        }
    }

    async function handleCoverUpload(file: File) {
        const validationError = validateProfileImage(file);

        if (validationError) {
            setImageUploadError(validationError);
            return;
        }

        setIsUploadingCover(true);
        setImageUploadError("");

        try {
            const imageUrl = await updateMyCoverImage(file);

            setProfile((currentProfile) => currentProfile
                ? { ...currentProfile, cover_image: imageUrl }
                : currentProfile
            );
        } catch (error) {
            setImageUploadError(getUploadErrorMessage(error));
        } finally {
            setIsUploadingCover(false);
        }
    }

    async function handleSendFriendRequest() {
        if (
            !profile ||
            isOwnProfile ||
            (relationship && relationship.status !== "rejected")
        ) {
            return;
        }

        setIsRelationshipLoading(true);

        try {
            const newRelationship =
                await sendFriendRequest(profile.id);

            setRelationship(newRelationship);
            void showSuccess("Đã gửi lời mời kết bạn");
        } catch (error) {
            void showError(
                getFriendActionErrorMessage(
                    error,
                    "Không thể gửi lời mời kết bạn"
                )
            );
        } finally {
            setIsRelationshipLoading(false);
        }
    }

    async function handleAcceptFriendRequest() {
        if (
            !relationship ||
            relationship.status !== "pending" ||
            relationship.addressee_id !== currentUser?.id
        ) {
            return;
        }

        setIsRelationshipLoading(true);

        try {
            const acceptedRelationship =
                await acceptFriendRequest(relationship.id);

            setRelationship(acceptedRelationship);
            void showSuccess(
                "Đã chấp nhận lời mời kết bạn"
            );
        } catch (error) {
            void showError(
                getFriendActionErrorMessage(
                    error,
                    "Không thể chấp nhận lời mời"
                )
            );
        } finally {
            setIsRelationshipLoading(false);
        }
    }

    async function handleRejectFriendRequest() {
        if (
            !relationship ||
            relationship.status !== "pending" ||
            relationship.addressee_id !== currentUser?.id
        ) {
            return;
        }

        setIsRelationshipLoading(true);

        try {
            const rejectedRelationship =
                await rejectFriendRequest(relationship.id);

            setRelationship(rejectedRelationship);
            void showSuccess("Đã từ chối lời mời");
        } catch (error) {
            void showError(
                getFriendActionErrorMessage(
                    error,
                    "Không thể từ chối lời mời"
                )
            );
        } finally {
            setIsRelationshipLoading(false);
        }
    }

    async function handleCancelFriendRequest() {
        if (
            !relationship ||
            relationship.status !== "pending" ||
            relationship.requester_id !== currentUser?.id
        ) {
            return;
        }

        setIsRelationshipLoading(true);

        try {
            await cancelFriendRequest(relationship.id);
            setRelationship(null);
            void showSuccess("Đã hủy lời mời kết bạn");
        } catch (error) {
            void showError(
                getFriendActionErrorMessage(
                    error,
                    "Không thể hủy lời mời kết bạn"
                )
            );
        } finally {
            setIsRelationshipLoading(false);
        }
    }

    async function handleRemoveFriend() {
        if (
            !relationship ||
            relationship.status !== "accepted"
        ) {
            return;
        }

        const confirmed = window.confirm(
            "Bạn có chắc muốn hủy kết bạn?"
        );

        if (!confirmed) {
            return;
        }

        setIsRelationshipLoading(true);

        try {
            await removeFriend(relationship.id);
            setRelationship(null);
            void showSuccess("Đã hủy kết bạn");
        } catch (error) {
            void showError(
                getFriendActionErrorMessage(
                    error,
                    "Không thể hủy kết bạn"
                )
            );
        } finally {
            setIsRelationshipLoading(false);
        }
    }

    return (
        <MainLayout currentUser={currentUser}>
            <div className="flex flex-col gap-6">
                <ProfileHeader
                    currentUser={currentUser}
                    profile={profile}
                    isOwnProfile={isOwnProfile}
                    relationship={relationship}
                    isRelationshipLoading={isRelationshipLoading}
                    onSendFriendRequest={handleSendFriendRequest}
                    onAcceptFriendRequest={handleAcceptFriendRequest}
                    onRejectFriendRequest={handleRejectFriendRequest}
                    onCancelFriendRequest={handleCancelFriendRequest}
                    onRemoveFriend={handleRemoveFriend}
                    onEditProfile={() => setIsEditModalOpen(true)}
                    onUploadAvatar={handleAvatarUpload}
                    onUploadCover={handleCoverUpload}
                    isUploadingAvatar={isUploadingAvatar}
                    isUploadingCover={isUploadingCover}
                    uploadError={imageUploadError}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {activeTab === "posts" && (
                    <div className="grid items-start gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <ProfileDetails
                                profile={profile}
                                isOwnProfile={isOwnProfile}
                                onEditProfile={() => setIsEditModalOpen(true)}
                                onTabChange={setActiveTab}
                            />
                        </div>
                        <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
                            {currentUser && profile && !isLoading ? (
                                <Feed
                                    currentUser={currentUser}
                                    onlyUserId={profile.id}
                                    showStories={false}
                                />
                            ) : (
                                <div className="rounded-2xl bg-white p-6 text-center text-sm text-[#767586] shadow-sm">
                                    Đang tải trang cá nhân...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="max-w-2xl">
                        <ProfileDetails
                            profile={profile}
                            isOwnProfile={isOwnProfile}
                            onEditProfile={() => setIsEditModalOpen(true)}
                            onTabChange={setActiveTab}
                        />
                    </div>
                )}

                {activeTab === "friends" && (
                    <FriendsTab userId={profile?.id} />
                )}

                {activeTab === "media" && (
                    <ProfileMediaTab userId={profile?.id || ""} />
                )}

                {activeTab !== "posts" &&
                    activeTab !== "about" &&
                    activeTab !== "friends" &&
                    activeTab !== "media" && (
                    <section
                        role="tabpanel"
                        className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-[#131b2e]">
                            {activeTab === "saved" && "Bài viết đã lưu"}
                            {activeTab === "community" && "Cộng đồng"}
                        </h2>
                        <p className="mt-2 text-sm text-[#767586]">
                            Chưa có dữ liệu để hiển thị. Nội dung sẽ xuất hiện khi chức năng này được kết nối với API.
                        </p>
                    </section>
                )}
            </div>

            {isOwnProfile && isEditModalOpen && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateProfile}
                />
            )}
        </MainLayout>
    );
}
