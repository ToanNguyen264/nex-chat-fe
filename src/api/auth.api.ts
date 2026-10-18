import api from "./axios";

type LogoutResponse = {
    success: boolean;
    message: string;
};

export const logout = async (): Promise<void> => {
    await api.post<LogoutResponse>("/auth/logout");
};
