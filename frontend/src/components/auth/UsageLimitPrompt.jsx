import { createPortal } from "react-dom";

export default function UsageLimitPrompt({
    resetAt,
    onClose,
}) {
    const resetDate = resetAt
        ? new Date(resetAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        : null;

    return createPortal(
        <div className="modal-overlay-enter fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4">
            <div
                role="dialog"
                aria-modal="true"
                className="modal-card-enter w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="eyebrow">Deep AI</p>

                        <h2 className="mt-2 text-xl font-bold text-slate-950">
                            Free AI uses exhausted
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 transition hover:text-slate-700"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                    You've used all 5 free Deep AI uses for this 30-day period.
                    Please wait until your free uses reset to use these tools again.
                </p>

                {resetDate && (
                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Your free uses reset
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                            {resetDate}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary mt-5 w-full"
                >
                    Got it
                </button>
            </div>
        </div>,
        document.body
    );
}
