import type { ReactNode } from "react";
import Header from "./components/Header";

type MainLayoutProps = {
    children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[#faf8ff]">
            <Header />

            <main className="mx-auto max-w-[1440px] px-8 py-6">
                {children}
            </main>
        </div>
    );
}