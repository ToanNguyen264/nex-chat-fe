import {
    useEffect,
    useRef,
    useState,
} from "react";
import type {
    RemoteParticipant,
} from "livekit-client";

import RemoteParticipantMedia from "./RemoteParticipantMedia";

import {
    LoaderCircle,
    Phone,
    PhoneIncoming,
    PhoneOff,
    Video,
    X,
} from "lucide-react";
import { Track, RoomEvent } from "livekit-client";

import { useCallStore } from "./call.store";

export default function CallOverlay() {
    const status = useCallStore(
        (state) => state.status
    );
    const mode = useCallStore(
        (state) => state.mode
    );
    const room = useCallStore(
        (state) => state.room
    );
    const error = useCallStore(
        (state) => state.error
    );
    const incomingCall = useCallStore(
        (state) => state.incomingCall
    );
    const incomingCallAction = useCallStore(
        (state) => state.incomingCallAction
    );
    const acceptIncomingCall = useCallStore(
        (state) => state.acceptIncomingCall
    );
    const rejectIncomingCall = useCallStore(
        (state) => state.rejectIncomingCall
    );
    const endCall = useCallStore(
        (state) => state.endCall
    );
    const clearCallError = useCallStore(
        (state) => state.clearCallError
    );

    const [
        remoteParticipants,
        setRemoteParticipants,
    ] = useState<RemoteParticipant[]>([]); /* tạo mảng chứa các participant từ xa */

    const localVideoRef =
        useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (
            status !== "connected" ||
            mode !== "video" ||
            !room ||
            !localVideoRef.current
        ) {
            return;
        }

        const videoElement = localVideoRef.current;

        const cameraTrack =
            room.localParticipant
                .getTrackPublication(Track.Source.Camera)
                ?.videoTrack;

        if (!cameraTrack) {
            return;
        }

        cameraTrack.attach(videoElement);

        return () => {
            cameraTrack.detach(videoElement);
        };
    }, [mode, room, status]);

    /*Theo dõi người vào và rời phòng*/
    useEffect(() => {
        if (!room) {
            setRemoteParticipants([]);
            return;
        }

        const synchronizeParticipants = () => {
            setRemoteParticipants(
                Array.from(
                    room.remoteParticipants.values()
                )
            );
        };

        // Lấy những người đã có sẵn trong phòng
        synchronizeParticipants();

        room.on(
            RoomEvent.ParticipantConnected,
            synchronizeParticipants
        );

        room.on(
            RoomEvent.ParticipantDisconnected,
            synchronizeParticipants
        );

        return () => {
            room.off(
                RoomEvent.ParticipantConnected,
                synchronizeParticipants
            );

            room.off(
                RoomEvent.ParticipantDisconnected,
                synchronizeParticipants
            );
        };
    }, [room]);

    const remoteParticipant = remoteParticipants[0] ?? null; /*lấy người tham gia đầu tiên vì đang làm cuộc gọi 1:1 */

    if (incomingCall) {
        const fullName = [
            incomingCall.caller.first_name,
            incomingCall.caller.last_name,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();
        const callerName =
            fullName ||
            incomingCall.caller.user_name ||
            "Người dùng";
        const callerInitial = callerName
            .charAt(0)
            .toUpperCase();
        const isResponding = incomingCallAction !== null;

        return (
            <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
                <section className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
                    <div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700 ring-4 ring-indigo-50">
                        {incomingCall.caller.avatar ? (
                            <img
                                src={incomingCall.caller.avatar}
                                alt={callerName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            callerInitial
                        )}
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        {callerName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {incomingCall.callType === "video"
                            ? "Đang gọi video cho bạn"
                            : "Đang gọi thoại cho bạn"}
                    </p>

                    {error && (
                        <p className="mt-3 text-sm text-rose-600">
                            {error}
                        </p>
                    )}

                    <div className="mt-8 flex items-center justify-center gap-10">
                        <div className="text-center">
                            <button
                                type="button"
                                aria-label="Từ chối cuộc gọi"
                                disabled={isResponding}
                                onClick={() =>
                                    void rejectIncomingCall()
                                }
                                className="grid h-16 w-16 place-items-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {incomingCallAction === "reject" ? (
                                    <LoaderCircle className="h-7 w-7 animate-spin" />
                                ) : (
                                    <PhoneOff className="h-7 w-7" />
                                )}
                            </button>
                            <p className="mt-2 text-xs font-medium text-slate-500">
                                Từ chối
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                aria-label="Chấp nhận cuộc gọi"
                                disabled={isResponding}
                                onClick={() =>
                                    void acceptIncomingCall()
                                }
                                className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {incomingCallAction === "accept" ? (
                                    <LoaderCircle className="h-7 w-7 animate-spin" />
                                ) : incomingCall.callType === "video" ? (
                                    <Video className="h-7 w-7" />
                                ) : (
                                    <PhoneIncoming className="h-7 w-7" />
                                )}
                            </button>
                            <p className="mt-2 text-xs font-medium text-slate-500">
                                Chấp nhận
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    if (status === "idle") {
        return null;
    }



    if (status === "error") {
        return (
            <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
                    <h2 className="text-lg font-bold text-slate-900">
                        Không thể thực hiện cuộc gọi
                    </h2>

                    <p className="mt-2 text-sm text-rose-600">
                        {error ?? "Đã xảy ra lỗi kết nối"}
                    </p>

                    <button
                        type="button"
                        onClick={clearCallError}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                    >
                        <X className="h-4 w-4" />
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4">
            <section className="flex h-[min(680px,calc(100vh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
                <header className="flex items-center justify-between px-6 py-4 text-white">
                    <div>
                        <h2 className="font-bold">
                            {mode === "video"
                                ? "Cuộc gọi video"
                                : "Cuộc gọi thoại"}
                        </h2>

                        <p className="text-xs text-slate-400">
                            {status === "connecting" &&
                                "Đang kết nối..."}

                            {status === "connected" &&
                                "Đã kết nối"}

                            {status === "ending" &&
                                "Đang kết thúc..."}
                        </p>
                    </div>

                    {status === "connecting" && (
                        <LoaderCircle className="h-5 w-5 animate-spin text-indigo-400" />
                    )}
                </header>

                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950">
                    {status === "connected" &&
                        room &&
                        remoteParticipant ? (
                        <RemoteParticipantMedia
                            room={room}
                            participant={remoteParticipant}
                            showVideo={mode === "video"}
                        />
                    ) : (
                        <div className="grid place-items-center text-center">
                            <div className="grid h-28 w-28 place-items-center rounded-full bg-indigo-600 text-white">
                                {mode === "video" ? (
                                    <Video className="h-12 w-12" />
                                ) : (
                                    <Phone className="h-12 w-12" />
                                )}
                            </div>

                            {status === "connected" && (
                                <p className="mt-4 text-sm text-slate-400">
                                    Đang chờ người kia tham gia...
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <footer className="flex h-24 items-center justify-center bg-slate-900">
                    <button
                        type="button"
                        aria-label="Kết thúc cuộc gọi"
                        disabled={status !== "connected"}
                        onClick={() => void endCall()}
                        className="grid h-14 w-14 place-items-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </footer>
            </section>
        </div>
    );
}
