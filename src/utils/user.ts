import type { CurrentUser } from "../api/user.api";

export const getUserDisplayName = (
    user: CurrentUser | null
): string => {
    if (!user) {
        return "Người dùng";
    }

    const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ");

    return fullName || user.user_name || "Người dùng";
};

export const getNameInitials = (name: string): string => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U";
};
