// axios.ts
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    }
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

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);

export default api;