export default function AIErrorCard({
  message,
  onRetry,
  retryLabel = "Try again",
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full overflow-hidden rounded-2xl border border-red-100 bg-white"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        {/* Error icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 sm:h-11 sm:w-11">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <path
              d="M12 8V13"
              stroke="currentColor"
              strokeWidth="1.8"
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
          <p className="text-sm font-semibold text-slate-950">
            We couldn't complete that AI request
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
            {message}
          </p>

          <p className="mt-1.5 text-xs leading-5 text-slate-400">
            Your existing resume data has not been changed.
          </p>
        </div>

        {/* Retry */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-secondary w-full shrink-0 sm:w-auto"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}