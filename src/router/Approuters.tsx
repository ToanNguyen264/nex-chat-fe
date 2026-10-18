import { Route, Routes } from "react-router";
import LoginPage from "../page/Login";
import RegisterPage from "../page/Register";
import HomePage from "../page/Home";
import ProfilePage from "../page/Profile";
import FriendsPage from "../page/Friends";
import ProtectedRoute from "./ProtectedRoute";
export default function AppRouters() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/:userId"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/friends"
                element={
                    <ProtectedRoute>
                        <FriendsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}
