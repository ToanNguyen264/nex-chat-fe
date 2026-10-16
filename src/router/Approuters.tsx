import { Route,Routes } from "react-router";
import LoginPage from "../page/Login";
import RegisterPage from "../page/Register";
import HomePage from "../page/Home";
export default function AppRouters(){
    return(
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    )
}