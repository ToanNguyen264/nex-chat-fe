import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImagePlus, Mic, Send, Square, X } from "lucide-react";
import type { RealtimeChatMessage } from "../types";
import { getChatUserName } from "../chat.utils";

type MessageInputProps = {
    onSendText: (content: string) => Promise<void>;
    onSendMedia: (file: File, content?: string) => Promise<void>;
    replyTo: RealtimeChatMessage | null;
    onCancelReply: () => void;
    isSending: boolean;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function MessageInput({
    onSendText,
    onSendMedia,
    replyTo,
    onCancelReply,
    isSending,
}: MessageInputProps) {
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [mediaError, setMediaError] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<string | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const shouldSendRecordingRef = useRef(true);

    useEffect(() => {
        if (!isRecording) return;

        const intervalId = window.setInterval(() => {
            setRecordingSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isRecording]);

    useEffect(
        () => () => {
            shouldSendRecordingRef.current = false;
            if (imagePreviewRef.current) {
                URL.revokeObjectURL(imagePreviewRef.current);
            }
            streamRef.current
                ?.getTracks()
                .forEach((track) => track.stop());
        },
        []
    );

    const clearSelectedImage = () => {
        if (imagePreviewRef.current) {
            URL.revokeObjectURL(imagePreviewRef.current);
            imagePreviewRef.current = null;
        }
        setSelectedImage(null);
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setMediaError(null);

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMediaError("Vui lòng chọn một tệp ảnh.");
            event.target.value = "";
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setMediaError("Ảnh không được vượt quá 10 MB.");
            event.target.value = "";
            return;
        }

        if (imagePreviewRef.current) {
            URL.revokeObjectURL(imagePreviewRef.current);
        }
        const previewUrl = URL.createObjectURL(file);
        imagePreviewRef.current = previewUrl;
        setSelectedImage(file);
        setImagePreview(previewUrl);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newContent = content.trim();

        if (isSending || isRecording || (!newContent && !selectedImage)) return;

        try {
            if (selectedImage) {
                await onSendMedia(selectedImage, newContent || undefined);
                clearSelectedImage();
            } else {
                await onSendText(newContent);
            }

            setContent("");
            setMediaError(null);
        } catch {
            // Giữ dữ liệu để người dùng có thể gửi lại.
        }
    };

    const startRecording = async () => {
        setMediaError(null);

        if (!navigator.mediaDevices?.getUserMedia) {
            setMediaError("Trình duyệt không hỗ trợ ghi âm.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const preferredTypes = [
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/mp4",
            ];
            const mimeType = preferredTypes.find((type) =>
                MediaRecorder.isTypeSupported(type)
            );
            const recorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            streamRef.current = stream;
            recorderRef.current = recorder;
            audioChunksRef.current = [];
            shouldSendRecordingRef.current = true;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            recorder.onstop = async () => {
                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                if (!shouldSendRecordingRef.current) return;

                const rawType = recorder.mimeType || "audio/webm";
                const normalizedType = rawType.split(";")[0] || "audio/webm";
                const extension = normalizedType.includes("mp4") ? "m4a" : "webm";
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: normalizedType,
                });

                if (audioBlob.size === 0) {
                    setMediaError("Không thu được dữ liệu âm thanh.");
                    return;
                }

                const audioFile = new File(
                    [audioBlob],
                    `voice-${Date.now()}.${extension}`,
                    { type: normalizedType }
                );

                try {
                    await onSendMedia(audioFile);
                } catch {
                    setMediaError("Không thể gửi bản ghi âm.");
                }
            };

            recorder.start();
            setRecordingSeconds(0);
            setIsRecording(true);
        } catch (error) {
            console.error("Không thể mở microphone:", error);
            setMediaError(
                "Không thể sử dụng microphone. Hãy kiểm tra quyền truy cập."
            );
        }
    };

    const stopAndSendRecording = () => {
        if (recorderRef.current?.state === "recording") {
            recorderRef.current.stop();
        }
        recorderRef.current = null;
        setIsRecording(false);
        setRecordingSeconds(0);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-slate-100 bg-white p-3 shadow-[0_-2px_4px_rgba(0,0,0,0.03)]"
        >
            {replyTo && (
                <div className="mb-2 flex items-start gap-2 rounded-xl border-l-4 border-[#4648d4] bg-[#f2f3ff] px-3 py-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#4648d4]">
                            Trả lời {replyTo.users
                                ? getChatUserName(replyTo.users)
                                : "tin nhắn"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {replyTo.content ||
                                (replyTo.message_type === "image"
                                    ? "Ảnh"
                                    : "Tệp đính kèm")}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Hủy trả lời"
                        onClick={onCancelReply}
                        className="rounded-full p-1 text-slate-500 hover:bg-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {imagePreview && (
                <div className="relative mb-2 w-fit">
                    <img
                        src={imagePreview}
                        alt="Ảnh chuẩn bị gửi"
                        className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                        type="button"
                        aria-label="Bỏ ảnh đã chọn"
                        onClick={clearSelectedImage}
                        className="absolute -right-2 -top-2 rounded-full bg-slate-800 p-1 text-white shadow"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            {mediaError && (
                <p className="mb-2 text-xs text-rose-600">{mediaError}</p>
            )}

            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            <div className="flex min-h-12 items-center gap-1 rounded-2xl bg-[#f2f3ff] px-2">
                <button
                    type="button"
                    aria-label="Chọn ảnh"
                    disabled={isSending || isRecording}
                    onClick={() => imageInputRef.current?.click()}
                    className="rounded-full p-2 text-[#4648d4] hover:bg-white disabled:opacity-40"
                >
                    <ImagePlus className="h-5 w-5" />
                </button>

                <button
                    type="button"
                    aria-label={isRecording ? "Dừng và gửi ghi âm" : "Ghi âm"}
                    disabled={isSending}
                    onClick={
                        isRecording
                            ? stopAndSendRecording
                            : () => void startRecording()
                    }
                    className={`rounded-full p-2 disabled:opacity-40 ${
                        isRecording
                            ? "animate-pulse bg-rose-100 text-rose-600"
                            : "text-[#4648d4] hover:bg-white"
                    }`}
                >
                    {isRecording ? (
                        <Square className="h-4 w-4 fill-current" />
                    ) : (
                        <Mic className="h-5 w-5" />
                    )}
                </button>

                {isRecording ? (
                    <p className="min-w-0 flex-1 px-2 text-sm font-medium text-rose-600">
                        Đang ghi âm {recordingSeconds}s
                    </p>
                ) : (
                    <input
                        id="chat-message"
                        name="chatMessage"
                        type="text"
                        value={content}
                        disabled={isSending}
                        maxLength={5000}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-wait"
                    />
                )}

                {!isRecording && (
                    <button
                        type="submit"
                        aria-label="Gửi tin nhắn"
                        disabled={(!content.trim() && !selectedImage) || isSending}
                        className="rounded-full bg-[#4648d4] p-2.5 text-white shadow-sm disabled:opacity-40"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    );
}
