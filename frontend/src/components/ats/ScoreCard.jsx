function getScoreLabel(percentage) {
  if (percentage >= 85) {
    return {
      label: "Excellent",
      description:
        "Your resume has strong ATS compatibility with only a few areas that may need attention.",
    };
  }

  if (percentage >= 70) {
    return {
      label: "Good",
      description:
        "Your resume has a solid foundation, with several opportunities to improve ATS compatibility.",
    };
  }

  if (percentage >= 50) {
    return {
      label: "Needs improvement",
      description:
        "Your resume has a workable foundation, but several areas could be strengthened.",
    };
  }

  return {
    label: "Needs attention",
    description:
      "Your resume has several areas that should be improved for stronger ATS compatibility.",
  };
}

export default function ScoreCard({ atsScore }) {
  if (!atsScore) return null;

  const percentage = Math.max(
    0,
    Math.min(100, Number(atsScore.percentage || 0))
  );

  const scoreInfo = getScoreLabel(percentage);

  return (
    <section className="card min-w-0 p-6 sm:p-7 lg:p-8">
      <p className="eyebrow">ATS score</p>

      <div className="mt-6 flex items-center justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold tracking-[-0.05em] text-slate-950 sm:text-6xl">
              {percentage.toFixed(1)}
            </span>

            <span className="mb-2 text-sm font-medium text-slate-400 sm:text-base">
              / 100
            </span>
          </div>

          <div className="mt-4">
            <p className="text-lg font-bold tracking-tight text-slate-950">
              {scoreInfo.label}
            </p>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              {scoreInfo.description}
            </p>
          </div>
        </div>

        <div
          className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#0f172a ${percentage}%, #e2e8f0 ${percentage}% 100%)`,
          }}
          aria-label={`ATS score ${Math.round(percentage)} percent`}
        >
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white">
            <span className="text-xl font-bold tracking-tight text-slate-950">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}