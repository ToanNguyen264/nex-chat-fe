import MainLayout from "../layouts/MainLayout";
import Sidebar from "../layouts/components/Sidebar";
import Feed from "../features/feed/Feed";
import RightSidebar from "../features/friends/RightSidebar";
import ChatPopup from "../features/chat/ChatPopup";
export default function HomePage() {
    return (
        <MainLayout>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <aside className="hidden lg:col-span-3 lg:block">
                    <Sidebar />
                </aside>

                <section className="lg:col-span-9 xl:col-span-6">
                    <Feed />
                </section>

                <aside className="hidden xl:col-span-3 xl:block">
                    <RightSidebar />
                </aside>
            </div>
            <ChatPopup />
        </MainLayout>
    );
}