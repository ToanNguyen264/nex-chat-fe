import { Route,Routes } from "react-router";
import LoginPgae from "../page/Login";
import RegisterPage from "../page/Register";
export default function AppRouters(){
    return(
        <Routes>
            <Route path="/" element={<LoginPgae/>}/>
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    )
}