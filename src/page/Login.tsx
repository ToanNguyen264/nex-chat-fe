import { Moon, Radio, Sparkles, Sun, Users } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import * as Yup from "yup";

import api from "../api/axios";
import previewLogin from "../_metronic/assets/images/preview_login.svg";
import { KTIcon } from "../_metronic/helpers/components/KTIcon";
import Button from "../component/UI/Button/Button";
import Input from "../component/UI/Input/Input";
import { showError } from "../utils/swal";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigate();
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            acceptedPolicy: true,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email không đúng định dạng")
                .required("Vui lòng nhập email"),
            password: Yup.string()
                .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                .required("Vui lòng nhập mật khẩu"),
            acceptedPolicy: Yup.boolean()
                .oneOf([true], "Bạn cần đồng ý với điều khoản để đăng nhập"),
        }),
        onSubmit: async (value) => {
            try {
                const response = await api.post("/auth/login", {
                    email: value.email,
                    password: value.password,
                });

                const accessToken = response.data.accessToken;

                localStorage.setItem("accessToken", accessToken);

                navigation("/home");
            } catch {
                showError("Email hoặc mật khẩu không đúng");
            }
        },
    });

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
                <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/70 dark:border-[#263147] bg-white dark:bg-[#151c2c] shadow-[0_32px_90px_rgba(30,41,59,0.18)] lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#3f46c8] via-[#565bdc] to-[#087386] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-950/30 blur-3xl" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-slate-950/30 p-1 shadow-lg shadow-indigo-950/25 backdrop-blur-md">
                                <img src="/logo.svg" alt="Nex" className="h-full w-full scale-125 object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Nex</span>
                        </div>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
                            MẠNG XÃ HỘI 3.0
                        </span>
                    </div>

                    <div className="relative z-10 my-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/15 px-3.5 py-1.5 text-xs font-medium text-cyan-100">
                            <Sparkles className="h-3.5 w-3.5" />
                            Kết nối theo cách của bạn
                        </div>
                        <h2 className="text-3xl font-bold leading-[1.2] tracking-tight xl:text-4xl">
                            Chào mừng bạn trở lại với <span className="text-cyan-300">Nex</span>
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-white/80">
                            Khám phá xu hướng, chia sẻ khoảnh khắc và kết nối cộng đồng.
                        </p>

                        <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-indigo-950/25 backdrop-blur-sm">
                            <div className="aspect-[16/6.4] w-full overflow-hidden rounded-2xl">
                                <img
                                    src={previewLogin}
                                    alt="Cộng đồng Nex"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex items-center justify-between px-2 pb-0.5 pt-3 text-xs font-medium text-white/90">
                                <span>💗 3.4k lượt thả tim</span>
                                <span className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold">#KhamPhaNex</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-3.5">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                            <Users className="mb-2.5 h-5 w-5 text-cyan-200" />
                            <strong className="block text-2xl font-bold tracking-tight">500K+</strong>
                            <span className="mt-0.5 block text-xs text-white/70">Người dùng năng động</span>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                            <Radio className="mb-2.5 h-5 w-5 text-cyan-200" />
                            <strong className="block text-2xl font-bold tracking-tight">2M+</strong>
                            <span className="mt-0.5 block text-xs text-white/70">Kết nối mỗi ngày</span>
                        </div>
                    </div>
                </section>

                <section className="flex items-center px-6 py-10 sm:px-12 lg:px-14 lg:py-12">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 p-1 shadow-md">
                                <img src="/logo.svg" alt="Nex" className="h-full w-full scale-125 object-contain" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Nex</span>
                        </div>

                        <div>
                            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Rất vui được gặp lại bạn
                            </span>
                            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[34px]">
                                Đăng nhập tài khoản
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Tiếp tục trò chuyện và chia sẻ khoảnh khắc cùng bạn bè.
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50">
                                <img src="/google_logo.svg" alt="" className="h-5 w-5 object-contain" />
                                Google
                            </Button>
                            <Button className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50">
                                <img src="/apple_logo.svg" alt="" className="h-5 w-5 object-contain dark:invert" />
                                Apple ID
                            </Button>
                        </div>

                        <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                            đăng nhập bằng email
                            <div className="h-px flex-1 bg-slate-200 dark:bg-[#263147]" />
                        </div>

                        <form onSubmit={formik.handleSubmit} noValidate>
                            <Input
                                name="email"
                                label="Email"
                                placeholder="email@example.com"
                                type="email"
                                icon="user"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">{formik.errors.email}</p>
                            )}

                            <div className="mt-4">
                                <Input
                                    name="password"
                                    label="Mật khẩu"
                                    lableRight={
                                        <a href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                                            Quên mật khẩu?
                                        </a>
                                    }
                                    placeholder="Nhập mật khẩu của bạn"
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
                                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
                                        >
                                            <KTIcon iconName={showPassword ? "eye-slash" : "eye"} className="fs-18" />
                                        </button>
                                    }
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.password}</p>
                                )}
                            </div>

                            <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                                <Input
                                    name="acceptedPolicy"
                                    type="checkbox"
                                    label="Đồng ý chính sách"
                                    checked={formik.values.acceptedPolicy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <p className="mt-1 pl-6.5 text-xs leading-5 text-slate-500">
                                    Bằng việc tiếp tục, bạn đồng ý với{" "}
                                    <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                        Điều khoản Dịch vụ
                                    </a>{" "}
                                    và{" "}
                                    <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                        Chính sách Quyền riêng tư
                                    </a>{" "}
                                    của Nex.
                                </p>
                                {formik.touched.acceptedPolicy && formik.errors.acceptedPolicy && (
                                    <p className="mt-1.5 pl-6.5 text-xs text-red-500">{formik.errors.acceptedPolicy}</p>
                                )}
                            </div>

                            <Button
                                className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                loading={formik.isSubmitting}
                            >
                                Đăng nhập
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            Chưa có tài khoản Nex?{" "}
                            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                                Đăng ký miễn phí
                            </Link>
                        </p>

                        <p className="mt-6 text-center text-xs text-slate-400">
                            © 2026 Nex · Kết nối an toàn, trò chuyện chân thật
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
