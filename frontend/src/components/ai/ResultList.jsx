export default function ResultList({ items, emptyMessage }) {
  if (!items?.length) {
    return (
      <p className="text-sm leading-6 text-slate-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="break-words rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
        >
          <span className="mr-2 font-semibold text-slate-400">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
