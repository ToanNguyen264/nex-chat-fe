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
            {/* Lớp hình nền Telegram Doodle Pattern mờ tinh tế */}
            <div
                className="pointer-events-none fixed inset-0 z-0 bg-[url('/telegram-pattern.svg')] bg-repeat bg-[size:460px] opacity-[0.045] dark:opacity-[0.035] dark:invert"
                aria-hidden="true"
            />

            <Header currentUser={currentUser} />

            <main
                className={`relative z-10 mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6 ${
                    fixedViewport
                        ? "min-h-0 overflow-hidden"
                        : ""
                }`}
            >
                {children}
            </main>

            <footer className="relative z-10 shrink-0 border-t border-[#eef0ff] dark:border-[#263147] bg-white dark:bg-[#151c2c] px-6 py-4 text-[11px] text-[#767586] dark:text-slate-400 lg:px-8 transition-colors duration-200">
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
