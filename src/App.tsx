import AppRouters from "./router/Approuters";
import SocketManager from "./socket/SocketManager";

export default function App() {
    return (
        <>
            <SocketManager />
            <AppRouters />
        </>
    );
}