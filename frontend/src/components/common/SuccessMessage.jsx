export default function SuccessMessage({ children }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="mt-4 w-full overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/50"
        >
            <div className="flex items-center gap-3 px-4 py-3">
                {/* Success icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                    <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 12.5L9.5 17L19 7.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Message */}
                <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-slate-950">
                        Success
                    </p>

                    <p className="mt-0.5 break-words text-sm leading-5 text-slate-500">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
}