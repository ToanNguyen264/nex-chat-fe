import OnlineFriends from "./components/OnlineFriends";
import TrendingTopics from "./components/TrendingTopics";

export default function RightSidebar() {
    return (
        <div className="flex flex-col gap-4">
            <OnlineFriends />
            <TrendingTopics />
        </div>
    );
}