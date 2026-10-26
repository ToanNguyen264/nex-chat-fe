import type { UserStoryGroup } from "../../../api/story.api";
import defaultAvatar from "../../../assets/default-avatar.png";

type StoryCardProps = {
    group: UserStoryGroup;
    onClick: () => void;
};

export default function StoryCard({ group, onClick }: StoryCardProps) {
    // Lấy tin mới nhất trong nhóm story của người này để làm ảnh bìa (cover)
    const latestStory = group.stories[group.stories.length - 1];

    if (!latestStory) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative h-36 w-24 shrink-0 overflow-hidden rounded-xl text-left text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md cursor-pointer"
        >
            {/* Ảnh bìa / Video của story */}
            {latestStory.mediaType === "video" ? (
                <video
                    src={latestStory.mediaUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                />
            ) : (
                <img
                    src={latestStory.mediaUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            )}

            {/* Lớp phủ gradient để làm nổi bật avatar và tên */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Avatar người đăng ở góc trên bên trái */}
            <div
                className={`absolute left-2 top-2 rounded-full p-0.5 ${
                    group.isOwn
                        ? "ring-2 ring-indigo-500"
                        : "ring-2 ring-blue-500"
                }`}
            >
                <img
                    src={group.avatar || defaultAvatar}
                    alt={group.authorName}
                    className="h-6 w-6 rounded-full object-cover bg-slate-200"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                    }}
                />
            </div>

            {/* Tên người đăng ở góc dưới */}
            <p className="absolute bottom-2 left-2 right-2 truncate text-[11px] font-medium drop-shadow">
                {group.isOwn ? "Tin của bạn" : group.authorName}
            </p>
        </button>
    );
}
