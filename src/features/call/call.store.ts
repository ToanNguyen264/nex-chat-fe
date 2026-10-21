//Zustand store để React theo dõi trạng thái cuộc gọi. livekit.client.ts quản lý kết nối kỹ thuật, còn store quản lý trạng thái để UI hiển thị

import { RoomEvent } from "livekit-client";
import type { Room } from "livekit-client";
import { create } from "zustand";

import {
    endCallRequest,
    respondToIncomingCall,
    startOutgoingCall,
} from "../../api/call.api";
import type { CallAction } from "../../api/call.api";

import {
    joinCallRoom,
    leaveCallRoom,
    requestCallMediaPermissions,
} from "./livekit.client";
import type { CallMode } from "./livekit.client";

export type CallStatus =
    | "idle"
    | "connecting"
    | "connected"
    | "ending"
    | "error";



export type IncomingCall = {
    callId: string;
    conversationId: string;
    callerId: string;
    callType: CallMode;
    status: "ringing";
    createdAt: string;

    caller: {
        id: string;
        user_name: string | null;
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
    };
};

export type CallResponded = {
    callId: string;
    conversationId: string;
    callerId: string;
    calleeId: string;
    action: "accept" | "reject";
    status: "ongoing" | "rejected";
    answeredAt: string | null;
    endedAt: string | null;
};

export type CallEnded = {
    callId: string;
    conversationId: string;
    callerId: string;
    calleeId: string;
    status: "cancelled" | "ended";
    endedAt: string | null;
};


type CallState = {
    status: CallStatus;
    callId: string | null;
    conversationId: string | null;
    mode: CallMode | null;
    room: Room | null;
    error: string | null;

    incomingCall: IncomingCall | null;
    incomingCallAction: CallAction | null;
};

type CallActions = {
    startCall: (
        conversationId: string,
        mode: CallMode
    ) => Promise<void>;

    endCall: () => Promise<void>;

    clearCallError: () => void;

    receiveIncomingCall: (
        incomingCall: IncomingCall
    ) => void;

    receiveCallResponded: (
        response: CallResponded
    ) => void;

    receiveCallEnded: (response: CallEnded) => void;

    acceptIncomingCall: () => Promise<void>;

    rejectIncomingCall: () => Promise<void>;

    clearIncomingCall: () => void;
};

type CallStore = CallState & CallActions;

const initialState: CallState = {
    status: "idle",
    callId: null,
    conversationId: null,
    mode: null,
    room: null,
    error: null,
    incomingCall: null,
    incomingCallAction: null,
};

export const useCallStore = create<CallStore>()(
    /* 
    set(...): cập nhật dữ liệu trong store.
    get(): đọc dữ liệu hiện tại của store. */
    (set, get) => ({
        ...initialState, // trạng thái ban đầu

        startCall: async (conversationId, mode) => {
            const state = get(); //trả về toàn bộ dữ liệu store tại thời điểm đó.
            const currentStatus = state.status;

            // Chặn click nhiều lần khi đang kết nối
            if (
                currentStatus === "connecting" ||
                currentStatus === "connected" ||
                state.incomingCall !== null
            ) {
                return;
            }

            set({ /* cập nhật những field được truyền vào; các field còn lại được giữ nguyên */
                status: "connecting",
                callId: null,
                conversationId,
                mode,
                room: null,
                error: null,
            });

            

            try { /* bắt đầu kết nối với LiveKit */
                await requestCallMediaPermissions(mode);

                const call = await startOutgoingCall(
                    conversationId,
                    mode
                );

                set({
                    callId: call.id,
                });

                const room = await joinCallRoom(call.id, mode);

                room.on(RoomEvent.Disconnected, () => { /* khi LiveKit phát sự kiện Disconnected, hãy chạy đoạn code bên trong. */

                    if (get().room === room) { /*get().room là phòng hiện đang được lưu trong store | phòng đã đăng ký sự kiện Disconnected */
                        set(initialState);
                    }
                });

                set({
                    status: "connected",
                    room,
                    error: null,
                });
            } catch (error) {
                const callId = get().callId;

                if (callId) {
                    void endCallRequest(callId).catch(
                        (endError) => {
                            console.error(
                                "CLEAN UP FAILED CALL ERROR:",
                                endError
                            );
                        }
                    );
                }

                set({
                    ...initialState,
                    status: "error",
                    error:
                        error instanceof Error
                            ? error.message
                            : "Cannot connect to call",
                });
            }
        },

        endCall: async () => {
            const state = get();

            if (
                state.status === "idle" ||
                state.status === "ending"
            ) { /* case chưa có cuộc gọi nào hoặc đang kết thúc */
                return;
            }

            set({
                status: "ending",
            });

            try {
                if (state.callId) {
                    await endCallRequest(state.callId);
                }

                await leaveCallRoom();
                set(initialState);
            } catch (error) {
                set({
                    status: state.room ? "connected" : "error",
                    error:
                        error instanceof Error
                            ? error.message
                            : "Cannot end the call",
                });
            }
        },

        clearCallError: () => {
            set({
                error: null,
                status:
                    get().room !== null
                        ? "connected"
                        : "idle",
            });
        },

        receiveIncomingCall: (incomingCall) => {
            const currentStatus = get().status;

            // Tạm thời bỏ qua cuộc gọi mới nếu người dùng đang gọi
            if (
                currentStatus === "connecting" ||
                currentStatus === "connected" ||
                currentStatus === "ending"
            ) {
                return;
            }

            set({
                incomingCall,
                incomingCallAction: null,
                error: null,
            });
        },

        receiveCallResponded: (response) => {
            const state = get();
            const matchesIncomingCall =
                state.incomingCall?.callId === response.callId;
            const matchesCurrentCall =
                state.callId === response.callId;

            if (
                !matchesIncomingCall &&
                !matchesCurrentCall
            ) {
                return;
            }

            if (response.action === "reject") {
                if (state.room) {
                    void leaveCallRoom().catch((error) => {
                        console.error(
                            "LEAVE REJECTED CALL ERROR:",
                            error
                        );
                    });
                }

                set(initialState);
                return;
            }

            if (matchesIncomingCall && state.incomingCall) {
                set({
                    incomingCall: null,
                    incomingCallAction: null,
                    callId: response.callId,
                    conversationId: response.conversationId,
                    mode: state.incomingCall.callType,
                    error: null,
                });
            }
        },

        receiveCallEnded: (response) => {
            const state = get();
            const matchesIncomingCall =
                state.incomingCall?.callId === response.callId;
            const matchesCurrentCall =
                state.callId === response.callId;

            if (
                !matchesIncomingCall &&
                !matchesCurrentCall
            ) {
                return;
            }

            void leaveCallRoom().catch((error) => {
                console.error(
                    "LEAVE ENDED CALL ERROR:",
                    error
                );
            });
            set(initialState);
        },

        acceptIncomingCall: async () => {
            const incomingCall = get().incomingCall;

            if (!incomingCall || get().incomingCallAction) {
                return;
            }

            set({
                incomingCallAction: "accept",
                error: null,
            });

            let hasAcceptedCall = false;

            try {
                await requestCallMediaPermissions(
                    incomingCall.callType
                );

                await respondToIncomingCall(
                    incomingCall.callId,
                    "accept"
                );
                hasAcceptedCall = true;

                set({
                    status: "connecting",
                    callId: incomingCall.callId,
                    conversationId: incomingCall.conversationId,
                    mode: incomingCall.callType,
                    room: null,
                    incomingCall: null,
                    incomingCallAction: null,
                    error: null,
                });

                const room = await joinCallRoom(
                    incomingCall.callId,
                    incomingCall.callType
                );

                room.on(RoomEvent.Disconnected, () => {
                    if (get().room === room) {
                        set(initialState);
                    }
                });

                set({
                    status: "connected",
                    room,
                    error: null,
                });
            } catch (error) {
                if (hasAcceptedCall) {
                    void endCallRequest(
                        incomingCall.callId
                    ).catch((endError) => {
                        console.error(
                            "CLEAN UP FAILED ACCEPT ERROR:",
                            endError
                        );
                    });
                }

                set({
                    status: "idle",
                    incomingCall,
                    incomingCallAction: null,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Cannot accept the call",
                });
            }
        },

        rejectIncomingCall: async () => {
            const incomingCall = get().incomingCall;

            if (!incomingCall || get().incomingCallAction) {
                return;
            }

            set({
                incomingCallAction: "reject",
                error: null,
            });

            try {
                await respondToIncomingCall(
                    incomingCall.callId,
                    "reject"
                );

                set(initialState);
            } catch (error) {
                set({
                    incomingCall,
                    incomingCallAction: null,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Cannot reject the call",
                });
            }
        },

        clearIncomingCall: () => {
            set({
                incomingCall: null,
                incomingCallAction: null,
                error: null,
            });
        },
    })
);
