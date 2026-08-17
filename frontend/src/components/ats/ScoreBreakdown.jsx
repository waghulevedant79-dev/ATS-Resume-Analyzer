import { useState } from "react";

function labelize(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDetailValue(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${labelize(key)}: ${formatDetailValue(item)}`)
      .join(" • ");
  }

  return String(value);
}

function Details({ details }) {
  if (!details) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        No additional details were returned for this category.
      </p>
    );
  }

  if (typeof details !== "object") {
    return (
      <p className="mt-1 break-words text-sm leading-6 text-slate-700">
        {formatDetailValue(details)}
      </p>
    );
  }

  const entries = Object.entries(details);

  if (!entries.length) {
    return (
      <p className="text-sm leading-6 text-slate-500">
        No additional details were returned for this category.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {labelize(key)}
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-slate-700">
            {formatDetailValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ScoreBreakdown({ atsScore }) {
  const [expandedKey, setExpandedKey] = useState(null);

  if (!atsScore?.breakdown) return null;

  return (
    <section className="card min-w-0 p-6 sm:p-7 lg:p-8">
      <div className="mb-8">
        <p className="eyebrow">Score breakdown</p>

        <h2 className="mt-1 text-xl font-bold text-slate-950">
          What is helping your ATS score?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Explore how each resume section contributed to your overall score.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(atsScore.breakdown).map(([key, result]) => {
          const percentage = result.max_score
            ? Math.round((result.score / result.max_score) * 100)
            : 0;

          const isExpanded = expandedKey === key;

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() =>
                  setExpandedKey(isExpanded ? null : key)
                }
                className="w-full text-left"
                aria-expanded={isExpanded}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {labelize(key)}
                    </span>

                    <span className="text-xs text-slate-400">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-950">
                    {result.score}/{result.max_score}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <Details details={result.details} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}