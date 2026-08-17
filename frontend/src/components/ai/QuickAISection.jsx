import {
  analyzeResume,
  explainMissingKeywords,
} from "../../api/ai";

import QuickToolCard from "./QuickToolCard";
import ToolBadge from "./ToolBadge";
import LoadingButton from "../common/LoadingButton";
import SuccessMessage from "../common/SuccessMessage";
import ResultList from "./ResultList";
import QuickList from "./QuickList";

export default function QuickAISection({
  jobDescription,
  setJobDescription,
  canUseJD,
  loadingKey,
  run,
  resumeId,
  analysis,
  setAnalysis,
  successKey,
  keywordExplanations,
  setKeywordExplanations,
  clearError,
}) {
  return (
    <section>
      {/* Section heading */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">Quick AI</p>
          <ToolBadge>Free</ToolBadge>
        </div>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Get useful feedback instantly
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Start with practical AI feedback before making deeper changes to
          your resume.
        </p>
      </div>

      {/* =========================================================
          RESUME ANALYSIS
      ========================================================== */}
      <QuickToolCard
        eyebrow="Resume review"
        title="AI analysis for a target role"
        description="Paste a job description to receive strengths, weaknesses, ATS suggestions, and resume-tailoring advice."
      >
        <div className="space-y-3">
          <textarea
            className="input min-h-[220px] w-full resize-y leading-6 sm:min-h-[240px]"
            placeholder="Paste the job description here (minimum 100 characters)..."
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(event.target.value);
              clearError();
            }}
          />

          <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
            <span
              className={
                canUseJD
                  ? "font-medium text-slate-500"
                  : "text-slate-400"
              }
            >
              {canUseJD
                ? "Ready to analyze"
                : "Minimum 100 characters"}
            </span>

            <span className="text-slate-400">
              {jobDescription.length} characters
            </span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <LoadingButton
            loading={loadingKey === "analyze"}
            disabled={!canUseJD}
            onClick={() =>
              run(
                "analyze",
                () => analyzeResume(resumeId, jobDescription),
                setAnalysis
              )
            }
            className="w-full sm:w-auto"
          >
            Analyze resume
          </LoadingButton>
        </div>

        {successKey === "analyze" && (
          <SuccessMessage>
            Analysis completed successfully
          </SuccessMessage>
        )}

        {/* =========================================================
            ANALYSIS RESULT
        ========================================================== */}
        {analysis && (
          <div className="mt-8 space-y-5 border-t border-slate-100 pt-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">AI review</p>

                <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                  What the AI found
                </h3>
              </div>
            </div>

            {/* Overview / strengths / weaknesses */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Overall */}
              <div className="flex min-w-0 flex-col rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Overall review
                </p>

                <div className="mt-3 max-h-[240px] overflow-y-auto pr-2">
                  <p className="break-words text-sm leading-7 text-slate-600">
                    {analysis.resume_review.overall_review}
                  </p>
                </div>
              </div>

              {/* Strengths */}
              <div className="min-w-0 rounded-xl bg-slate-50 p-5">
                <QuickList
                  label="Strengths"
                  items={analysis.resume_review.strengths}
                  emptyMessage="No strengths returned."
                />
              </div>

              {/* Weaknesses */}
              <div className="min-w-0 rounded-xl bg-slate-50 p-5">
                <QuickList
                  label="Weaknesses"
                  items={analysis.resume_review.weaknesses}
                  emptyMessage="No weaknesses returned."
                />
              </div>
            </div>

            {/* Career advice */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Career advice
                </p>

                <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                  {analysis.resume_review.career_advice}
                </p>
              </div>

              <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 md:grid-cols-2">
                <QuickList
                  label="ATS suggestions"
                  items={analysis.ats_suggestions}
                  emptyMessage="No ATS suggestions returned."
                />

                <QuickList
                  label="Resume tailoring"
                  items={analysis.resume_tailoring}
                  emptyMessage="No tailoring suggestions returned."
                />
              </div>
            </div>
          </div>
        )}
      </QuickToolCard>

      {/* =========================================================
          MISSING KEYWORDS
      ========================================================== */}
      <div
        id="missing-keywords"
        className="mt-6 scroll-mt-24"
      >
        <QuickToolCard
          eyebrow="Missing keywords"
          title="Understand your keyword gaps"
          description="Use your JD matching result first, then let AI explain why those missing keywords matter."
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm leading-6 text-slate-500">
                Use the same job description from your JD matching analysis.
              </p>

              {!canUseJD && (
                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium leading-5 text-slate-500">
                    Add a job description above to enable this tool.
                  </p>
                </div>
              )}
            </div>

            <LoadingButton
              loading={loadingKey === "keywords"}
              disabled={!canUseJD}
              onClick={() =>
                run(
                  "keywords",
                  () =>
                    explainMissingKeywords(
                      resumeId,
                      jobDescription
                    ),
                  (data) =>
                    setKeywordExplanations(
                      data.keyword_explanations
                    )
                )
              }
              className="w-full shrink-0 lg:w-auto"
            >
              Explain missing keywords
            </LoadingButton>
          </div>

          {successKey === "keywords" && (
            <SuccessMessage>
              Keyword explanations generated successfully
            </SuccessMessage>
          )}

          {keywordExplanations.length > 0 && (
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {keywordExplanations.map((item) => (
                  <div
                    key={item.keyword}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <p className="break-words font-semibold text-slate-950">
                      {item.keyword}
                    </p>

                    <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                      {item.explanation}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Recommendation
                      </p>

                      <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </QuickToolCard>
      </div>
    </section>
  );
}