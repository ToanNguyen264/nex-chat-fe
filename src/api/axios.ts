// axios.ts
import axios from "axios";
import { queryClient } from "../lib/query-client";

const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const accessToken = localStorage.getItem("accessToken");

        if (status === 401 && accessToken) {
            localStorage.removeItem("accessToken");
            queryClient.clear();

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);

export default api;