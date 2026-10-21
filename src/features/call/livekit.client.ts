import { Room } from "livekit-client";

import { createCallToken } from "../../api/call.api";

export type CallMode = "audio" | "video";

let activeRoom: Room | null = null;


export const requestCallMediaPermissions = async (
    mode: CallMode
) => {
    try {
        const mediaStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: mode === "video",
            });

        // Chỉ kiểm tra và xin quyền, chưa truyền media.
        // LiveKit sẽ mở lại thiết bị khi tham gia phòng.
        mediaStream
            .getTracks()
            .forEach((track) => track.stop());
    } catch (error) {
        if (
            error instanceof DOMException &&
            (
                error.name === "NotAllowedError" ||
                error.name === "SecurityError"
            )
        ) {
            throw new Error(
                mode === "video"
                    ? "Bạn cần cho phép sử dụng microphone và camera"
                    : "Bạn cần cho phép sử dụng microphone"
            );
        }

        throw error;
    }
};


export const joinCallRoom = async (
    callId: string,
    mode: CallMode
) => {
    // Không cho tồn tại hai phòng trên cùng một trình duyệt
    if (activeRoom) {
        await activeRoom.disconnect();
        activeRoom = null;
    }

    const { token, serverUrl } =
        await createCallToken(callId);

    const room = new Room();

    try {
        // Kết nối trình duyệt tới LiveKit Server
        await room.connect(serverUrl, token);

        // Cả cuộc gọi thường và video đều cần microphone
        await room.localParticipant.setMicrophoneEnabled(true);

        // Chỉ bật camera nếu là cuộc gọi video
        if (mode === "video") {
            await room.localParticipant.setCameraEnabled(true);
        }

        activeRoom = room;

        return room;
    } catch (error) {
        await room.disconnect();
        throw error;
    }
};

export const leaveCallRoom = async () => {
    if (!activeRoom) {
        return;
    }

    await activeRoom.disconnect();
    activeRoom = null;
};

export const getActiveCallRoom = () => {
    return activeRoom;
};
