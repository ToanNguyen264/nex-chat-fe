import avatarThaoMy from "../../../assets/home/avatar-thao-my.png";
import avatarHoangLong from "../../../assets/home/avatar-hoang-long.png";
import avatarMinhAnh from "../../../assets/home/story-avatar-minh-anh.png";
import avatarDucKien from "../../../assets/home/story-avatar-duc-kien.png";

type Friend = {
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
    notificationCount?: number;
    avatar: string;
};

const friends: Friend[] = [
    {
        id: 1,
        name: "Nguyễn Thảo My",
        status: "Đang trò chuyện",
        isOnline: true,
        avatar: avatarThaoMy,
    },
    {
        id: 2,
        name: "Trần Hoàng Long",
        status: "Hoạt động 5 phút trước",
        isOnline: true,
        notificationCount: 1,
        avatar: avatarHoangLong,
    },
    {
        id: 3,
        name: "Lê Ngọc Châu",
        status: "Đang lướt feed",
        isOnline: true,
        avatar: avatarMinhAnh,
    },
    {
        id: 4,
        name: "Phạm Quốc Tuấn",
        status: "Vừa offline",
        isOnline: false,
        avatar: avatarDucKien,
    },
];

export default function OnlineFriends() {
    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-[#131b2e]">
                    Bạn bè online <span className="h-2 w-2 rounded-full bg-[#57dffe]" />
                </h2>

                <button
                    type="button"
                    className="text-xs font-medium text-indigo-600"
                >
                    Xem tất cả
                </button>
            </header>

            <div className="flex flex-col gap-1">
                {friends.map((friend) => (
                    <button
                        key={friend.id}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f2f3ff] ${friend.id === 1 ? "bg-[#f2f3ff]" : ""}`}
                    >
                        <div className="relative">
                            <img src={friend.avatar} alt={friend.name} className="h-10 w-10 rounded-full object-cover" />

                            {friend.isOnline && (
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#131b2e]">
                                {friend.name}
                            </p>

                            <p className="truncate text-xs text-[#767586]">
                                {friend.status}
                            </p>
                        </div>

                        {friend.notificationCount !== undefined && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs text-white">
                                {friend.notificationCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
