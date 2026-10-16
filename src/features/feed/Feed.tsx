import { useState } from "react";

import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";
import avatarCommunity from "../../assets/home/avatar-community.png";
import avatarNam from "../../assets/home/profile-nam.png";
import avatarThaoMy from "../../assets/home/avatar-thao-my.png";
import postMessenger from "../../assets/home/post-messenger.png";

const initialPosts: Post[] = [
    {
        id: 1,
        author: "Nguyễn Thảo My",
        content:
            "Vừa hoàn thiện concept giao diện Real-time Messenger cho hệ sinh thái Pulse ⚡ Tối ưu trải nghiệm đa nhiệm: lướt feed mượt mà không lo gián đoạn mạch hội thoại cùng nhóm bạn thân! Mọi người thấy hiệu ứng neon gradient này thế nào? 💜🎨",
        createdAt: "25 phút trước",
        isLiked: true,
        likeCount: 342,
        avatar: avatarThaoMy,
        image: postMessenger,
        tags: ["#PulseApp", "#ProductDesign", "#VietnamUI"],
        commentCount: 48,
        shareCount: 19,
        isVerified: true,
    },
    {
        id: 2,
        author: "Cộng đồng Pulse Creators VN",
        content: "Hẹn gặp mọi người tại Pulse Creative Jam cuối tuần này! Đã có hơn 120 dự án đăng ký tranh tài thiết kế giao diện xã hội thế hệ mới.",
        createdAt: "Hôm nay lúc 09:15",
        isLiked: false,
        likeCount: 126,
        avatar: avatarCommunity,
        commentCount: 21,
        shareCount: 8,
    },
];
export default function Feed() {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    function handleToggleLike(postId: number) {
        setPosts((currentPosts) =>
            currentPosts.map((post) => {
                if (post.id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likeCount: post.isLiked
                        ? post.likeCount - 1
                        : post.likeCount + 1,
                };
            }),
        );
    }

    function handleCreatePost(content: string) {
        const newPost: Post = {
            id: Date.now(),
            author: "Nguyễn Văn A",
            content,
            createdAt: "Vừa xong",
            isLiked: false,
            likeCount: 0,
            avatar: avatarNam,
            commentCount: 0,
            shareCount: 0,
        };

        setPosts((currentPosts) => [
            newPost,
            ...currentPosts,
        ]);
    }

    return (
        <div className="flex flex-col gap-4">
            <StoryList />

            <CreatePost onCreatePost={handleCreatePost} />

            <PostList posts={posts} onToggleLike={handleToggleLike} />
        </div>
    );
}
