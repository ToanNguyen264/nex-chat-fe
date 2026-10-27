import { ArrowRight, Camera, MessageCircleMore, Moon, ShieldCheck, Sparkles, Sun, Users } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import * as Yup from "yup";
import api from "../api/axios";
import axios from "axios";
import { showError, showSuccess } from "../utils/swal";

import { KTIcon } from "../_metronic/helpers/components/KTIcon";
import Button from "../component/UI/Button/Button";
import Input from "../component/UI/Input/Input";


export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const nativegate = useNavigate();

    const formik = useFormik({
        initialValues: {
            lastName: "",
            firstName: "",
            userName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            acceptedPolicy: false,
        },
        validationSchema: Yup.object({
            lastName: Yup.string()
                .trim()
                .min(2, "Họ và chữ đệm phải có ít nhất 2 ký tự")
                .max(50, "Họ và chữ đệm không được quá 50 ký tự")
                .required("Vui lòng nhập họ và chữ đệm"),
            firstName: Yup.string()
                .trim()
                .min(1, "Vui lòng nhập tên")
                .max(30, "Tên không được quá 30 ký tự")
                .required("Vui lòng nhập tên"),
            userName: Yup.string()
                .trim()
                .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
                .max(30, "Tên người dùng không được quá 30 ký tự")
                .matches(/^[a-zA-Z0-9._]+$/, "Chỉ được dùng chữ, số, dấu chấm và gạch dưới")
                .required("Vui lòng nhập tên người dùng"),
            email: Yup.string()
                .trim()
                .email("Email không đúng định dạng")
                .required("Vui lòng nhập email"),
            phoneNumber: Yup.string()
                .transform((value) => value.replace(/\s/g, ""))
                .matches(/^(?:\+84|0)\d{9}$/, "Số điện thoại không đúng định dạng Việt Nam")
                .required("Vui lòng nhập số điện thoại"),
            password: Yup.string()
                .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                .matches(/[a-z]/, "Mật khẩu cần ít nhất một chữ thường")
                .matches(/[A-Z]/, "Mật khẩu cần ít nhất một chữ hoa")
                .matches(/\d/, "Mật khẩu cần ít nhất một chữ số")
                .required("Vui lòng nhập mật khẩu"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
            acceptedPolicy: Yup.boolean()
                .oneOf([true], "Bạn cần đồng ý với điều khoản để đăng ký"),
        }),
        onSubmit: async (values) => {
            // Bước tiếp theo sẽ kết nối API đăng ký.
            try {
                const response = await api.post("/auth/register", {
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userName: values.userName,
                    phoneNumber: values.phoneNumber,
                });
                showSuccess(response.data.message || "Đăng ký thành công");
                nativegate("/");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || "Đăng ký thất bại";
                    showError(message);
                } else {
                    showError("Đã xảy ra lỗi không xác định");
                }
            }
        },
    });

    const passwordChecks = [
        formik.values.password.length >= 8,
        /[a-z]/.test(formik.values.password) && /[A-Z]/.test(formik.values.password),
        /\d/.test(formik.values.password),
    ];
    const passwordScore = passwordChecks.filter(Boolean).length;
    const passwordStrength = passwordScore <= 1 ? "Yếu" : passwordScore === 2 ? "Trung bình" : "Mạnh";
    const userNameHasValidFormat = /^[a-zA-Z0-9._]{3,30}$/.test(formik.values.userName);

    return (
        <main className="relative flex min-h-screen flex-col justify-between bg-[radial-gradient(circle_at_top_left,_#e0e7ff,_#f8fafc_45%,_#ecfeff)] dark:bg-[radial-gradient(circle_at_top_left,_#1e1b4b,_#0b0f19_50%,_#091526)] transition-colors duration-200">
            <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                title={isDark ? "Chế độ sáng" : "Chế độ tối"}
                className="fixed right-5 top-5 z-50 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-slate-200 dark:border-[#263147] bg-white/90 dark:bg-[#151c2c]/90 text-slate-700 dark:text-amber-400 shadow-md backdrop-blur transition hover:scale-105"
            >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/70 dark:border-[#263147] bg-white dark:bg-[#151c2c] shadow-[0_32px_90px_rgba(30,41,59,0.18)] md:grid-cols-[0.82fr_1.18fr]">
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#3f46c8] via-[#565bdc] to-[#087386] p-7 text-white md:flex md:flex-col lg:p-10">
                    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
                    <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-indigo-950/30 blur-3xl" />

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-slate-950/30 p-1 shadow-lg shadow-indigo-950/25 backdrop-blur-md">
                            <img src="/logo.svg" alt="Nex" className="h-full w-full scale-125 object-contain" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Nex</span>
                    </div>

                    <div className="relative z-10 mt-10">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-300/15 px-3 py-1.5 text-sm text-cyan-100">
                            <Sparkles className="h-4 w-4" />
                            Mạng xã hội thế hệ mới
                        </div>
                        <h2 className="text-4xl font-bold leading-tight">
                            Chạm nhịp sống số,
                            <span className="block text-cyan-300">kết nối đam mê.</span>
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-white/75">
                            Gia nhập cộng đồng Nex, chia sẻ khoảnh khắc và khám phá những kết nối ý nghĩa.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 space-y-3">
                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-cyan-200">
                                <MessageCircleMore className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Trò chuyện thời gian thực</h3>
                                <p className="mt-1 text-xs text-white/65">Kết nối tức thì với những người bạn quan tâm.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-cyan-200">
                                <Camera className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Chia sẻ khoảnh khắc</h3>
                                <p className="mt-1 text-xs text-white/65">Lưu giữ câu chuyện và thể hiện màu sắc riêng.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-cyan-200">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Không gian an toàn</h3>
                                <p className="mt-1 text-xs text-white/65">Quyền riêng tư của bạn luôn được ưu tiên.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto flex items-center gap-3 pt-8">
                        <div className="flex -space-x-2">
                            {["A", "M", "T"].map((letter, index) => (
                                <div
                                    key={letter}
                                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-indigo-500 bg-white text-xs font-bold text-indigo-600"
                                    style={{ zIndex: 3 - index }}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">18.5K+ thành viên mới</p>
                            <p className="text-xs text-white/60">vừa đăng ký trong tuần này</p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center px-6 py-10 sm:px-8 lg:px-12">
                    <div className="mx-auto w-full max-w-2xl">
                        <div className="mb-8 flex items-center gap-3 md:hidden">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 p-1 shadow-md">
                                <img src="/logo.svg" alt="Nex" className="h-full w-full scale-125 object-contain" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Nex</span>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Bắt đầu hành trình của bạn</span>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                                Tạo tài khoản Nex mới
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Chỉ mất vài phút để tham gia cộng đồng và bắt đầu kết nối.
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                <img src="/google_logo.svg" alt="" className="h-5 w-5 object-contain" />
                                Google
                            </Button>
                            <Button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                <img src="/apple_logo.svg" alt="" className="h-5 w-5 object-contain dark:invert" />
                                Apple ID
                            </Button>
                        </div>

                        <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                            hoặc điền thông tin cá nhân
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                        </div>

                        <form onSubmit={formik.handleSubmit} noValidate>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Input
                                        name="lastName"
                                        label="Họ và chữ đệm"
                                        placeholder="Nguyễn Văn"
                                        icon="user"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        name="firstName"
                                        label="Tên gọi"
                                        placeholder="An"
                                        icon="user"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.firstName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="userName" className="text-sm">Tên người dùng</label>
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${userNameHasValidFormat ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 text-slate-500"}`}>
                                        {userNameHasValidFormat ? "Định dạng hợp lệ" : "3–30 ký tự"}
                                    </span>
                                </div>
                                <Input
                                    name="userName"
                                    placeholder="an_nguyen24"
                                    icon="address-book"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.userName && formik.errors.userName && (
                                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.userName}</p>
                                )}
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Input
                                        name="email"
                                        label="Địa chỉ email"
                                        placeholder="ban@email.com"
                                        type="email"
                                        icon="sms"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        placeholder="0912 345 678"
                                        type="tel"
                                        icon="phone"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.phoneNumber}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Input
                                        name="password"
                                        label="Mật khẩu"
                                        placeholder="Tối thiểu 8 ký tự"
                                        type={showPassword ? "text" : "password"}
                                        icon="lock"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rightIcon={
                                            <button
                                                type="button"
                                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                                onClick={() => setShowPassword((current) => !current)}
                                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                                            >
                                                <KTIcon iconName={showPassword ? "eye-slash" : "eye"} className="fs-18" />
                                            </button>
                                        }
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        placeholder="Nhập lại mật khẩu"
                                        type={showConfirmPassword ? "text" : "password"}
                                        icon="shield-tick"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rightIcon={
                                            <button
                                                type="button"
                                                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                                onClick={() => setShowConfirmPassword((current) => !current)}
                                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                                            >
                                                <KTIcon iconName={showConfirmPassword ? "eye-slash" : "eye"} className="fs-18" />
                                            </button>
                                        }
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-500">{formik.errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-600">Độ mạnh mật khẩu</span>
                                    <span className={`font-semibold ${passwordScore === 3 ? "text-emerald-600 dark:text-emerald-400" : passwordScore === 2 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"}`}>
                                        {formik.values.password ? passwordStrength : "Chưa nhập"}
                                    </span>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-1.5">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1.5 rounded-full transition-colors ${passwordScore >= level ? (passwordScore === 3 ? "bg-emerald-500" : "bg-indigo-500") : "bg-slate-200 dark:bg-slate-700"}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
                                    <input
                                        name="acceptedPolicy"
                                        type="checkbox"
                                        checked={formik.values.acceptedPolicy}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="mt-0.5 h-4 w-4 cursor-pointer accent-indigo-600"
                                    />
                                    <span>
                                        Tôi đồng ý với{" "}
                                        <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                            Điều khoản dịch vụ
                                        </a>{" "}
                                        và{" "}
                                        <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                            Chính sách bảo mật
                                        </a>{" "}
                                        của Nex.
                                    </span>
                                </label>
                                {formik.touched.acceptedPolicy && formik.errors.acceptedPolicy && (
                                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.acceptedPolicy}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                loading={formik.isSubmitting}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                            >
                                Hoàn tất đăng ký
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                            <span>
                                Đã có tài khoản?{" "}
                                <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-700">
                                    Đăng nhập
                                </Link>
                            </span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                        </div>

                        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                            <Users className="h-3.5 w-3.5" />
                            Tham gia cộng đồng Nex và kết nối theo cách của bạn
                        </p>
                    </div>
                </section>
            </div>
            </div>

            <footer className="border-t border-[#eef0ff] bg-white/80 px-6 py-4 text-[11px] text-[#767586] backdrop-blur lg:px-8">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="font-semibold text-[#4648d4]">Nex</span>
                        <span> © 2026 Nex Social Network. Bản quyền được bảo lưu.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/terms" className="transition hover:text-[#4648d4]">Điều khoản</a>
                        <a href="/privacy" className="transition hover:text-[#4648d4]">Bảo mật</a>
                        <a href="/help" className="transition hover:text-[#4648d4]">Trợ giúp</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
