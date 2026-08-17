import CopyButton from "../common/CopyButton";

export default function CopyableText({ label, text }) {
  if (!text) return null;

  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <CopyButton text={text} />
      </div>

      <p className="mt-2 break-words text-sm leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}
