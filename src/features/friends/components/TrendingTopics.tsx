type TrendingTopic = {
    id: number;
    category: string;
    hashtag: string;
    postCount: string;
};

const topics: TrendingTopic[] = [
    {
        id: 1,
        category: "Công nghệ",
        hashtag: "#PulseAudioUpdate",
        postCount: "18.4K bài thảo luận",
    },
    {
        id: 2,
        category: "Thiết kế sáng tạo",
        hashtag: "#VietnamDesigners2024",
        postCount: "9.2K bài thảo luận",
    },
    {
        id: 3,
        category: "Đời sống số",
        hashtag: "#CafeChillCuoiTuan",
        postCount: "6.1K bài thảo luận",
    },
];

export default function TrendingTopics() {
    return (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-[#131b2e]">
                <span className="text-[#4648d4]">♨</span> Xu hướng thảo luận
            </h2>

            <div className="flex flex-col gap-3">
                {topics.map((topic) => (
                    <article key={topic.id}>
                        <p className="text-xs text-[#767586]">
                            {topic.category}
                        </p>

                        <p className="text-sm font-semibold text-[#131b2e]">
                            {topic.hashtag}
                        </p>

                        <p className="text-xs text-[#767586]">
                            {topic.postCount}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
