import { useEffect, useState } from "react";

export default function ErrorMessage({
  message,
  onClose,
  variant = "toast",
}) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  if (!message || !visible) return null;

  function handleClose() {
    setVisible(false);
    onClose?.();
  }

  const isInline = variant === "inline";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={
        isInline
          ? "w-full max-w-xl overflow-hidden rounded-xl border border-red-100 bg-white"
          : "fixed right-4 top-20 z-[100] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] animate-toast-enter sm:right-6 sm:top-24"
      }
    >
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M12 8V13"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <circle
              cx="12"
              cy="16.5"
              r="1"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5 text-slate-950">
            Error
          </p>

          <p className="mt-0.5 break-words text-sm leading-5 text-slate-500">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-600"
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}