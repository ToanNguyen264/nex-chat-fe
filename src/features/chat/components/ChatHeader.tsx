import {
    Maximize2,
    Minus,
    Phone,
    Video,
    X,
} from "lucide-react";
import avatarChat from "../../../assets/home/avatar-chat.png";

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
                    <img src={avatarChat} alt="Nguyễn Thảo My" className="h-10 w-10 rounded-full object-cover ring-2 ring-[#4648d4]/20" />

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-400" />
                </div>

                <div>
                    <h2 className="text-base font-bold tracking-[-0.16px] text-[#131b2e]">
                        Nguyễn Thảo My
                    </h2>

                    <p className="text-[11px] font-semibold text-[#57dffe]">
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
