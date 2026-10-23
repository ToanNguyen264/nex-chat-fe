export type FeedChangedPayload = {
    eventId: string;
    action: "created" | "updated" | "deleted";
    postId: string;
    ownerId: string;
    occurredAt: string;
};

export type FeedRealtimeSnapshot = { /* Cấu trúc dữ liệu lưu trạng thái Feed */
    revision: number;
    recentEventIds: string[];
    ownerRevisions: Record<string, number>;
    lastChange?: FeedChangedPayload | null;
};

const isPositiveIntegerString = (
    value: unknown
): value is string =>
    typeof value === "string" && /^[1-9]\d*$/.test(value);

export const parseFeedChangedPayload = (
    value: unknown
): FeedChangedPayload | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const payload = value as Record<string, unknown>;
    const action = payload.action;

    if (
        typeof payload.eventId !== "string" ||
        !payload.eventId ||
        (action !== "created" &&
            action !== "updated" &&
            action !== "deleted") ||
        !isPositiveIntegerString(payload.postId) ||
        !isPositiveIntegerString(payload.ownerId) ||
        typeof payload.occurredAt !== "string" ||
        Number.isNaN(Date.parse(payload.occurredAt))
    ) {
        return null;
    }

    return {
        eventId: payload.eventId,
        action,
        postId: payload.postId,
        ownerId: payload.ownerId,
        occurredAt: payload.occurredAt,
    };
};

export const applyFeedChange = ( /* Cập nhật trạng thái Feed khi có sự kiện mới */
    state: FeedRealtimeSnapshot,
    payload: FeedChangedPayload
): FeedRealtimeSnapshot => {
    if (state.recentEventIds.includes(payload.eventId)) {
        return state;
    }

    return {
        revision: state.revision + 1,
        recentEventIds: [
            ...state.recentEventIds,
            payload.eventId,
        ].slice(-100),
        ownerRevisions: {
            ...state.ownerRevisions,
            [payload.ownerId]:
                (state.ownerRevisions[payload.ownerId] ?? 0) + 1,
        },
        lastChange: payload,
    };
};
