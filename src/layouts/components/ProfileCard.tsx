type ProfileCardProps = {
    avatar: string;
    name: string;
    username: string;
    postCount: number;
    followerCount: string;
    followingCount: number;
};

export default function ProfileCard({
    avatar,
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
                    <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold tracking-[-0.18px] text-[#131b2e]">
                        {name}
                    </h2>

                    <p className="text-xs text-[#767586]">
                        {username}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#f2f3ff]/70 px-3 pb-3 pt-4 text-center">
                <div>
                    <strong className="block text-xl font-semibold text-[#4648d4]">
                        {postCount}
                    </strong>
                    <span className="text-xs text-slate-500">
                        Bài viết
                    </span>
                </div>

                <div>
                    <strong className="block text-xl font-semibold">
                        {followerCount}
                    </strong>
                    <span className="text-xs text-slate-500">
                        Theo dõi
                    </span>
                </div>

                <div>
                    <strong className="block text-xl font-semibold">
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
