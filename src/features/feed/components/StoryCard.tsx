type StoryCardProps = {
    name: string;
    initials: string;
    background: string;
};

export default function StoryCard({
    name,
    initials,
    background,
}: StoryCardProps) {
    return (
        <article
            className="relative h-28 min-w-20 overflow-hidden rounded-xl p-2 text-white"
            style={{ background }}
        >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-[10px] font-bold text-indigo-600">
                {initials}
            </div>

            <p className="absolute bottom-2 left-2 right-2 truncate text-xs font-medium">
                {name}
            </p>
        </article>
    );
}