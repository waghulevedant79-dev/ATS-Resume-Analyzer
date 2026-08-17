export default function ToolBadge({ children, dark = false }) {
  return (
    <span
      className={
        dark
          ? "inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white"
          : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
      }
    >
      {children}
    </span>
  );
}
