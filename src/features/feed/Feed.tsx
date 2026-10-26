import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import {
    useInfiniteQuery,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";

import type { CurrentUser } from "../../api/user.api";
import {
    createPost,
    deletePost,
    setPostReaction,
    updatePost,
} from "../../api/post.api";
import type {
    CreatedPost,
    PaginatedPosts,
    PostFromApi,
    PostPrivacy,
    ReactionType,
} from "../../api/post.api";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import StoryList from "./components/StoryList";
import type { Post } from "./types";
import {
    applyOptimisticPostReaction,
    createFeedInfiniteQueryOptions,
    flattenFeedPosts,
    prependPostToInfiniteFeed,
    removePostFromInfiniteFeed,
    updatePostInInfiniteFeed,
} from "./feed-query";
import { useFeedRealtimeStore } from "./feed-realtime.store";

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
        reactionSummary: post.reactionSummary,
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

const formatCreatedPost = (
    post: CreatedPost
): PostFromApi => ({
    ...post,
    content: post.content ?? "",
    currentReaction: null,
    reactionCount: 0,
    reactionSummary: [],
    commentCount: 0,
});

export default function Feed({
    currentUser,
    showStories = true,
    onlyUserId,
    feedHeader,
}: FeedProps) {
    const queryClient = useQueryClient();
    const queryOptions = createFeedInfiniteQueryOptions(onlyUserId);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isError,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery(queryOptions);

    const posts = useMemo(
        () => flattenFeedPosts(data).map(formatPost),
        [data]
    );
    const canCreatePost =
        !onlyUserId || onlyUserId === currentUser?.id;

    const updateCurrentFeed = (
        updater: (
            current: InfiniteData<PaginatedPosts>
        ) => InfiniteData<PaginatedPosts>
    ) => {
        queryClient.setQueryData<
            InfiniteData<PaginatedPosts>
        >(queryOptions.queryKey, (current) =>
            current ? updater(current) : current
        );
    };

    const updatePostInCache = (
        postId: number,
        updater: (post: PostFromApi) => PostFromApi
    ) => {
        updateCurrentFeed((current) => /* mở ram để lấy data */
            updatePostInInfiniteFeed(
                current,
                postId.toString(),
                updater
            )
        );
    };

    const lastReactionUpdate = useFeedRealtimeStore(
        (state) => state.lastReactionUpdate
    );

    const reactionTimers = useRef<Record<number, number>>({});

    useEffect(() => {
        if (!lastReactionUpdate) return;

        updatePostInCache(
            Number(lastReactionUpdate.postId),
            (post) => ({
                ...post,
                reactionCount: lastReactionUpdate.reactionCount,
                reactionSummary: lastReactionUpdate.reactionSummary,
            })
        );
    }, [lastReactionUpdate]);

    async function handleReaction(
        postId: number,
        reactionType: ReactionType
    ) {
        const previousFeed = data; // Lưu lại Feed cũ để khôi phục nếu gọi API lỗi
        let nextReaction: ReactionType | null = null;

        // 1. Cập nhật ngay bài viết trong RAM để đổi giao diện tức thì (0ms)
        updatePostInCache(postId, (post) => {
            const updatedPost = applyOptimisticPostReaction(
                post,
                reactionType
            );
            nextReaction = updatedPost.currentReaction;
            return updatedPost;
        });

        // 2. Debounce 400ms: Hủy hẹn giờ cũ (nếu có) và tạo hẹn giờ mới
        clearTimeout(reactionTimers.current[postId]);

        reactionTimers.current[postId] = window.setTimeout(
            async () => {
                try {
                    const result = await setPostReaction(
                        postId,
                        nextReaction
                    );

                    // Đồng bộ lại kết quả chuẩn từ Server vào bài viết trong RAM
                    updatePostInCache(postId, (post) => ({
                        ...post,
                        currentReaction:
                            result.currentReaction,
                        reactionCount: result.reactionCount,
                        reactionSummary:
                            result.reactionSummary,
                    }));
                } catch (reactionError) {
                    // 3. Nếu lỗi mạng thì trả lại Feed cũ
                    if (previousFeed) {
                        queryClient.setQueryData(
                            queryOptions.queryKey,
                            previousFeed
                        );
                    }
                    console.error(
                        "Không thể cập nhật cảm xúc:",
                        reactionError
                    );
                    window.alert(
                        "Không thể cập nhật cảm xúc."
                    );
                }
            },
            400
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

            updateCurrentFeed((current) =>
                prependPostToInfiniteFeed(
                    current,
                    formatCreatedPost(createdPost)
                )
            );
        } catch (createError) {
            console.error(
                "Không thể tạo bài viết:",
                createError
            );
            throw createError;
        }
    }

    async function handleDeletePost(postId: number) {
        try {
            await deletePost(postId);
            updateCurrentFeed((current) =>
                removePostFromInfiniteFeed(
                    current,
                    postId.toString()
                )
            );
        } catch (deleteError) {
            console.error(
                "Không thể xóa bài viết:",
                deleteError
            );
            throw deleteError;
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

        updateCurrentFeed((current) =>
            updatePostInInfiniteFeed(
                current,
                postId.toString(),
                (post) => ({
                    ...post,
                    content: updatedPost.content,
                    privacy: updatedPost.privacy,
                    updated_at: updatedPost.updated_at,
                })
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
            ) : isError ? (
                <button
                    type="button"
                    onClick={() =>
                        void queryClient.invalidateQueries({
                            queryKey: queryOptions.queryKey,
                        })
                    }
                    className="rounded-2xl bg-white p-5 text-center text-sm font-semibold text-rose-600"
                >
                    Không thể tải Feed. Nhấn để thử lại.
                    {error instanceof Error
                        ? ` (${error.message})`
                        : ""}
                </button>
            ) : (
                <>
                    <PostList
                        posts={posts}
                        currentUserId={currentUser?.id ?? null}
                        onReact={handleReaction}
                        onEditPost={handleEditPost}
                        onDeletePost={handleDeletePost}
                    />

                    {hasNextPage && (
                        <button
                            type="button"
                            disabled={isFetchingNextPage}
                            onClick={() => void fetchNextPage()}
                            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isFetchingNextPage
                                ? "Đang tải thêm..."
                                : "Xem thêm"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
