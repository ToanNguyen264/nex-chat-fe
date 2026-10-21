import api from "./axios";

export type CallTokenData = {
    token: string;
    roomName: string;
    serverUrl: string;
};

export type CallAction = "accept" | "reject";

export type CallData = {
    id: string;
    conversation_id: string;
    caller_id: string;
    callee_id: string;
    room_name: string;
    call_type: "audio" | "video";
    status:
        | "ringing"
        | "ongoing"
        | "rejected"
        | "cancelled"
        | "missed"
        | "ended";
};

type CallTokenResponse = {
    success: boolean;
    data: CallTokenData;
};

type StartCallResponse = {
    success: boolean;
    data: {
        call: CallData;
    };
};

type RespondToCallResponse = {
    success: boolean;
    data: CallData;
};

type EndCallResponse = {
    success: boolean;
    data: CallData;
};

export const createCallToken = async (
    callId: string
): Promise<CallTokenData> => {
    const response = await api.post<CallTokenResponse>(
        `/calls/${callId}/token`
    );

    return response.data.data;
};

export const startOutgoingCall = async (
    conversationId: string,
    callType: "audio" | "video"
): Promise<CallData> => {
    const response = await api.post<StartCallResponse>(
        `/calls/conversations/${conversationId}`,
        { callType }
    );

    return response.data.data.call;
};

export const respondToIncomingCall = async (
    callId: string,
    action: CallAction
): Promise<CallData> => {
    const response = await api.post<RespondToCallResponse>(
        `/calls/${callId}/respond`,
        { action }
    );

    return response.data.data;
};

export const endCallRequest = async (
    callId: string
): Promise<CallData> => {
    const response = await api.post<EndCallResponse>(
        `/calls/${callId}/end`
    );

    return response.data.data;
};
