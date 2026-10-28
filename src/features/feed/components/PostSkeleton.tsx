type PostSkeletonProps = {
    count?: number;
};

export default function PostSkeleton({ count = 1 }: PostSkeletonProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            {Array.from({ length: count }).map((_, index) => (
                <article
                    key={index}
                    className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                    aria-hidden="true"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200 animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                            <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                        </div>
                    </div>

                    {/* Content text lines */}
                    <div className="mt-4 space-y-2">
                        <div className="h-3.5 w-full rounded bg-slate-200 animate-pulse" />
                        <div className="h-3.5 w-4/5 rounded bg-slate-200 animate-pulse" />
                        <div className="h-3.5 w-3/5 rounded bg-slate-100 animate-pulse" />
                    </div>

                    {/* Media image box */}
                    <div className="mt-4 h-52 w-full rounded-xl bg-slate-100 animate-pulse" />

                    {/* Footer actions */}
                    <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100">
                        <div className="h-8 w-20 rounded-full bg-slate-100 animate-pulse" />
                        <div className="h-8 w-24 rounded-full bg-slate-100 animate-pulse" />
                        <div className="h-8 w-20 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                </article>
            ))}
        </div>
    );
}

