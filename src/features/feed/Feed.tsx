import { useState, useEffect } from "react";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";
import avatarNam from "../../assets/home/profile-nam.png";
import { createPost, getPosts } from "../../api/post.api";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            setIsLoading(true);
            try {
                const postsFromApi = await getPosts(); // nhận mảng dữ liệu bài viết từ API

                const formattedPosts: Post[] = postsFromApi.map((post) => {
                    const fullName = [
                        post.users.first_name,
                        post.users.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return {
                        id: Number(post.id),
                        author:
                            fullName ||
                            post.users.user_name ||
                            "Người dùng",
                        content: post.content ?? "",
                        createdAt: new Date(
                            post.created_at
                        ).toLocaleString("vi-VN"),
                        isLiked: false,
                        likeCount: 0,
                        avatar: post.users.avatar || avatarNam,
                        commentCount: 0,
                        shareCount: 0,
                    };
                });

                setPosts(formattedPosts);
                setIsLoading(false);
            } catch (error) {
                console.error(
                    "Không thể lấy danh sách bài viết:",
                    error
                );
                setIsLoading(false);
            }
        }

        void loadPosts();
    }, []);

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

    async function handleCreatePost(content: string) {
        try {
            const createdPost = await createPost(content);

            const newPost: Post = {
                id: Number(createdPost.id),
                author: "Nguyễn Văn A",
                content: createdPost.content,
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
        } catch (error) {
            console.error("Không thể tạo bài viết:", error);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <StoryList />

            <CreatePost onCreatePost={handleCreatePost} />

            {isLoading ? (
                <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500">
                    Đang tải bài viết...
                </p>
            ) : (
                <PostList
                    posts={posts}
                    onToggleLike={handleToggleLike}
                />
            )}
        </div>
    );
}
