import { create } from "zustand";

import {
    applyFeedChange,
    type FeedChangedPayload,
} from "./feed-realtime";

type FeedRealtimeState = {
    revision: number;
    syncRevision: number;
    recentEventIds: string[];
    ownerRevisions: Record<string, number>;
    lastChange: FeedChangedPayload | null;
    receiveFeedChange: (payload: FeedChangedPayload) => void;
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
        receiveFeedChange: (payload) => {
            set((state) => applyFeedChange(state, payload));
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
            });
        },
    }));
