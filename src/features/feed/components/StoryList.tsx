import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CurrentUser } from "../../../api/user.api";
import { getFeedStories } from "../../../api/story.api";
import defaultAvatar from "../../../assets/default-avatar.png";
import StoryCard from "./StoryCard";
import CreateStoryModal from "./CreateStoryModal";
import StoryViewerModal from "./StoryViewerModal";

type StoryListProps = {
    currentUser?: CurrentUser | null;
};

export default function StoryList({ currentUser = null }: StoryListProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewerGroupIndex, setViewerGroupIndex] = useState<number | null>(null);

    // Gọi API lấy danh sách story của bạn bè và chính mình
    const {
        data: storyGroups = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["feed-stories"],
        queryFn: getFeedStories,
    });


    return (
        <section className="rounded-2xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {/* 1. Nút Tạo tin mới (theo kiểu Facebook: Avatar ở trên, dấu + ở giữa, chữ ở dưới) */}
                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="group relative flex h-36 w-24 shrink-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-[#131b2e] shadow-sm transition hover:shadow-md cursor-pointer"
                >
                    {/* Nửa trên là ảnh avatar của người dùng */}
                    <div className="relative h-24 w-full overflow-hidden bg-slate-100">
                        <img
                            src={currentUser?.avatar || defaultAvatar}
                            alt="Tạo tin"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                            }}
                        />
                    </div>

                    {/* Dấu + tròn ở giữa ranh giới */}
                    <div className="absolute top-[82px] left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white ring-4 ring-white shadow">
                        <Plus className="h-4 w-4" />
                    </div>

                    {/* Dòng chữ Tạo tin */}
                    <span className="pb-2 text-[11px] font-semibold text-slate-800">
                        Tạo tin
                    </span>
                </button>

                {/* 2. Loading trạng thái khi đang tải danh sách tin */}
                {isLoading && (
                    <div className="flex h-36 items-center justify-center px-6 text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-xs">Đang tải tin...</span>
                    </div>
                )}

                {/* 3. Danh sách thẻ Story thật từ API */}
                {!isLoading &&
                    storyGroups.map((group, index) => (
                        <StoryCard
                            key={group.userId}
                            group={group}
                            onClick={() => setViewerGroupIndex(index)}
                        />
                    ))}
            </div>

            {/* Modal tạo tin mới */}
            {isCreateOpen && (
                <CreateStoryModal
                    onClose={() => setIsCreateOpen(false)}
                    onStoryCreated={() => {
                        void refetch();
                    }}
                />
            )}

            {/* Modal xem tin */}
            {viewerGroupIndex !== null && (
                <StoryViewerModal
                    groups={storyGroups}
                    initialGroupIndex={viewerGroupIndex}
                    onClose={() => setViewerGroupIndex(null)}
                    onStoryDeleted={() => {
                        void refetch();
                    }}
                />
            )}
        </section>
    );
}
