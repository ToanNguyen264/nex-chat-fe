import {
    useEffect,
    useReducer,
    useRef,
} from "react";
import {
    RoomEvent,
    Track,
} from "livekit-client";
import type {
    RemoteParticipant,
    Room,
} from "livekit-client";
import { User } from "lucide-react";

type RemoteParticipantMediaProps = {
    room: Room;
    participant: RemoteParticipant;
    showVideo: boolean;
};

export default function RemoteParticipantMedia({
    room,
    participant,
    showVideo,
}: RemoteParticipantMediaProps) {
    const audioRef = useRef<HTMLAudioElement>(null); /* tạo tham chiếu cho thẻ audio để tí nữa render sẽ có dữ liệu */
    const videoRef = useRef<HTMLVideoElement>(null); 
    /* 
        Dùng bản chất của DOM để lấy thẻ audio và video
        videoRef lúc này sẽ là: videoRef.current.play();
                                videoRef.current.pause();
                                videoRef.current.muted = true;
                                videoRef.current.srcObject = mediaStream;
            => vì typesript sẽ hiểu đây là video nên cho phép gọi các hàm như play, pause, muted,
        ban đầu videoRef.current sẽ là null vì react chưa render ra thẻ video
        <video ref={videoRef} /> => videoRef.current = HTMLVideoElement;
    
    */


    // Dùng để render lại khi track thay đổi, trackVersion là video hoặc audio của người bên kia, khi track thay đổi thì render lại để gắn track mới vào thẻ video hoặc audio
    const [trackVersion, refreshTracks] = useReducer((value: number) => value + 1, 0);

    useEffect(() => {
        const handleTrackChange = () => {
            refreshTracks();
        };
        /* room.on(tênSựKiện, hàmXửLý); */
        room.on(
            RoomEvent.TrackSubscribed, /* vừa nhận được audio/video track của người kia */
            handleTrackChange
        );
        room.on(
            RoomEvent.TrackUnsubscribed, /* không còn nhận track đó nữa, thường do người kia rời phòng hoặc dừng truyền media */
            handleTrackChange
        );
        room.on(
            RoomEvent.TrackMuted,  /* tắt micro hoặc camera nhưng track vẫn tồn tại */
            handleTrackChange
        );
        room.on(
            RoomEvent.TrackUnmuted, /* vừa bật lại micro hoặc camera */
            handleTrackChange
        );

        return () => {
            room.off(
                RoomEvent.TrackSubscribed,
                handleTrackChange
            );
            room.off(
                RoomEvent.TrackUnsubscribed,
                handleTrackChange
            );
            room.off(
                RoomEvent.TrackMuted,
                handleTrackChange
            );
            room.off(
                RoomEvent.TrackUnmuted,
                handleTrackChange
            );
        };
    }, [room]);

    // Gắn âm thanh người bên kia vào thẻ audio
    useEffect(() => {
        const audioElement = audioRef.current;

        const audioTrack = participant
            .getTrackPublication(Track.Source.Microphone)
            ?.audioTrack;

        if (!audioElement || !audioTrack) {
            return;
        }

        audioTrack.attach(audioElement); /* Gắn audioTrack vào thẻ audio */

        return () => {
            audioTrack.detach(audioElement);
        };
    }, [participant, trackVersion]);

    // Gắn camera người bên kia vào thẻ video
    useEffect(() => {
        const videoElement = videoRef.current; // lấy thẻ video từ DOM

        const videoTrack = participant
            .getTrackPublication(Track.Source.Camera)
            ?.videoTrack;

        if (!videoElement || !videoTrack) {
            return;
        }

        videoTrack.attach(videoElement); // render ra thẻ video và gắn videoTrack vào thẻ video

        return () => {
            videoTrack.detach(videoElement);
        };
    }, [participant, trackVersion]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-slate-950">
            {showVideo &&
            participant.isCameraEnabled ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="grid h-full place-items-center">
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-indigo-600 text-white">
                        <User className="h-12 w-12" />
                    </div>
                </div>
            )}

            <audio
                ref={audioRef}
                autoPlay
            />

            <p className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                {participant.name ||
                    participant.identity}
            </p>
        </div>
    );
}
