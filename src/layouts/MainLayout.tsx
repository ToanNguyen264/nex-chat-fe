import type { ReactNode } from "react";
import Header from "./components/Header";
import type { CurrentUser } from "../api/user.api";
import ChatPopup from "../features/chat/ChatPopup";

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
            className={`relative bg-[#faf8ff] ${
                fixedViewport
                    ? "h-screen overflow-hidden"
                    : "min-h-screen overflow-x-hidden"
            }`}
        >
            <Header currentUser={currentUser} />

            <div className="pointer-events-none absolute left-1/4 top-24 h-96 w-96 rounded-full bg-[#4648d4]/5 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-96 h-80 w-80 rounded-full bg-[#57dffe]/10 blur-3xl" />

            <main
                className={`relative mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6 ${
                    fixedViewport
                        ? "h-[calc(100vh-64px)] min-h-0 overflow-hidden"
                        : "min-h-[calc(100vh-64px)]"
                }`}
            >
                {children}
            </main>

            <footer
                className={`relative border-t border-[#eef0ff] bg-white px-6 py-6 text-[11px] text-[#767586] lg:px-8 ${
                    fixedViewport ? "hidden" : ""
                }`}
            >
                <div className="mx-auto max-w-[1216px]">
                    <span className="font-semibold text-[#4648d4]">Pulse</span>
                    <span> © 2026 Pulse Social Network. Bản quyền được bảo lưu.</span>
                </div>
            </footer>

            <ChatPopup currentUser={currentUser} />
        </div>
    );
}
