import api from "./axios";

export type CurrentUser = {
    id: string;
    email: string;
    status: "active" | "inactive" | "blocked";
    user_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
};

type GetCurrentUserResponse = {
    success: boolean;
    data: CurrentUser;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
    const response = await api.get<GetCurrentUserResponse>("/users/me");

    return response.data.data;
};
