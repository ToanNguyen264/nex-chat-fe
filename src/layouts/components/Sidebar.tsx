import ProfileCard from "./ProfileCard";
const menuItems = [
    "Bảng tin bạn bè",
    "Đã lưu",
    "Cộng đồng sáng tạo",
    "Thống kê tương tác",
];

export default function Sidebar() {
    return (
        <div className="flex flex-col gap-4">
            <ProfileCard
                name="Nguyễn Văn A"
                username="@nguyenvana"
                postCount={842}
                followerCount="14.6k"
                followingCount={589}
            />

            <nav className="rounded-2xl bg-white p-3 shadow-sm">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-600 hover:bg-[#f2f3ff] hover:text-indigo-600"
                    >
                        {item}
                    </button>
                ))}
            </nav>

            <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-sm">
                <p className="text-xs text-white/70">NEX INDEX</p>
                <strong className="mt-2 block text-2xl">+28.4%</strong>
                <p className="mt-1 text-xs text-white/70">
                    Mức độ tương tác trong 24 giờ qua
                </p>
            </section>
        </div>
    );
}