import type { ReactNode } from "react";
import { BriefcaseBusiness, CalendarDays, GraduationCap, Link2, MapPin } from "lucide-react";
import type { UserProfile } from "../../../api/user.api";

function CardTitle({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#131b2e]">{children}</h2>
            {action && (
                <button type="button" onClick={onAction} className="text-xs font-semibold text-[#4648d4] hover:underline">{action}</button>
            )}
        </div>
    );
}

type ProfileDetailsProps = {
    profile: UserProfile | null;
    onEditProfile: () => void;
};

export default function ProfileDetails({ profile, onEditProfile }: ProfileDetailsProps) {
    const details = [
        { icon: BriefcaseBusiness, text: profile?.workplace ? <>Làm việc tại <strong>{profile.workplace}</strong></> : <>Chưa cập nhật nơi làm việc</> },
        { icon: GraduationCap, text: profile?.education ? <>Từng học tại <strong>{profile.education}</strong></> : <>Chưa cập nhật học vấn</> },
        { icon: MapPin, text: profile?.location ? <>Sống tại <strong>{profile.location}</strong></> : <>Chưa cập nhật nơi sống</> },
        { icon: CalendarDays, text: <>Tham gia từ {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("vi-VN") : "..."}</> },
        { icon: Link2, text: <strong className="text-[#4648d4]">{profile?.website || "Chưa cập nhật website"}</strong> },
    ];

    return (
        <aside className="flex flex-col gap-5">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <CardTitle action="Chỉnh sửa" onAction={onEditProfile}>Giới thiệu</CardTitle>
                <ul className="space-y-3">
                    {details.map(({ icon: Icon, text }, index) => (
                        <li key={index} className="flex items-center gap-3 text-xs leading-5 text-[#464554]">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f2f3ff] text-[#4648d4]">
                                <Icon className="h-4 w-4" />
                            </span>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <button type="button" onClick={onEditProfile} className="mt-5 w-full rounded-xl bg-[#f2f3ff] py-3 text-xs font-semibold text-[#464554] hover:bg-[#e8e9fb]">
                    Chỉnh sửa chi tiết công khai
                </button>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <CardTitle>Ảnh gần đây</CardTitle>
                <div className="rounded-xl bg-[#f8f8ff] px-4 py-8 text-center text-xs text-[#767586]">
                    Chưa có ảnh nào để hiển thị.
                </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <CardTitle>Bạn bè</CardTitle>
                <p className="-mt-3 mb-4 text-xs text-[#767586]">{profile?.friend_count ?? 0} bạn bè</p>
                <div className="rounded-xl bg-[#f8f8ff] px-4 py-8 text-center text-xs text-[#767586]">
                    Danh sách bạn bè chưa được kết nối với API.
                </div>
            </section>
        </aside>
    );
}
