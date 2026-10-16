import {
    Maximize2,
    Minus,
    Phone,
    Video,
    X,
} from "lucide-react";

type ChatHeaderProps = {
    isMinimized: boolean;
    onToggleMinimize: () => void;
    onClose: () => void;
};

export default function ChatHeader({
    isMinimized,
    onToggleMinimize,
    onClose,
}: ChatHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        TM
                    </div>

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-[#131b2e]">
                        Nguyễn Thảo My
                    </h2>

                    <p className="text-xs font-medium text-cyan-500">
                        Đang hoạt động
                    </p>
                </div>
            </div>

            <div className="flex items-center">
                <button
                    type="button"
                    aria-label="Gọi thoại"
                    className="rounded-full p-2 text-indigo-600 hover:bg-indigo-50"
                >
                    <Phone className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Gọi video"
                    className="rounded-full p-2 text-indigo-600 hover:bg-indigo-50"
                >
                    <Video className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label={isMinimized ? "Mở rộng" : "Thu nhỏ"}
                    onClick={onToggleMinimize}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    {isMinimized ? (
                        <Maximize2 className="h-4 w-4" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                </button>

                <button
                    type="button"
                    aria-label="Đóng"
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}