import ToolBadge from "./ToolBadge";

export default function DeepToolCard({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="card flex min-w-0 flex-col p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>

          <h3 className="mt-1 break-words text-lg font-bold text-slate-950">
            {title}
          </h3>
        </div>

        <ToolBadge>Advanced</ToolBadge>
      </div>

      <p className="mt-3 break-words text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}
