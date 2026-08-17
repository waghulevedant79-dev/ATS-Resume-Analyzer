export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  type = "submit",
  className = "",
  ...props
}) {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`btn-primary inline-flex items-center justify-center gap-2 ${
        isDisabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}

      <span>{children}</span>
    </button>
  );
}