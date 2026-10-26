import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { X, Image as ImageIcon, Video, Loader2, UploadCloud } from "lucide-react";
import { createStory } from "../../../api/story.api";

type CreateStoryModalProps = {
    onClose: () => void;
    onStoryCreated: () => void;
};

export default function CreateStoryModal({
    onClose,
    onStoryCreated,
}: CreateStoryModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Giải phóng bộ nhớ blob URL khi component unmount hoặc khi chọn file khác
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Xử lý khi người dùng chọn file
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Kiểm tra loại file: chỉ cho phép ảnh hoặc video
        if (file.type.startsWith("image/")) {
            setMediaType("image");
        } else if (file.type.startsWith("video/")) {
            setMediaType("video");
        } else {
            setError("Vui lòng chọn file hình ảnh hoặc video hợp lệ.");
            return;
        }

        // Tạo URL xem trước
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(url);
        setError(null);
    };

    // Hủy bỏ file đã chọn để chọn lại
    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setMediaType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Gửi form tạo tin
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Vui lòng chọn ảnh hoặc video để đăng tin.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await createStory(selectedFile, content);
            onStoryCreated();
            onClose();
        } catch (err: unknown) {
            console.error("Lỗi khi tạo tin:", err);
            setError("Không thể đăng tin lúc này. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        Tạo tin (Story 24h)
                    </h2>
                    <button
                        type="button"
                        aria-label="Đóng"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-5">
                    {/* Input ẩn để chọn file */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isSubmitting}
                    />

                    {/* Vùng chọn file hoặc xem trước */}
                    {!previewUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer"
                        >
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:scale-110">
                                <UploadCloud className="h-7 w-7 text-indigo-600" />
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                                Nhấp để tải lên ảnh hoặc video
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Hỗ trợ JPG, PNG, MP4, WebM (sẽ tự động hết hạn sau 24h)
                            </p>
                            <div className="mt-3 flex gap-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Video className="h-3.5 w-3.5" /> Video
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl bg-black">
                            {/* Nút hủy/chọn lại */}
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                disabled={isSubmitting}
                                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur transition hover:bg-black/80"
                                title="Chọn file khác"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Khung preview */}
                            <div className="flex h-80 w-full items-center justify-center overflow-hidden">
                                {mediaType === "image" ? (
                                    <img
                                        src={previewUrl}
                                        alt="Xem trước story"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <video
                                        src={previewUrl}
                                        controls
                                        autoPlay
                                        muted
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ô nhập ghi chú / caption cho story */}
                    <div className="mt-4">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Ghi chú / Tiêu đề (tùy chọn)
                        </label>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Thêm lời nhắn vào tin..."
                            maxLength={200}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                        />
                    </div>

                    {/* Thông báo lỗi nếu có */}
                    {error && (
                        <p className="mt-3 text-xs font-medium text-rose-500">
                            {error}
                        </p>
                    )}

                    {/* Footer các nút bấm */}
                    <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile || isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Đang đăng...</span>
                                </>
                            ) : (
                                <span>Chia sẻ lên tin</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

