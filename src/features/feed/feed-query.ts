import {
    infiniteQueryOptions,
    type InfiniteData,
} from "@tanstack/react-query";

import {
    getPosts,
    getUserPosts,
    type PaginatedPosts,
    type PostFromApi,
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
