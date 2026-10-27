import type { ReactNode } from "react";
import Header from "./components/Header";
import type { CurrentUser } from "../api/user.api";
import ChatPopup from "../features/chat/ChatPopup";
import CallOverlay from "../features/call/CallOverlay";

type MainLayoutProps = {
    children: ReactNode;
    currentUser: CurrentUser | null;
    fixedViewport?: boolean;
};

export default function MainLayout({
    children,
    currentUser,
    fixedViewport = false,
}: MainLayoutProps) {
    return (
        <div
            className={`relative flex flex-col bg-[#faf8ff] dark:bg-[#0b0f19] transition-colors duration-200 ${
                fixedViewport
                    ? "h-screen overflow-hidden"
                    : "min-h-screen overflow-x-clip"
            }`}
        >
            <Header currentUser={currentUser} />

            <div className="pointer-events-none absolute left-1/4 top-24 h-96 w-96 rounded-full bg-[#4648d4]/5 dark:bg-[#4648d4]/10 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-96 h-80 w-80 rounded-full bg-[#57dffe]/10 dark:bg-[#57dffe]/5 blur-3xl" />

            <main
                className={`relative mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6 ${
                    fixedViewport
                        ? "min-h-0 overflow-hidden"
                        : ""
                }`}
            >
                {children}
            </main>

            <footer className="relative shrink-0 border-t border-[#eef0ff] dark:border-[#263147] bg-white dark:bg-[#151c2c] px-6 py-4 text-[11px] text-[#767586] dark:text-slate-400 lg:px-8 transition-colors duration-200">
                <div className="mx-auto flex max-w-[1216px] flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="font-semibold text-[#4648d4] dark:text-indigo-400">Nex</span>
                        <span> © 2026 Nex Social Network. Bản quyền được bảo lưu.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/terms" className="transition hover:text-[#4648d4] dark:hover:text-indigo-400">Điều khoản</a>
                        <a href="/privacy" className="transition hover:text-[#4648d4] dark:hover:text-indigo-400">Bảo mật</a>
                        <a href="/help" className="transition hover:text-[#4648d4] dark:hover:text-indigo-400">Trợ giúp</a>
                    </div>
                </div>
            </footer>

            <ChatPopup currentUser={currentUser} />
            <CallOverlay />
        </div>
    );
}
