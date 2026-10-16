type Friend = {
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
    notificationCount?: number;
};

const friends: Friend[] = [
    {
        id: 1,
        name: "Nguyễn Thảo My",
        status: "Đang trò chuyện",
        isOnline: true,
    },
    {
        id: 2,
        name: "Trần Hoàng Long",
        status: "Hoạt động 5 phút trước",
        isOnline: true,
        notificationCount: 1,
    },
    {
        id: 3,
        name: "Lê Ngọc Châu",
        status: "Đang lướt feed",
        isOnline: true,
    },
    {
        id: 4,
        name: "Phạm Quốc Tuấn",
        status: "Vừa offline",
        isOnline: false,
    },
];

export default function OnlineFriends() {
    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-[#131b2e]">
                    Bạn bè online
                </h2>

                <button
                    type="button"
                    className="text-xs font-medium text-indigo-600"
                >
                    Xem tất cả
                </button>
            </header>

            <div className="flex flex-col gap-3">
                {friends.map((friend) => (
                    <button
                        key={friend.id}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#f2f3ff]"
                    >
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                {friend.name
                                    .split(" ")
                                    .map((word) => word.charAt(0))
                                    .slice(-2)
                                    .join("")}
                            </div>

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