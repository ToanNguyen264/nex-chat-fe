import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { CurrentUser } from "../../api/user.api";
import {
    createPost,
    deletePost,
    getPosts,
    getUserPosts,
    setPostReaction,
    updatePost,
} from "../../api/post.api";
import type {
    PostFromApi,
    PostPrivacy,
    ReactionType,
} from "../../api/post.api";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";

type FeedProps = {
    currentUser: CurrentUser | null;
    showStories?: boolean;
    onlyUserId?: string;
    feedHeader?: ReactNode;
};

const formatPost = (post: PostFromApi): Post => {
    const fullName = [
        post.users.first_name,
        post.users.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return {
        id: Number(post.id),
        userId: post.user_id,
        privacy: post.privacy,
        author:
            fullName ||
            post.users.user_name ||
            "Người dùng",
        content: post.content ?? "",
        createdAt: new Date(post.created_at).toLocaleString(
            "vi-VN"
        ),
        currentReaction: post.currentReaction,
        reactionCount: post.reactionCount,
        avatar: post.users.avatar || undefined,
        images: post.attachments
            .filter((attachment) =>
                attachment.file_type?.startsWith("image/")
            )
            .map((attachment) => attachment.file_url),
        videos: post.attachments
            .filter((attachment) =>
                attachment.file_type?.startsWith("video/")
            )
            .map((attachment) => attachment.file_url),
        commentCount: post.commentCount,
        shareCount: 0,
    };
};

const appendUniquePosts = (
    currentPosts: Post[],
    incomingPosts: Post[]
) => {
    const postsById = new Map(
        currentPosts.map((post) => [post.id, post])
    );

    for (const post of incomingPosts) {
        postsById.set(post.id, post);
    }

    return Array.from(postsById.values());
};

export default function Feed({
    currentUser,
    showStories = true,
    onlyUserId,
    feedHeader,
}: FeedProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [nextCursor, setNextCursor] = useState<
        string | null
    >(null);
    const [hasNextPage, setHasNextPage] =
        useState(false);

    const canCreatePost =
        !onlyUserId || onlyUserId === currentUser?.id;

    useEffect(() => {
        let isActive = true;

        async function loadPosts() {
            setIsLoading(true);
            setPosts([]);
            setNextCursor(null);
            setHasNextPage(false);

            try {
                const result = onlyUserId
                    ? await getUserPosts(onlyUserId)
                    : await getPosts();

                if (!isActive) {
                    return;
                }

                setPosts(result.posts.map(formatPost));
                setNextCursor(
                    result.pagination.nextCursor
                );
                setHasNextPage(
                    result.pagination.hasNextPage
                );
            } catch (error) {
                console.error(
                    "Không thể lấy danh sách bài viết:",
                    error
                );
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadPosts();

        return () => {
            isActive = false;
        };
    }, [onlyUserId]);

    async function handleLoadMore() {
        if (!nextCursor || isLoadingMore) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const result = onlyUserId
                ? await getUserPosts(onlyUserId, {
                      cursor: nextCursor,
                  })
                : await getPosts({
                      cursor: nextCursor,
                  });

            setPosts((currentPosts) =>
                appendUniquePosts(
                    currentPosts,
                    result.posts.map(formatPost)
                )
            );
            setNextCursor(result.pagination.nextCursor);
            setHasNextPage(
                result.pagination.hasNextPage
            );
        } catch (error) {
            console.error(
                "Không thể tải thêm bài viết:",
                error
            );
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handleReaction(
        postId: number,
        reactionType: ReactionType
    ) {
        const result = await setPostReaction(
            postId,
            reactionType
        );

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
            })
        );
    }

    async function handleCreatePost(
        content: string,
        media: File[] = [],
        privacy: PostPrivacy = "public"
    ) {
        try {
            const createdPost = await createPost(
                content,
                media,
                privacy
            );

            const fullName = [
                createdPost.users.first_name,
                createdPost.users.last_name,
            ]
                .filter(Boolean)
                .join(" ");

            const newPost: Post = {
                id: Number(createdPost.id),
                userId: createdPost.user_id,
                privacy: createdPost.privacy,
                author:
                    fullName ||
                    createdPost.users.user_name ||
                    "Người dùng",
                content: createdPost.content,
                createdAt: "Vừa xong",
                currentReaction: null,
                reactionCount: 0,
                avatar:
                    createdPost.users.avatar || undefined,
                images: createdPost.attachments
                    .filter((attachment) =>
                        attachment.file_type?.startsWith(
                            "image/"
                        )
                    )
                    .map(
                        (attachment) => attachment.file_url
                    ),
                videos: createdPost.attachments
                    .filter((attachment) =>
                        attachment.file_type?.startsWith(
                            "video/"
                        )
                    )
                    .map(
                        (attachment) => attachment.file_url
                    ),
                commentCount: 0,
                shareCount: 0,
            };

            setPosts((currentPosts) => [
                newPost,
                ...currentPosts,
            ]);
        } catch (error) {
            console.error(
                "Không thể tạo bài viết:",
                error
            );
            throw error;
        }
    }

    async function handleDeletePost(postId: number) {
        try {
            await deletePost(postId);

            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== postId
                )
            );
        } catch (error) {
            console.error(
                "Không thể xóa bài viết:",
                error
            );
            throw error;
        }
    }

    async function handleEditPost(
        postId: number,
        content: string,
        privacy: PostPrivacy
    ) {
        const updatedPost = await updatePost(
            postId,
            content,
            privacy
        );

        setPosts((currentPosts) =>
            currentPosts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          content: updatedPost.content ?? "",
                          privacy: updatedPost.privacy,
                      }
                    : post
            )
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {showStories && <StoryList />}

            {canCreatePost && (
                <CreatePost
                    currentUser={currentUser}
                    onCreatePost={handleCreatePost}
                />
            )}

            {feedHeader}

            {isLoading ? (
                <p className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500">
                    Đang tải bài viết...
                </p>
            ) : (
                <>
                    <PostList
                        posts={posts}
                        currentUserId={currentUser?.id ?? null}
                        onReact={handleReaction}
                        onEditPost={handleEditPost}
                        onDeletePost={handleDeletePost}
                    />

                    {hasNextPage && nextCursor && (
                        <button
                            type="button"
                            disabled={isLoadingMore}
                            onClick={() =>
                                void handleLoadMore()
                            }
                            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoadingMore
                                ? "Đang tải thêm..."
                                : "Xem thêm"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
