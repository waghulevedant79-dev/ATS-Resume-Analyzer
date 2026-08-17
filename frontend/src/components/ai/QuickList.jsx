import ResultList from "./ResultList";

export default function QuickList({ label, items, emptyMessage }) {
  return (
    <div className="flex h-[280px] min-w-0 flex-col">
      <p className="shrink-0 text-sm font-semibold text-slate-800">
        {label}
      </p>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2">
        <ResultList
          items={items}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
