import StoryCard from "./StoryCard";

const stories = [
    {
        id: 1,
        name: "Thảo My",
        initials: "TM",
        background: "linear-gradient(135deg, #4338ca, #c026d3)",
    },
    {
        id: 2,
        name: "Hoàng Long",
        initials: "HL",
        background: "linear-gradient(135deg, #0f766e, #22c55e)",
    },
    {
        id: 3,
        name: "Minh Anh",
        initials: "MA",
        background: "linear-gradient(135deg, #0369a1, #06b6d4)",
    },
    {
        id: 4,
        name: "Đức Kiên",
        initials: "ĐK",
        background: "linear-gradient(135deg, #334155, #6366f1)",
    },
];

export default function StoryList() {
    return (
        <section className="flex gap-3 overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
            <button className="flex h-28 min-w-20 flex-col items-center justify-center gap-2 rounded-xl bg-[#f2f3ff] text-indigo-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-lg text-white">
                    +
                </span>

                <span className="text-xs font-medium">
                    Tạo tin mới
                </span>
            </button>

            {stories.map((story) => (
                <StoryCard
                    key={story.id}
                    name={story.name}
                    initials={story.initials}
                    background={story.background}
                />
            ))}
        </section>
    );
}