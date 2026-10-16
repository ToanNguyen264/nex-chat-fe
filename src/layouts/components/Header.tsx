export default function Header() {
    return (
        <header className="h-16 border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-8">
                <h1 className="text-xl font-bold text-indigo-600">
                    Nex
                </h1>

                <nav className="flex items-center gap-6">
                    <a
                        href="/home"
                        className="font-semibold text-indigo-600"
                    >
                        Bảng tin
                    </a>

                    <a
                        href="#"
                        className="text-sm text-slate-600 hover:text-indigo-600"
                    >
                        Khám phá
                    </a>

                    <a
                        href="#"
                        className="text-sm text-slate-600 hover:text-indigo-600"
                    >
                        Nhóm
                    </a>
                </nav>

                <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                    Đăng bài
                </button>
            </div>
        </header>
    );
}