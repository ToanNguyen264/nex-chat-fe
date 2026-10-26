import {
    useEffect,
    useRef,
    useState,
} from "react";
import Draggable from "react-draggable";
import type {
    RemoteParticipant,
} from "livekit-client";

import RemoteParticipantMedia from "./RemoteParticipantMedia";
import LocalParticipantMedia from "./LocalParticipantMedia";

import {
    LoaderCircle,
    Maximize2,
    Mic,
    MicOff,
    Minimize2,
    Phone,
    PhoneIncoming,
    PhoneOff,
    Video,
    VideoOff,
    Volume2,
    X,
} from "lucide-react";
import { RoomEvent } from "livekit-client";

import { useCallStore } from "./call.store";


export default function CallOverlay() {
    const status = useCallStore(
        (state) => state.status
    );
    const direction = useCallStore(
        (state) => state.direction
    );
    const callId = useCallStore(
        (state) => state.callId
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

    const [canPlayAudio, setCanPlayAudio] = useState(true);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] =
        useState(true);
    const [isMicrophoneUpdating, setIsMicrophoneUpdating] =
        useState(false);
    const [isCameraEnabled, setIsCameraEnabled] =
        useState(true);
    const [isCameraUpdating, setIsCameraUpdating] =
        useState(false);

    // Quản lý thu nhỏ popup, phóng to video cá nhân và tọa độ cho react-draggable
    const [isCallMinimized, setIsCallMinimized] =
        useState(false);
    const [isLocalVideoExpanded, setIsLocalVideoExpanded] =
        useState(false);
    const [localVideoOffset, setLocalVideoOffset] =
        useState({ x: 0, y: 0 });
    const [minimizedOffset, setMinimizedOffset] =
        useState({ x: 0, y: 0 });

    const minimizedPopupRef = useRef<HTMLDivElement | null>(null);
    const localVideoRef = useRef<HTMLDivElement | null>(null);
    const didDragMoveRef = useRef(false);

    // Reset lại toàn bộ vị trí và kích thước khi bắt đầu/kết thúc cuộc gọi
    useEffect(() => {
        if (status === "idle") {
            setIsCallMinimized(false);
            setIsLocalVideoExpanded(false);
            setLocalVideoOffset({ x: 0, y: 0 });
            setMinimizedOffset({ x: 0, y: 0 });
            didDragMoveRef.current = false;
        }
    }, [status]);

    useEffect(() => {
        if (!incomingCall || incomingCallAction !== null) {
            return;
        }

        const ringtone = new Audio(
            "/audio/call-ringtone.mp3"
        );

        ringtone.loop = true;
        ringtone.preload = "auto";
        ringtone.volume = 0.7;

        void ringtone.play().catch((error) => {
            console.warn(
                "PLAY INCOMING CALL RINGTONE ERROR:",
                error
            );
        });

        return () => {
            ringtone.pause();
            ringtone.currentTime = 0;
        };
    }, [incomingCall, incomingCallAction]);

    useEffect(() => {
        const isWaitingForRemoteParticipant =
            direction === "outgoing" &&
            callId !== null &&
            (status === "connecting" ||
                status === "connected") &&
            remoteParticipants.length === 0;

        if (!isWaitingForRemoteParticipant) {
            return;
        }

        const ringback = new Audio(
            "/audio/call-ringback.mp3"
        );

        ringback.loop = true;
        ringback.preload = "auto";
        ringback.volume = 0.7;

        void ringback.play().catch((error) => {
            console.warn(
                "PLAY OUTGOING CALL RINGBACK ERROR:",
                error
            );
        });

        return () => {
            ringback.pause();
            ringback.currentTime = 0;
        };
    }, [
        callId,
        direction,
        remoteParticipants.length,
        status,
    ]);

    useEffect(() => {
        setIsMicrophoneEnabled(
            room?.localParticipant.isMicrophoneEnabled ?? true
        );
        setIsCameraEnabled(
            room?.localParticipant.isCameraEnabled ?? true
        );
    }, [room]);

    /* lắng nghe trạng thái audio từ LiveKit */

    useEffect(() => {
        if (!room) {
            setCanPlayAudio(true);
            return;
        }

        const synchronizeAudioPlayback = () => {
            setCanPlayAudio(room.canPlaybackAudio);
        };

        synchronizeAudioPlayback();

        room.on(
            RoomEvent.AudioPlaybackStatusChanged,
            synchronizeAudioPlayback
        );

        return () => {
            room.off(
                RoomEvent.AudioPlaybackStatusChanged,
                synchronizeAudioPlayback
            );
        };
    }, [room]);



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
    /* hàm bật âm thanh */
    const handleStartAudio = async () => {
        if (!room) {
            return;
        }

        try {
            await room.startAudio();
            setCanPlayAudio(room.canPlaybackAudio);
        } catch (error) {
            console.error(
                "START AUDIO PLAYBACK ERROR:",
                error
            );
        }
    };

    const handleToggleMicrophone = async () => {
        if (!room || isMicrophoneUpdating) {
            return;
        }

        const nextMicrophoneState =
            !room.localParticipant.isMicrophoneEnabled;

        setIsMicrophoneUpdating(true);

        try {
            await room.localParticipant.setMicrophoneEnabled(
                nextMicrophoneState
            );
            setIsMicrophoneEnabled(
                room.localParticipant.isMicrophoneEnabled
            );
        } catch (error) {
            console.error(
                "TOGGLE MICROPHONE ERROR:",
                error
            );
        } finally {
            setIsMicrophoneUpdating(false);
        }
    };

    const handleToggleCamera = async () => {
        if (!room || isCameraUpdating) {
            return;
        }

        const nextCameraState = !room.localParticipant.isCameraEnabled;

        setIsCameraUpdating(true);

        try {
            await room.localParticipant.setCameraEnabled(
                nextCameraState
            );
            setIsCameraEnabled(
                room.localParticipant.isCameraEnabled
            );
        } catch (error) {
            console.error(
                "TOGGLE CAMERA ERROR:",
                error
            );
        } finally {
            setIsCameraUpdating(false);
        }
    };

    // Click vào khung video cá nhân để phóng to / thu nhỏ
    const handleLocalVideoClick = () => {
        // Nếu vừa kéo di chuyển bằng react-draggable thì bỏ qua click
        if (didDragMoveRef.current) {
            didDragMoveRef.current = false;
            return;
        }

        setIsLocalVideoExpanded((prev) => {
            const nextExpanded = !prev;
            // Đưa về góc mặc định khi phóng to / thu nhỏ để không tràn mép
            setLocalVideoOffset({ x: 0, y: 0 });
            return nextExpanded;
        });
    };

    // Khi bấm nút Thu nhỏ / Mở rộng toàn bộ popup cuộc gọi
    const handleToggleMinimizeCall = () => {
        setIsCallMinimized((prev) => {
            const nextState = !prev;
            if (nextState) {
                setIsLocalVideoExpanded(false);
            }
            setLocalVideoOffset({ x: 0, y: 0 });
            return nextState;
        });
    };




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
        <Draggable
            nodeRef={minimizedPopupRef}
            disabled={!isCallMinimized}
            handle=".call-drag-handle"
            cancel="button"
            bounds="body"
            position={
                isCallMinimized
                    ? minimizedOffset
                    : { x: 0, y: 0 }
            }
            onDrag={(_, data) => {
                setMinimizedOffset({
                    x: data.x,
                    y: data.y,
                });
            }}
        >
            <div
                ref={minimizedPopupRef}
                className={
                    isCallMinimized
                        ? "fixed bottom-5 right-5 z-[100]"
                        : "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4"
                }
            >
                <section
                    className={`flex flex-col overflow-hidden bg-slate-900 shadow-2xl transition-[width,height,border-radius] duration-200 ${isCallMinimized
                        ? "h-64 w-80 rounded-2xl border border-white/15 ring-1 ring-black/40 sm:h-72 sm:w-96"
                        : "h-[min(680px,calc(100vh-2rem))] w-full max-w-4xl rounded-3xl"
                        }`}
                >
                    <header
                        className={`call-drag-handle flex items-center justify-between text-white ${isCallMinimized
                            ? "cursor-grab px-4 py-2.5 select-none touch-none active:cursor-grabbing"
                            : "px-6 py-4"
                            }`}
                    >
                        <div>
                            <h2
                                className={`font-bold ${isCallMinimized
                                    ? "text-sm"
                                    : "text-base"
                                    }`}
                            >
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

                        <div className="flex items-center gap-2">
                            {status === "connecting" && (
                                <LoaderCircle className="h-5 w-5 animate-spin text-indigo-400" />
                            )}

                            <button
                                type="button"
                                onClick={
                                    handleToggleMinimizeCall
                                }
                                aria-label={
                                    isCallMinimized
                                        ? "Phóng to cửa sổ cuộc gọi"
                                        : "Thu nhỏ cửa sổ cuộc gọi"
                                }
                                title={
                                    isCallMinimized
                                        ? "Mở rộng toàn màn hình"
                                        : "Thu nhỏ để lướt bảng tin / nhắn tin"
                                }
                                className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700 hover:text-white"
                            >
                                {isCallMinimized ? (
                                    <Maximize2 className="h-4 w-4" />
                                ) : (
                                    <Minimize2 className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </header>

                    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950">

                        {status === "connected" &&
                            room &&
                            !canPlayAudio && (
                                <button
                                    type="button"
                                    onClick={() => void handleStartAudio()}
                                    className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
                                >
                                    <Volume2 className="h-4 w-4" />
                                    Bật âm thanh
                                </button>
                            )}
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
                        {status === "connected" &&
                            mode === "video" &&
                            room && (
                                <Draggable
                                    nodeRef={localVideoRef}
                                    bounds="parent"
                                    position={localVideoOffset}
                                    onStart={() => {
                                        didDragMoveRef.current =
                                            false;
                                    }}
                                    onDrag={(_, data) => {
                                        didDragMoveRef.current =
                                            true;
                                        setLocalVideoOffset({
                                            x: data.x,
                                            y: data.y,
                                        });
                                    }}
                                >
                                    <div
                                        ref={localVideoRef}
                                        onClick={
                                            handleLocalVideoClick
                                        }
                                        title={
                                            isLocalVideoExpanded
                                                ? "Click để thu nhỏ video của bạn (Kéo để di chuyển)"
                                                : "Click để phóng to video của bạn (Kéo để di chuyển)"
                                        }
                                        className={`group absolute right-3 top-3 z-20 aspect-video cursor-grab overflow-hidden rounded-xl border-2 border-white/80 bg-slate-900 shadow-2xl transition-[width,height,box-shadow] duration-200 active:cursor-grabbing select-none touch-none ${isCallMinimized
                                            ? "w-24 sm:w-28"
                                            : isLocalVideoExpanded
                                                ? "w-72 sm:w-96 ring-2 ring-indigo-500/70"
                                                : "w-40 sm:w-48"
                                            }`}
                                    >
                                        <LocalParticipantMedia
                                            room={room}
                                            isCameraEnabled={
                                                isCameraEnabled
                                            }
                                        />

                                        {!isCallMinimized && (
                                            <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-slate-950/70 p-1 text-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                                {isLocalVideoExpanded ? (
                                                    <Minimize2 className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Maximize2 className="h-3.5 w-3.5" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </Draggable>
                            )
                        }
                    </div>

                    <footer className={`flex items-center justify-center bg-slate-900 ${isCallMinimized
                        ? "h-14 gap-3"
                        : "h-24 gap-5"
                        }`}>
                        <button
                            type="button"
                            aria-label={
                                isMicrophoneEnabled
                                    ? "Tắt micro"
                                    : "Bật micro"
                            }
                            title={
                                isMicrophoneEnabled
                                    ? "Tắt micro"
                                    : "Bật micro"
                            }
                            disabled={
                                status !== "connected" ||
                                isMicrophoneUpdating
                            }
                            onClick={() =>
                                void handleToggleMicrophone()
                            }
                            className={`grid place-items-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${isCallMinimized
                                ? "h-10 w-10"
                                : "h-14 w-14"
                                } ${isMicrophoneEnabled
                                    ? "bg-slate-700 hover:bg-slate-600"
                                    : "bg-rose-600 hover:bg-rose-700"
                                }`}
                        >
                            {isMicrophoneUpdating ? (
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                            ) : isMicrophoneEnabled ? (
                                <Mic className={isCallMinimized ? "h-5 w-5" : "h-6 w-6"} />
                            ) : (
                                <MicOff className={isCallMinimized ? "h-5 w-5" : "h-6 w-6"} />
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label="Kết thúc cuộc gọi"
                            disabled={status !== "connected"}
                            onClick={() => void endCall()}
                            className={`grid place-items-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 ${isCallMinimized
                                ? "h-10 w-10"
                                : "h-14 w-14"
                                }`}
                        >
                            <PhoneOff className={isCallMinimized ? "h-5 w-5" : "h-6 w-6"} />
                        </button>

                        {mode === "video" && (
                            <button
                                type="button"
                                aria-label={
                                    isCameraEnabled
                                        ? "Tắt camera"
                                        : "Bật camera"
                                }
                                title={
                                    isCameraEnabled
                                        ? "Tắt camera"
                                        : "Bật camera"
                                }
                                disabled={
                                    status !== "connected" ||
                                    isCameraUpdating
                                }
                                onClick={() =>
                                    void handleToggleCamera()
                                }
                                className={`grid place-items-center rounded-full text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${isCallMinimized
                                    ? "h-10 w-10"
                                    : "h-14 w-14"
                                    } ${isCameraEnabled
                                        ? "bg-slate-700 hover:bg-slate-600"
                                        : "bg-rose-600 hover:bg-rose-700"
                                    }`}
                            >
                                {isCameraUpdating ? (
                                    <LoaderCircle className="h-5 w-5 animate-spin" />
                                ) : isCameraEnabled ? (
                                    <Video className={isCallMinimized ? "h-5 w-5" : "h-6 w-6"} />
                                ) : (
                                    <VideoOff className={isCallMinimized ? "h-5 w-5" : "h-6 w-6"} />
                                )}
                            </button>
                        )}
                    </footer>
                </section>
            </div>
        </Draggable>
    );
}
