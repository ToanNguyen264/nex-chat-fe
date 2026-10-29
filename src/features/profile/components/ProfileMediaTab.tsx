import { useEffect, useState } from "react";
import { Image as ImageIcon, Video, Film } from "lucide-react";
import { getUserMedia, type UserMediaItem } from "../../../api/user.api";

type ProfileMediaTabProps = {
    userId: string;
};

type MediaTypeFilter = "all" | "image" | "video";

export default function ProfileMediaTab({ userId }: ProfileMediaTabProps) {
    const [mediaItems, setMediaItems] = useState<UserMediaItem[]>([]);
    const [filter, setFilter] = useState<MediaTypeFilter>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<UserMediaItem | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadMedia = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const typeParam = filter === "all" ? undefined : filter;
                const items = await getUserMedia(userId, typeParam, 50);

                if (!cancelled) {
                    setMediaItems(items);
                }
            } catch (err) {
                console.error("Không thể tải ảnh & video:", err);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadMedia();

        return () => {
            cancelled = true;
        };
    }, [userId, filter]);

    return (
        <section
            role="tabpanel"
            className="rounded-2xl bg-white dark:bg-[#151c2c] p-6 shadow-sm border border-slate-100 dark:border-[#263147]"
        >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#131b2e] dark:text-slate-100">
                        Ảnh & Video
                    </h2>
                    <p className="mt-1 text-xs text-[#767586] dark:text-slate-400">
                        Kho ảnh và video đã chia sẻ trong các bài viết.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl bg-[#f2f3ff] dark:bg-[#1e293b] p-1">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            filter === "all"
                                ? "bg-white dark:bg-[#151c2c] text-[#4648d4] dark:text-indigo-400 shadow-sm"
                                : "text-[#767586] dark:text-slate-400 hover:text-[#131b2e]"
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("image")}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            filter === "image"
                                ? "bg-white dark:bg-[#151c2c] text-[#4648d4] dark:text-indigo-400 shadow-sm"
                                : "text-[#767586] dark:text-slate-400 hover:text-[#131b2e]"
                        }`}
                    >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Ảnh
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("video")}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            filter === "video"
                                ? "bg-white dark:bg-[#151c2c] text-[#4648d4] dark:text-indigo-400 shadow-sm"
                                : "text-[#767586] dark:text-slate-400 hover:text-[#131b2e]"
                        }`}
                    >
                        <Video className="h-3.5 w-3.5" />
                        Video
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                        />
                    ))}
                </div>
            ) : mediaItems.length === 0 ? (
                <div className="rounded-2xl bg-[#f8f8ff] dark:bg-[#1e293b] px-6 py-14 text-center">
                    <Film className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <h3 className="text-sm font-semibold text-[#131b2e] dark:text-slate-200">
                        Chưa có dữ liệu
                    </h3>
                    <p className="mt-1 text-xs text-[#767586] dark:text-slate-400">
                        Người dùng này chưa chia sẻ ảnh hoặc video nào.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {mediaItems.map((item) => {
                        const isVideo = item.file_type?.startsWith("video/");

                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedMedia(item)}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-[#4648d4] transition"
                            >
                                {isVideo ? (
                                    <video
                                        src={item.file_url}
                                        className="h-full w-full object-cover"
                                        muted
                                        preload="metadata"
                                    />
                                ) : (
                                    <img
                                        src={item.file_url}
                                        alt={item.file_name || "Media"}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                )}

                                {isVideo && (
                                    <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm">
                                        <Video className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal xem toàn màn hình */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedMedia.file_type?.startsWith("video/") ? (
                            <video
                                src={selectedMedia.file_url}
                                controls
                                autoPlay
                                className="max-h-[85vh] w-auto max-w-full"
                            />
                        ) : (
                            <img
                                src={selectedMedia.file_url}
                                alt="Xem ảnh"
                                className="max-h-[85vh] w-auto max-w-full object-contain"
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
