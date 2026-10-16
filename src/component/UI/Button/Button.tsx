import type React from "react"

type ButtonProps = {
    children: React.ReactNode; // dùng để xác định children trong component ( ví dụ text đăng nhập)
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    loading?: boolean
}

export default function Button({
    children,
    className = "",
    onClick,
    type = "button",
    loading = false,
}: ButtonProps) {
    return (
        <button className={className} onClick={onClick} type={type} disabled={loading}>
            {loading ? "Please wait..." : children}
        </button>
    )
}