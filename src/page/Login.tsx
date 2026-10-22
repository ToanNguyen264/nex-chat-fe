import { Radio, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";

import api from "../api/axios";
import appleIcon from "../_metronic/assets/images/apple_icon.svg";
import googleIcon from "../_metronic/assets/images/google_icon.svg";
import previewLogin from "../_metronic/assets/images/preview_login.svg";
import { KTIcon } from "../_metronic/helpers/components/KTIcon";
import Button from "../component/UI/Button/Button";
import Input from "../component/UI/Input/Input";
import { showError } from "../utils/swal";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigate();

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
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0e7ff,_#f8fafc_45%,_#ecfeff)] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_32px_90px_rgba(30,41,59,0.18)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#3f46c8] via-[#565bdc] to-[#087386] p-10 text-white lg:flex lg:flex-col">
                    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-950/30 blur-3xl" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black text-indigo-600 shadow-lg shadow-indigo-950/20">
                                N
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Nex</span>
                        </div>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
                            MẠNG XÃ HỘI 3.0
                        </span>
                    </div>

                    <div className="relative z-10 mt-10">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-300/15 px-3 py-1.5 text-sm text-cyan-100">
                            <Sparkles className="h-4 w-4" />
                            Kết nối theo cách của bạn
                        </div>
                        <h2 className="max-w-md text-4xl font-bold leading-tight">
                            Chào mừng bạn trở lại với <span className="text-cyan-300">Nex</span>
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                            Khám phá xu hướng, chia sẻ khoảnh khắc chân thực và kết nối với cộng đồng của bạn.
                        </p>
                    </div>

                    <div className="relative z-10 mt-7 rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-indigo-950/20 backdrop-blur-sm">
                        <div className="h-48 overflow-hidden rounded-2xl bg-white/10">
                            <img
                                src={previewLogin}
                                alt="Cộng đồng Nex"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="flex items-center justify-between px-2 pb-1 pt-3 text-xs text-white/85">
                            <span>💗 3.4k lượt thả tim</span>
                            <span className="rounded-full bg-black/15 px-2.5 py-1">#KhamPhaNex</span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto grid grid-cols-2 gap-3 pt-6">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <Users className="mb-3 h-5 w-5 text-cyan-200" />
                            <strong className="block text-2xl">500K+</strong>
                            <span className="text-xs text-white/65">Người dùng năng động</span>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <Radio className="mb-3 h-5 w-5 text-cyan-200" />
                            <strong className="block text-2xl">2M+</strong>
                            <span className="text-xs text-white/65">Kết nối mỗi ngày</span>
                        </div>
                    </div>
                </section>

                <section className="flex items-center px-6 py-10 sm:px-12 lg:px-14">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-9 flex items-center gap-3 lg:hidden">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 font-black text-white shadow-lg shadow-indigo-200">
                                N
                            </div>
                            <span className="text-xl font-bold text-slate-900">Nex</span>
                        </div>

                        <div>
                            <span className="text-sm font-semibold text-indigo-600">Rất vui được gặp lại bạn</span>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Đăng nhập tài khoản
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Tiếp tục trò chuyện và chia sẻ khoảnh khắc cùng bạn bè.
                            </p>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-3">
                            <Button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                <img src={googleIcon} alt="" className="h-5 w-5" />
                                Google
                            </Button>
                            <Button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                <img src={appleIcon} alt="" className="h-5 w-5" />
                                Apple ID
                            </Button>
                        </div>

                        <div className="my-7 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            <div className="h-px flex-1 bg-slate-200" />
                            đăng nhập bằng email
                            <div className="h-px flex-1 bg-slate-200" />
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

                            <div className="mt-5">
                                <Input
                                    name="password"
                                    label="Mật khẩu"
                                    lableRight={
                                        <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
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
                                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            <KTIcon iconName={showPassword ? "eye-slash" : "eye"} className="fs-18" />
                                        </button>
                                    }
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{formik.errors.password}</p>
                                )}
                            </div>

                            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                <Input
                                    name="acceptedPolicy"
                                    type="checkbox"
                                    label="Đồng ý chính sách"
                                    checked={formik.values.acceptedPolicy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <p className="mt-1.5 pl-6 text-xs leading-5 text-slate-500">
                                    Bằng việc tiếp tục, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Quyền riêng tư của Nex.
                                </p>
                                {formik.touched.acceptedPolicy && formik.errors.acceptedPolicy && (
                                    <p className="mt-1.5 pl-6 text-xs text-red-500">{formik.errors.acceptedPolicy}</p>
                                )}
                            </div>

                            <Button
                                className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                loading={formik.isSubmitting}
                            >
                                Đăng nhập
                            </Button>
                        </form>

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Chưa có tài khoản Nex?{" "}
                            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                                Đăng ký miễn phí
                            </a>
                        </p>

                        <p className="mt-8 text-center text-xs text-slate-400">
                            © 2026 Nex · Kết nối an toàn, trò chuyện chân thật
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
