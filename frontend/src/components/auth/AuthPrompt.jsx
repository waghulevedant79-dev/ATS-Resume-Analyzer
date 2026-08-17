import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function AuthPrompt({ onClose }) {
    const navigate = useNavigate();

    function handleLogin() {
        onClose?.();

        navigate("/login", {
            state: {
                from: window.location.pathname,
            },
        });
    }

    function handleRegister() {
        onClose?.();

        navigate("/register", {
            state: {
                from: window.location.pathname,
            },
        });
    }

    return createPortal(
        <div className="modal-overlay-enter fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 px-4">
            <div
                className="modal-card-enter w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-prompt-title"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="eyebrow">
                            Deep AI
                        </p>

                        <h2
                            id="auth-prompt-title"
                            className="mt-1 text-xl font-bold text-slate-950"
                        >
                            Sign in to use Deep AI
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm font-medium text-slate-400 transition hover:text-slate-700"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Create a free account or sign in to unlock advanced
                    resume tools like professional summaries, project
                    enhancement, and complete resume rewrites.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="btn-primary w-full"
                    >
                        Sign in
                    </button>

                    <button
                        type="button"
                        onClick={handleRegister}
                        className="btn-secondary w-full"
                    >
                        Create account
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                    Maybe later
                </button>
            </div>
        </div>,
        document.body
    );
}
