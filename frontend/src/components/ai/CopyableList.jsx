import CopyButton from "../common/CopyButton";
import ResultList from "./ResultList";

export default function CopyableList({
  label,
  items,
  emptyMessage,
}) {
  if (!items?.length) {
    return (
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <div className="mt-3">
          <ResultList
            items={items}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    );
  }

  const copyText = items
    .map((item) => `• ${item}`)
    .join("\n");

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <CopyButton text={copyText} />
      </div>

      <div className="mt-3">
        <ResultList
          items={items}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
