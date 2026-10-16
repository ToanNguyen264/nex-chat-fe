import { useState } from "react";

import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";

const initialPosts: Post[] = [
    {
        id: 1,
        author: "Nguyễn Thảo My",
        content:
            "Vừa hoàn thiện concept giao diện Nex! Tối ưu trải nghiệm đa nhiệm và tạo không gian kết nối gần gũi hơn.",
        createdAt: "25 phút trước",
        isLiked: false,
        likeCount: 342,
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
