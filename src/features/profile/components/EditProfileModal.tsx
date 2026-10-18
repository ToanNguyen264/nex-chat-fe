import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { X } from "lucide-react";

import type {
    UpdateMyProfileInput,
    UserProfile,
} from "../../../api/user.api";

type EditProfileModalProps = {
    profile: UserProfile;
    onClose: () => void;
    onSave: (data: UpdateMyProfileInput) => Promise<void>;
};

type ProfileForm = {
    displayName: string;
    bio: string;
    birthday: string;
    workplace: string;
    education: string;
    location: string;
    website: string;
};

const inputClassName =
    "mt-1.5 w-full rounded-xl border border-[#e6e7f5] bg-[#fafaff] px-3.5 py-2.5 text-sm text-[#131b2e] outline-none transition placeholder:text-[#9b99a8] focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10";

export default function EditProfileModal({
    profile,
    onClose,
    onSave,
}: EditProfileModalProps) {
    const [form, setForm] = useState<ProfileForm>({
        displayName: profile.display_name,
        bio: profile.bio ?? "",
        birthday: profile.birthday?.slice(0, 10) ?? "",
        workplace: profile.workplace ?? "",
        education: profile.education ?? "",
        location: profile.location ?? "",
        website: profile.website ?? "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function updateField(field: keyof ProfileForm, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const displayName = form.displayName.trim();

        if (!displayName) {
            setErrorMessage("Tên hiển thị không được để trống.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            await onSave({
                displayName,
                bio: form.bio.trim() || null,
                birthday: form.birthday || null,
                workplace: form.workplace.trim() || null,
                education: form.education.trim() || null,
                location: form.location.trim() || null,
                website: form.website.trim() || null,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Không thể cập nhật hồ sơ. Vui lòng thử lại."
                );
            } else {
                setErrorMessage("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#131b2e]/55 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-[0_24px_80px_rgba(19,27,46,0.28)]"
            >
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eef0ff] bg-white px-6 py-5">
                    <div>
                        <h2 id="edit-profile-title" className="text-xl font-bold text-[#131b2e]">
                            Chỉnh sửa hồ sơ
                        </h2>
                        <p className="mt-1 text-xs text-[#767586]">
                            Thông tin này sẽ hiển thị trên trang cá nhân của bạn.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Đóng"
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#f2f3ff] text-[#464554] hover:bg-[#e8e9fb] disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="grid gap-5 p-6 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-[#464554] sm:col-span-2">
                        Tên hiển thị <span className="text-rose-500">*</span>
                        <input
                            value={form.displayName}
                            maxLength={100}
                            onChange={(event) => updateField("displayName", event.target.value)}
                            className={inputClassName}
                            placeholder="Tên hiển thị"
                        />
                    </label>

                    <label className="text-xs font-semibold text-[#464554] sm:col-span-2">
                        Giới thiệu
                        <textarea
                            value={form.bio}
                            maxLength={2000}
                            rows={4}
                            onChange={(event) => updateField("bio", event.target.value)}
                            className={`${inputClassName} resize-none`}
                            placeholder="Viết vài điều về bạn..."
                        />
                        <span className="mt-1 block text-right text-[10px] font-normal text-[#9b99a8]">
                            {form.bio.length}/2000
                        </span>
                    </label>

                    <label className="text-xs font-semibold text-[#464554]">
                        Ngày sinh
                        <input
                            type="date"
                            value={form.birthday}
                            onChange={(event) => updateField("birthday", event.target.value)}
                            className={inputClassName}
                        />
                    </label>

                    <label className="text-xs font-semibold text-[#464554]">
                        Nơi làm việc
                        <input
                            value={form.workplace}
                            maxLength={255}
                            onChange={(event) => updateField("workplace", event.target.value)}
                            className={inputClassName}
                            placeholder="Công ty hoặc tổ chức"
                        />
                    </label>

                    <label className="text-xs font-semibold text-[#464554]">
                        Học vấn
                        <input
                            value={form.education}
                            maxLength={255}
                            onChange={(event) => updateField("education", event.target.value)}
                            className={inputClassName}
                            placeholder="Trường học"
                        />
                    </label>

                    <label className="text-xs font-semibold text-[#464554]">
                        Nơi sống
                        <input
                            value={form.location}
                            maxLength={255}
                            onChange={(event) => updateField("location", event.target.value)}
                            className={inputClassName}
                            placeholder="Thành phố, quốc gia"
                        />
                    </label>

                    <label className="text-xs font-semibold text-[#464554] sm:col-span-2">
                        Website
                        <input
                            type="url"
                            value={form.website}
                            maxLength={500}
                            onChange={(event) => updateField("website", event.target.value)}
                            className={inputClassName}
                            placeholder="https://example.com"
                        />
                    </label>

                    {errorMessage && (
                        <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600 sm:col-span-2">
                            {errorMessage}
                        </p>
                    )}
                </div>

                <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-[#eef0ff] bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-xl bg-[#f2f3ff] px-5 py-2.5 text-sm font-semibold text-[#464554] hover:bg-[#e8e9fb] disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-[#4648d4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3d3fc2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
