import { create } from "zustand";

import type { ReactionSummaryItem } from "../../api/post.api";
import {
    applyFeedChange,
    type FeedChangedPayload,
} from "./feed-realtime";

export type RealtimePostReactionUpdate = {
    postId: string;
    reactionCount: number;
    reactionSummary: ReactionSummaryItem[];
};

type FeedRealtimeState = {
    revision: number;
    syncRevision: number;
    recentEventIds: string[];
    ownerRevisions: Record<string, number>;
    lastChange: FeedChangedPayload | null;
    lastReactionUpdate: RealtimePostReactionUpdate | null;
    receiveFeedChange: (payload: FeedChangedPayload) => void;
    receivePostReaction: (
        update: RealtimePostReactionUpdate
    ) => void;
    requestFeedSync: () => void;
    resetFeedRealtime: () => void;
};

export const useFeedRealtimeStore =
    create<FeedRealtimeState>((set) => ({
        revision: 0,
        syncRevision: 0,
        recentEventIds: [],
        ownerRevisions: {},
        lastChange: null,
        lastReactionUpdate: null,
        receiveFeedChange: (payload) => {
            set((state) => applyFeedChange(state, payload));
        },
        receivePostReaction: (update) => {
            set({
                lastReactionUpdate: update,
            });
        },
        requestFeedSync: () => {
            set((state) => ({
                syncRevision: state.syncRevision + 1,
                lastChange: null,
            }));
        },
        resetFeedRealtime: () => {
            set({
                revision: 0,
                syncRevision: 0,
                recentEventIds: [],
                ownerRevisions: {},
                lastChange: null,
                lastReactionUpdate: null,
            });
        },
    }));
