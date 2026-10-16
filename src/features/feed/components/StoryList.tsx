import { Plus } from "lucide-react";

import storyThaoMy from "../../../assets/home/story-thao-my.png";
import storyHoangLong from "../../../assets/home/story-hoang-long.png";
import storyMinhAnh from "../../../assets/home/story-minh-anh.png";
import storyDucKien from "../../../assets/home/story-duc-kien.png";
import avatarThaoMy from "../../../assets/home/story-avatar-thao-my.png";
import avatarHoangLong from "../../../assets/home/story-avatar-hoang-long.png";
import avatarMinhAnh from "../../../assets/home/story-avatar-minh-anh.png";
import avatarDucKien from "../../../assets/home/story-avatar-duc-kien.png";
import StoryCard from "./StoryCard";

const stories = [
    {
        id: 1,
        name: "Thảo My",
        cover: storyThaoMy,
        avatar: avatarThaoMy,
        accent: "#4648d4",
    },
    {
        id: 2,
        name: "Hoàng Long",
        cover: storyHoangLong,
        avatar: avatarHoangLong,
        accent: "#57dffe",
    },
    {
        id: 3,
        name: "Minh Anh",
        cover: storyMinhAnh,
        avatar: avatarMinhAnh,
        accent: "#4648d4",
    },
    {
        id: 4,
        name: "Đức Kiên",
        cover: storyDucKien,
        avatar: avatarDucKien,
        accent: "#c7c4d7",
    },
];

export default function StoryList() {
    return (
        <section className="rounded-2xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button type="button" className="flex h-36 w-24 shrink-0 flex-col items-center justify-end gap-1 rounded-xl bg-[#f2f3ff] pb-3 text-[#131b2e]">
                <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#4648d4] text-white shadow-sm">
                    <Plus className="h-4 w-4" />
                </span>

                <span className="text-[11px] font-medium">
                    Tạo tin mới
                </span>
            </button>

            {stories.map((story) => (
                <StoryCard
                    key={story.id}
                    name={story.name}
                    cover={story.cover}
                    avatar={story.avatar}
                    accent={story.accent}
                />
            ))}
          </div>
        </section>
    );
}
