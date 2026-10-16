import MainLayout from "../layouts/MainLayout";
import Sidebar from "../layouts/components/Sidebar";
import Feed from "../features/feed/Feed";
import RightSidebar from "../features/friends/RightSidebar";
import ChatPopup from "../features/chat/ChatPopup";
export default function HomePage() {
    return (
        <MainLayout>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:grid-cols-[286px_minmax(0,596px)_286px]">
                <aside className="hidden lg:col-span-3 lg:block xl:col-auto">
                    <Sidebar />
                </aside>

                <section className="min-w-0 lg:col-span-9 xl:col-auto">
                    <Feed />
                </section>

                <aside className="hidden xl:col-auto xl:block">
                    <RightSidebar />
                </aside>
            </div>
            <ChatPopup />
        </MainLayout>
    );
}
