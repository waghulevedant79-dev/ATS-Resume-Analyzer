export default function QuickToolCard({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="card min-w-0 p-5 sm:p-6 lg:p-8">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="mt-1 break-words text-xl font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-6 min-w-0">{children}</div>
    </section>
  );
}
