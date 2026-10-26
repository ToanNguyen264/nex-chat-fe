import { useState, useEffect, useRef, useCallback } from "react";
import { X, Trash2, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { UserStoryGroup } from "../../../api/story.api";
import { deleteStory } from "../../../api/story.api";
import { confirmDelete, showSuccess, showError } from "../../../utils/swal";
import defaultAvatar from "../../../assets/default-avatar.png";

type StoryViewerModalProps = {
    groups: UserStoryGroup[];
    initialGroupIndex: number;
    onClose: () => void;
    onStoryDeleted?: () => void;
};

const STORY_DURATION = 5000; // Thời gian hiển thị mỗi tin ảnh (5 giây)

// Hàm tính thời gian tương đối (ví dụ: "10 phút trước", "2 giờ trước")
function formatTimeAgo(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${Math.floor(diffHours / 24)} ngày trước`;
}

export default function StoryViewerModal({
    groups,
    initialGroupIndex,
    onClose,
    onStoryDeleted,
}: StoryViewerModalProps) {
    const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
    const [storyIndex, setStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0); // 0 -> 100%
    const [isPaused, setIsPaused] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressIntervalRef = useRef<number | null>(null);

    const currentGroup = groups[groupIndex];
    const currentStory = currentGroup?.stories[storyIndex];

    // Chuyển sang story tiếp theo
    const handleNext = useCallback(() => {
        if (!currentGroup) return;

        // Nếu còn story của cùng người dùng
        if (storyIndex < currentGroup.stories.length - 1) {
            setStoryIndex((prev) => prev + 1);
            setProgress(0);
        }
        // Nếu hết story của người này, chuyển sang người kế tiếp trong feed
        else if (groupIndex < groups.length - 1) {
            setGroupIndex((prev) => prev + 1);
            setStoryIndex(0);
            setProgress(0);
        }
        // Nếu đã hết toàn bộ story của tất cả mọi người -> đóng modal
        else {
            onClose();
        }
    }, [currentGroup, storyIndex, groupIndex, groups.length, onClose]);

    // Quay lại story trước
    const handlePrev = useCallback(() => {
        // Nếu đang ở story > 0 của cùng người dùng
        if (storyIndex > 0) {
            setStoryIndex((prev) => prev - 1);
            setProgress(0);
        }
        // Nếu đang ở story đầu tiên, quay lại người dùng trước đó
        else if (groupIndex > 0) {
            const prevGroup = groups[groupIndex - 1];
            setGroupIndex((prev) => prev - 1);
            setStoryIndex(prevGroup.stories.length - 1);
            setProgress(0);
        }
    }, [storyIndex, groupIndex, groups]);

    // Xóa tin hiện tại (chỉ dành cho chính chủ)
    const handleDeleteStory = async () => {
        if (!currentStory) return;

        setIsPaused(true);
        const confirmed = await confirmDelete("Bạn có chắc chắn muốn xóa tin này?");

        if (!confirmed) {
            setIsPaused(false);
            return;
        }

        setIsDeleting(true);
        try {
            await deleteStory(currentStory.id);
            showSuccess("Đã xóa tin thành công.");
            onStoryDeleted?.();

            // Nếu người này chỉ có 1 story duy nhất vừa xóa xong
            if (currentGroup.stories.length <= 1) {
                // Nếu còn nhóm khác thì chuyển nhóm, không thì đóng
                if (groups.length <= 1) {
                    onClose();
                } else if (groupIndex < groups.length - 1) {
                    setStoryIndex(0);
                    setProgress(0);
                } else {
                    setGroupIndex((prev) => Math.max(0, prev - 1));
                    setStoryIndex(0);
                    setProgress(0);
                }
            } else {
                // Còn story khác trong nhóm
                if (storyIndex >= currentGroup.stories.length - 1) {
                    setStoryIndex((prev) => Math.max(0, prev - 1));
                }
                setProgress(0);
            }
        } catch (err: unknown) {
            console.error("Lỗi xóa tin:", err);
            showError("Không thể xóa tin. Vui lòng thử lại sau.");
        } finally {
            setIsDeleting(false);
            setIsPaused(false);
        }
    };

    // Điều khiển tiến trình chạy tự động (Progress Bar)
    useEffect(() => {
        if (!currentStory || isPaused || isDeleting) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            return;
        }

        // Với hình ảnh: chạy theo STORY_DURATION (5 giây)
        if (currentStory.mediaType === "image") {
            const stepTime = 50; // cập nhật mỗi 50ms
            const stepProgress = (stepTime / STORY_DURATION) * 100;

            progressIntervalRef.current = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + stepProgress;
                });
            }, stepTime);
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [currentStory, isPaused, isDeleting, handleNext]);

    // Lắng nghe phím bấm: ESC để thoát, Trái / Phải để chuyển tin
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowRight" || e.key === " ") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, handleNext, handlePrev]);

    if (!currentGroup || !currentStory) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[75] flex items-center justify-center bg-black/90 backdrop-blur-md select-none"
        >
            {/* Nút thoát góc trên cùng bên phải màn hình */}
            <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
                title="Đóng (ESC)"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Nút chuyển Story trước (bên ngoài khung mobile) */}
            {(groupIndex > 0 || storyIndex > 0) && (
                <button
                    type="button"
                    onClick={handlePrev}
                    className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 hover:scale-110"
                    title="Tin trước"
                >
                    <ChevronLeft className="h-7 w-7" />
                </button>
            )}

            {/* Nút chuyển Story sau (bên ngoài khung mobile) */}
            <button
                type="button"
                onClick={handleNext}
                className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 hover:scale-110"
                title="Tin tiếp theo"
            >
                <ChevronRight className="h-7 w-7" />
            </button>

            {/* Khung Story dạng dọc 9:16 */}
            <div
                className="relative h-[92vh] max-h-[820px] w-full max-w-[420px] overflow-hidden rounded-2xl bg-black shadow-2xl flex flex-col justify-between"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* 1. Thanh tiến trình (Progress Bars) */}
                <div className="absolute top-0 inset-x-0 z-30 flex gap-1 p-3 bg-gradient-to-b from-black/60 to-transparent">
                    {currentGroup.stories.map((s, idx) => {
                        let barWidth = "0%";
                        if (idx < storyIndex) barWidth = "100%";
                        else if (idx === storyIndex) barWidth = `${progress}%`;

                        return (
                            <div
                                key={s.id}
                                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                            >
                                <div
                                    className="h-full bg-white transition-all duration-75"
                                    style={{ width: barWidth }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* 2. Header: Avatar, Tên tác giả, Thời gian, Nút xóa / tạm dừng */}
                <div className="absolute top-6 inset-x-0 z-30 flex items-center justify-between px-3 py-2 text-white">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={currentGroup.avatar || defaultAvatar}
                            alt={currentGroup.authorName}
                            className="h-9 w-9 rounded-full border border-white/50 object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                            }}
                        />
                        <div>
                            <p className="text-xs font-semibold leading-tight drop-shadow">
                                {currentGroup.authorName}
                            </p>
                            <span className="text-[10px] text-white/80 drop-shadow">
                                {formatTimeAgo(currentStory.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Nút tạm dừng / tiếp tục */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPaused((prev) => !prev);
                            }}
                            className="rounded-full bg-black/40 p-1.5 text-white/80 backdrop-blur hover:text-white"
                            title={isPaused ? "Tiếp tục" : "Tạm dừng"}
                        >
                            {isPaused ? (
                                <Play className="h-4 w-4" />
                            ) : (
                                <Pause className="h-4 w-4" />
                            )}
                        </button>

                        {/* Nút xóa tin (chỉ hiện khi là tin của chính mình) */}
                        {currentGroup.isOwn && (
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStory();
                                }}
                                className="rounded-full bg-rose-600/80 p-1.5 text-white backdrop-blur hover:bg-rose-600 disabled:opacity-50"
                                title="Xóa tin này"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. Media chính (Hình ảnh hoặc Video) */}
                <div className="relative flex h-full w-full items-center justify-center bg-black">
                    {currentStory.mediaType === "image" ? (
                        <img
                            src={currentStory.mediaUrl}
                            alt=""
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={currentStory.mediaUrl}
                            autoPlay
                            playsInline
                            className="h-full w-full object-contain"
                            onTimeUpdate={() => {
                                if (videoRef.current) {
                                    const percent =
                                        (videoRef.current.currentTime /
                                            videoRef.current.duration) *
                                        100;
                                    setProgress(percent);
                                }
                            }}
                            onEnded={handleNext}
                        />
                    )}
                </div>

                {/* 4. Click Zones (Trái: Quay lại, Phải: Kế tiếp) */}
                <div
                    onClick={handlePrev}
                    className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
                    title="Chạm để quay lại"
                />
                <div
                    onClick={handleNext}
                    className="absolute inset-y-16 right-0 w-2/3 z-20 cursor-pointer"
                    title="Chạm để xem tiếp"
                />

                {/* 5. Ghi chú / Caption ở đáy (nếu có) */}
                {currentStory.content && (
                    <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6 text-center">
                        <p className="text-sm font-medium text-white drop-shadow">
                            {currentStory.content}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

