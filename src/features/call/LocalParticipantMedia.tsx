import { useEffect, useRef } from "react";
import { Track } from "livekit-client";
import type { Room } from "livekit-client";
import { VideoOff } from "lucide-react";
type LocalParticipantMediaProps = {
    room: Room;
    isCameraEnabled: boolean;
};

export default function LocalParticipantMedia({
    room,
    isCameraEnabled,
}: LocalParticipantMediaProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => { /*React cần render thẻ <video> trước thì videoRef.current mới có giá trị*/
        const videoElement = videoRef.current;

        if (!videoElement || !isCameraEnabled) {
            return;
        }

        const cameraPublication =
            room.localParticipant.getTrackPublication( /* localParticipant (chính là tôi) remoteParticipants (chính là người khác) */
                Track.Source.Camera
            );

        const cameraTrack = cameraPublication?.videoTrack; /* kiểm tra xem có tín hiệu của camera không */

        if (!cameraTrack) {
            return;
        }

        cameraTrack.attach(videoElement);

        return () => {
            cameraTrack.detach(videoElement);
        };
    }, [room, isCameraEnabled]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-slate-900">
            <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                className={`h-full w-full scale-x-[-1] object-cover transition-opacity ${isCameraEnabled
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
            />

            {!isCameraEnabled && (
                <div className="absolute inset-0 grid place-items-center bg-slate-800 text-slate-300">
                    <div className="flex flex-col items-center gap-2">
                        <VideoOff className="h-6 w-6" />

                        <span className="text-xs font-medium">
                            Camera đang tắt
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}