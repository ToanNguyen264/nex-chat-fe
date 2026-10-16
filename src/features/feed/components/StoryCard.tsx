type StoryCardProps = {
    name: string;
    cover: string;
    avatar: string;
    accent: string;
};

export default function StoryCard({
    name,
    cover,
    avatar,
    accent,
}: StoryCardProps) {
    return (
        <article className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl text-white shadow-sm">
            <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute left-2 top-2 rounded-full p-0.5" style={{ boxShadow: `0 0 0 2px ${accent}` }}>
                <img src={avatar} alt={name} className="h-6 w-6 rounded-full object-cover" />
            </div>

            <p className="absolute bottom-2 left-2 right-2 truncate text-[11px] font-medium">
                {name}
            </p>
        </article>
    );
}
