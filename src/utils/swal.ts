import Swal from "sweetalert2";

const getSwalThemeColors = () => {
    const isDark =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    return {
        background: isDark ? "#151c2c" : "#ffffff",
        color: isDark ? "#f1f5f9" : "#131b2e",
    };
};

const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 3000,
    timerProgressBar: true,
});

export const showSuccess = (message: string) => {
    return toast.fire({
        icon: "success",
        title: message,
        ...getSwalThemeColors(),
    });
};

export const showError = (message: string) => {
    return toast.fire({
        icon: "error",
        title: message,
        ...getSwalThemeColors(),
    });
};

export const showWarning = (message: string) => {
    return toast.fire({
        icon: "warning",
        title: message,
        ...getSwalThemeColors(),
    });
};

export const confirmDelete = async (
    title = "Bạn có chắc muốn xoá ?"
) => {
    const result = await Swal.fire({
        icon: "warning",
        title,
        text: "Hành động này không thể hoàn tác",
        showCancelButton: true,
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
        ...getSwalThemeColors(),
    });

    return result.isConfirmed;
};

export const promptLogin = async (
    title = "Yêu cầu đăng nhập",
    text = "Vui lòng đăng nhập để sử dụng tính năng này."
) => {
    const result = await Swal.fire({
        icon: "info",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "Đăng nhập ngay",
        cancelButtonText: "Để sau",
        confirmButtonColor: "#4648d4",
        cancelButtonColor: "#94a3b8",
        ...getSwalThemeColors(),
    });

    if (result.isConfirmed) {
        window.location.href = "/";
    }

    return result.isConfirmed;
};
