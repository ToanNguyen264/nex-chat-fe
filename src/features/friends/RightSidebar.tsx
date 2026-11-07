import OnlineFriends from "./components/OnlineFriends";
import type { CurrentUser } from "../../api/user.api";
import { Link } from "react-router";
import { MessageSquare, Users } from "lucide-react";

type RightSidebarProps = {
    currentUser?: CurrentUser | null;
};

export default function RightSidebar({ currentUser }: RightSidebarProps) {
    if (!currentUser) {
        return (
            <section className="rounded-2xl border border-transparent dark:border-[#263147] bg-white dark:bg-[#151c2c] p-4 shadow-sm transition-colors">
                <header className="mb-3 flex items-center gap-2 font-semibold text-[#131b2e] dark:text-slate-100 text-sm">
                    <Users className="h-4 w-4 text-[#4648d4] dark:text-[#5d5fee]" />
                    <span>Cộng đồng Nex</span>
                </header>
                <p className="text-xs text-[#767586] dark:text-slate-400 leading-relaxed">
                    Đăng nhập để xem danh sách bạn bè đang online, trò chuyện và gọi video thời gian thực.
                </p>
                <Link
                    to="/"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#4648d4] dark:bg-[#5d5fee] py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Bắt đầu kết nối
                </Link>
            </section>
        );
    }

    return <OnlineFriends />;
}
