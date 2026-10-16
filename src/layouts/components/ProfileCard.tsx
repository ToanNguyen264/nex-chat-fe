type ProfileCardProps = {
    name: string;
    username: string;
    postCount: number;
    followerCount: string;
    followingCount: number;
};

export default function ProfileCard({
    name,
    username,
    postCount,
    followerCount,
    followingCount,
}: ProfileCardProps) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                        {name.charAt(0)}
                    </div>

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                </div>

                <div>
                    <h2 className="font-semibold text-[#131b2e]">
                        {name}
                    </h2>

                    <p className="text-xs text-[#767586]">
                        {username}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 rounded-xl bg-[#f2f3ff] p-3 text-center">
                <div>
                    <strong className="block text-indigo-600">
                        {postCount}
                    </strong>
                    <span className="text-xs text-slate-500">
                        Bài viết
                    </span>
                </div>

                <div>
                    <strong className="block">
                        {followerCount}
                    </strong>
                    <span className="text-xs text-slate-500">
                        Theo dõi
                    </span>
                </div>

                <div>
                    <strong className="block">
                        {followingCount}
                    </strong>
                    <span className="text-xs text-slate-500">
                        Đang theo
                    </span>
                </div>
            </div>
        </section>
    );
}