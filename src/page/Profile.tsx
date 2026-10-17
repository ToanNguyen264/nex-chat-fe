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

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [imageUploadError, setImageUploadError] = useState("");
    const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const userProfile = await getUserProfile(user.id);
                setProfile(userProfile);
            } catch (error) {
                console.error("Không thể lấy thông tin trang cá nhân:", error);
            } finally {
                setIsLoading(false);
            }
        }

        void loadCurrentUser();
    }, []);

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

    return (
        <MainLayout currentUser={currentUser}>
            <div className="flex flex-col gap-6">
                <ProfileHeader
                    currentUser={currentUser}
                    profile={profile}
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
                                onEditProfile={() => setIsEditModalOpen(true)}
                            />
                        </div>
                        <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
                            {currentUser && !isLoading ? (
                                <Feed
                                    currentUser={currentUser}
                                    onlyUserId={currentUser.id}
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
                            onEditProfile={() => setIsEditModalOpen(true)}
                        />
                    </div>
                )}

                {activeTab !== "posts" && activeTab !== "about" && (
                    <section
                        role="tabpanel"
                        className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-[#131b2e]">
                            {activeTab === "friends" && "Bạn bè"}
                            {activeTab === "media" && "Ảnh & Video"}
                            {activeTab === "saved" && "Bài viết đã lưu"}
                            {activeTab === "community" && "Cộng đồng"}
                        </h2>
                        <p className="mt-2 text-sm text-[#767586]">
                            Chưa có dữ liệu để hiển thị. Nội dung sẽ xuất hiện khi chức năng này được kết nối với API.
                        </p>
                    </section>
                )}
            </div>

            {isEditModalOpen && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateProfile}
                />
            )}
        </MainLayout>
    );
}
