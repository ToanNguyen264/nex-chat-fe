import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../layouts/components/Sidebar";
import Feed from "../features/feed/Feed";
import RightSidebar from "../features/friends/RightSidebar";
import { getCurrentUser } from "../api/user.api";
import type { CurrentUser } from "../api/user.api";

export default function HomePage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Không thể lấy thông tin người dùng:", error);
            }
        }

        void loadCurrentUser();
    }, []);

    return (
        <MainLayout currentUser={currentUser} fixedViewport>
            <div className="grid h-full min-h-0 grid-cols-1 items-start gap-6 lg:grid-cols-12 xl:grid-cols-[286px_minmax(0,596px)_286px]">
                <aside className="hidden h-full overflow-hidden lg:col-span-3 lg:block xl:col-auto">
                    <Sidebar currentUser={currentUser} />
                </aside>

                <section className="h-full min-w-0 overflow-y-auto overscroll-contain lg:col-span-9 xl:col-auto">
                    <Feed currentUser={currentUser} />
                </section>

                <aside className="hidden h-full overflow-hidden xl:col-auto xl:block">
                    <RightSidebar />
                </aside>
            </div>
        </MainLayout>
    );
}
