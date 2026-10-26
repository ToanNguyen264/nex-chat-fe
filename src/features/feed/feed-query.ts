import {
    infiniteQueryOptions,
    type InfiniteData,
} from "@tanstack/react-query";

import {
    getPosts,
    getUserPosts,
    type PaginatedPosts,
    type PostFromApi,
    type ReactionSummaryItem,
    type ReactionType,
} from "../../api/post.api";

export const feedQueryKeys = {
    all: ["feed"] as const,
    home: () => ["feed", "home"] as const,
    profile: (ownerId: string) =>
        ["feed", "profile", ownerId] as const,
};

export const getNextFeedPageParam = (
    lastPage: PaginatedPosts
): string | undefined =>
    lastPage.pagination.hasNextPage
        ? lastPage.pagination.nextCursor ?? undefined
        : undefined;

export const createFeedInfiniteQueryOptions = (
    onlyUserId?: string
) =>
    infiniteQueryOptions({
        queryKey: onlyUserId
            ? feedQueryKeys.profile(onlyUserId)
            : feedQueryKeys.home(),
        initialPageParam: null as string | null,
        queryFn: ({ pageParam }) =>
            onlyUserId
                ? getUserPosts(onlyUserId, {
                    cursor: pageParam,
                })
                : getPosts({ cursor: pageParam }),
        getNextPageParam: getNextFeedPageParam,
    });

export const updatePostInInfiniteFeed = (
    data: InfiniteData<PaginatedPosts>,
    postId: string,
    updater: (post: PostFromApi) => PostFromApi
): InfiniteData<PaginatedPosts> => ({
    ...data,
    pages: data.pages.map((page) => ({
        ...page,
        posts: page.posts.map((post) =>
            post.id === postId ? updater(post) : post
        ),
    })),
});

export const applyOptimisticPostReaction = (
    post: PostFromApi,
    reactionType: ReactionType
): PostFromApi => {
    const previousReaction = post.currentReaction;
    const nextReaction = previousReaction === reactionType ? null : reactionType;

    const counts = new Map<ReactionType, number>(); /* thống kê thành mảng { reactionType: "love", count: 1 }] */

    for (const item of post.reactionSummary ?? []) { /* nếu post.reactionSummary không tồn tại thì mặc định đây là mảng rỗng */
        if (item.count > 0) {
            counts.set(item.reactionType, item.count); /* lưu số lượng cảm xúc hiện tại vào bảng counts */
        }
    }

    if (previousReaction) { /* kiểm tra trước đó đã có thả cảm xúc chưa nếu có thì -1  */
        const currentCount = counts.get(previousReaction) ?? 0;

        if (currentCount <= 1) {
            counts.delete(previousReaction);
        } else {
            counts.set(previousReaction, currentCount - 1);
        }
    }

    if (nextReaction) { /* nếu có cảm xúc mới được thêm vào */
        counts.set(nextReaction, (counts.get(nextReaction) ?? 0) + 1); /* lấy số lượng cảm xúc mới và cộng thêm 1 */
    }

    const nextSummary: ReactionSummaryItem[] = []; /* chứa mảng cảm xúc [{ reactionType: "love", count: 2 }, { reactionType: "haha", count: 1 }] */
    let nextCount = 0;

    for (const [type, count] of counts) {
        nextSummary.push({
            reactionType: type,
            count: count,
        });
        nextCount += count;
    }

    nextSummary.sort((a, b) => b.count - a.count); /*Sắp xếp cảm xúc phổ biến nhất lên đầu */
 
    return {
        ...post,
        currentReaction: nextReaction,
        reactionCount: nextCount,
        reactionSummary: nextSummary,
    };
};

export const removePostFromInfiniteFeed = (
    data: InfiniteData<PaginatedPosts>,
    postId: string
): InfiniteData<PaginatedPosts> => ({
    ...data,
    pages: data.pages.map((page) => ({
        ...page,
        posts: page.posts.filter((post) => post.id !== postId),
    })),
});

export const prependPostToInfiniteFeed = (
    data: InfiniteData<PaginatedPosts>,
    post: PostFromApi
): InfiniteData<PaginatedPosts> => {
    const [firstPage, ...remainingPages] = data.pages;

    if (!firstPage) {
        return data;
    }

    return {
        ...data,
        pages: [
            {
                ...firstPage,
                posts: [
                    post,
                    ...firstPage.posts.filter(
                        (currentPost) => currentPost.id !== post.id
                    ),
                ],
            },
            ...remainingPages,
        ],
    };
};

export const flattenFeedPosts = (
    data: InfiniteData<PaginatedPosts> | undefined
): PostFromApi[] => {
    const uniquePosts = new Map<string, PostFromApi>();

    for (const page of data?.pages ?? []) {
        for (const post of page.posts) {
            if (!uniquePosts.has(post.id)) {
                uniquePosts.set(post.id, post);
            }
        }
    }

    return Array.from(uniquePosts.values());
};
