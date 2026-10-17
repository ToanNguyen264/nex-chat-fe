import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";
import {
    createPost,
    deletePost,
    getPosts,
    setPostReaction,
} from "../../api/post.api";
import type { ReactionType } from "../../api/post.api";
import type { CurrentUser } from "../../api/user.api";

type FeedProps = {
    currentUser: CurrentUser | null;
    showStories?: boolean;
    onlyUserId?: string;
    feedHeader?: ReactNode;
};

export default function Feed({
    currentUser,
    showStories = true,
    onlyUserId,
    feedHeader,
}: FeedProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            setIsLoading(true);
            try {
                const postsFromApi = await getPosts(); // nhận mảng dữ liệu bài viết từ API

                const visiblePosts = onlyUserId
                    ? postsFromApi.filter((post) => post.user_id === onlyUserId)
                    : postsFromApi;

                const formattedPosts: Post[] = visiblePosts.map((post) => {
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
                        currentReaction: post.currentReaction,
                        reactionCount: post.reactionCount,
                        avatar: post.users.avatar || undefined,
                        images: post.attachments.filter(
                            (attachment) =>
                                attachment.file_type?.startsWith(
                                    "image/"
                                )
                        ).map((attachment) => attachment.file_url),
                        videos: post.attachments.filter(
                            (attachment) =>
                                attachment.file_type?.startsWith(
                                    "video/"
                                )
                        ).map((attachment) => attachment.file_url),
                        commentCount: post.commentCount,
                        shareCount: 0,
                    };
                });

                setPosts(formattedPosts);
            } catch (error) {
                console.error(
                    "Không thể lấy danh sách bài viết:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadPosts();
    }, [onlyUserId]);

    async function handleReaction(
        postId: number,
        reactionType: ReactionType
    ) {
        const result = await setPostReaction(postId, reactionType);

        setPosts((currentPosts) =>
            currentPosts.map((post) => {
                if (post.id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    currentReaction: result.currentReaction,
                    reactionCount: result.reactionCount,
                };
            }),
        );
    }

    async function handleCreatePost(
        content: string,
        media: File[] = []
    ) {
        try {
            const createdPost = await createPost(content, media);

            const fullName = [
                createdPost.users.first_name,
                createdPost.users.last_name,
            ]
                .filter(Boolean)
                .join(" ");

            const newPost: Post = {
                id: Number(createdPost.id),
                author: fullName || createdPost.users.user_name || "Người dùng",
                content: createdPost.content,
                createdAt: "Vừa xong",
                currentReaction: null,
                reactionCount: 0,
                avatar: createdPost.users.avatar || undefined,
                images: createdPost.attachments.filter(
                    (attachment) =>
                        attachment.file_type?.startsWith("image/")
                ).map((attachment) => attachment.file_url),
                videos: createdPost.attachments.filter(
                    (attachment) =>
                        attachment.file_type?.startsWith("video/")
                ).map((attachment) => attachment.file_url),
                commentCount: 0,
                shareCount: 0,
            };

            setPosts((currentPosts) => [
                newPost,
                ...currentPosts,
            ]);
        } catch (error) {
            console.error("Không thể tạo bài viết:", error);
            throw error;
        }
    }

    async function handleDeletePost(postId: number) {
        try {
            await deletePost(postId);

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post.id !== postId)
            );
        } catch (error) {
            console.error("Không thể xóa bài viết:", error);
            throw error;
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {showStories && <StoryList />}

            <CreatePost
                currentUser={currentUser}
                onCreatePost={handleCreatePost}
            />

            {feedHeader}

            {isLoading ? (
                <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500">
                    Đang tải bài viết...
                </p>
            ) : (
                <PostList
                    posts={posts}
                    onReact={handleReaction}
                    onDeletePost={handleDeletePost}
                />
            )}
        </div>
    );
}
