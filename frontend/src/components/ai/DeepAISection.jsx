import { useState } from "react";

import {
  generateProfessionalSummary,
  enhanceProject,
  rewriteResume,
} from "../../api/ai";

import { useAuth } from "../../context/AuthContext";
import UsageLimitPrompt from "../auth/UsageLimitPrompt";
import DeepToolCard from "./DeepToolCard";
import ToolBadge from "./ToolBadge";
import ResultList from "./ResultList";
import CopyableText from "./CopyableText";
import CopyableList from "./CopyableList";
import CopyButton from "../common/CopyButton";
import LoadingButton from "../common/LoadingButton";
import SuccessMessage from "../common/SuccessMessage";
import AuthPrompt from "../auth/AuthPrompt";
import EditorialSelect from "../common/EditorialSelect";

export default function DeepAISection({
  parsedResume,
  projectIndex,
  setProjectIndex,
  loadingKey,
  run,
  resumeId,
  successKey,
  summary,
  setSummary,
  enhancement,
  setEnhancement,
  rewrite,
  setRewrite,
  clearError,
  deepAIUsage,
  deepAILimitReached,
}) {
  const { isAuthenticated } = useAuth();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showUsageLimitPrompt, setShowUsageLimitPrompt] =
    useState(false);

  function canUseDeepAI() {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }

    if (deepAILimitReached) {
      setShowUsageLimitPrompt(true);
      return false;
    }

    return true;
  }

  const projectOptions =
    parsedResume?.project_details?.map((project, index) => ({
      value: index,
      label: project.title || `Project ${index + 1}`,
    })) || [];

  return (
    <section id="deep-ai" className="scroll-mt-24">
      {/* =========================================================
          DEEP AI HEADER
      ========================================================== */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">Deep AI</p>
              <ToolBadge label="Advanced" />
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Take your resume further
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Go beyond feedback with AI-generated improvements for specific
              sections and the complete resume.
            </p>
          </div>

          {/* Usage */}
          {deepAIUsage && (
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-sm font-semibold text-slate-700">
                {deepAIUsage.remaining_uses} of{" "}
                {deepAIUsage.limit} uses remaining
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Resets{" "}
                {new Date(
                  deepAIUsage.reset_at
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          DEEP AI TOOLS
      ========================================================== */}
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* =====================================================
              PROFESSIONAL SUMMARY
          ====================================================== */}
          <DeepToolCard
            eyebrow="Professional summary"
            title="Generate a stronger summary"
            description="Create a concise, ATS-friendly summary based only on the information already present in your resume."
          >
            <LoadingButton
              loading={loadingKey === "summary"}
              onClick={() => {
                if (!canUseDeepAI()) return;

                run(
                  "summary",
                  () =>
                    generateProfessionalSummary(resumeId),
                  (data) =>
                    setSummary(
                      data.professional_summary
                    )
                );
              }}
              className="w-full sm:w-auto"
            >
              Generate summary
            </LoadingButton>

            {successKey === "summary" && (
              <SuccessMessage>
                Professional summary generated successfully
              </SuccessMessage>
            )}

            {summary && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Generated result
                  </p>

                  <CopyButton text={summary} />
                </div>

                <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                  {summary}
                </p>
              </div>
            )}
          </DeepToolCard>

          {/* =====================================================
              PROJECT ENHANCEMENT
          ====================================================== */}
          <DeepToolCard
            eyebrow="Project enhancement"
            title="Improve one project"
            description="Turn an existing project description into stronger, clearer, impact-focused resume bullets."
          >
            {parsedResume?.project_details?.length ? (
              <>
                {/* Editorial project selector */}
                <EditorialSelect
                  value={projectIndex}
                  options={projectOptions}
                  onChange={(value) => {
                    setProjectIndex(Number(value));
                    setEnhancement(null);
                    clearError();
                  }}
                />

                <div className="mt-3">
                  <LoadingButton
                    loading={loadingKey === "project"}
                    onClick={() => {
                      if (!canUseDeepAI()) return;

                      run(
                        "project",
                        () =>
                          enhanceProject(
                            resumeId,
                            projectIndex
                          ),
                        setEnhancement
                      );
                    }}
                    className="w-full sm:w-auto"
                  >
                    Enhance project
                  </LoadingButton>
                </div>

                {successKey === "project" && (
                  <SuccessMessage>
                    Project enhanced successfully
                  </SuccessMessage>
                )}

                {enhancement && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Enhanced bullets
                      </p>

                      <CopyButton
                        text={enhancement.enhanced_description
                          ?.map(
                            (item) => `• ${item}`
                          )
                          .join("\n")}
                      />
                    </div>

                    <div className="mt-3">
                      <ResultList
                        items={
                          enhancement.enhanced_description
                        }
                        emptyMessage="No enhanced description returned."
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">
                  No structured projects are available.
                </p>
              </div>
            )}
          </DeepToolCard>
        </div>

        {/* =========================================================
            COMPLETE REWRITE
        ========================================================== */}
        <DeepToolCard
          eyebrow="Complete rewrite"
          title="Rewrite the full resume"
          description="Generate an ATS-friendly rewrite while preserving the factual content already present in your resume."
        >
          <LoadingButton
            loading={loadingKey === "rewrite"}
            onClick={() => {
              if (!canUseDeepAI()) return;

              run(
                "rewrite",
                () => rewriteResume(resumeId),
                setRewrite
              );
            }}
            className="w-full sm:w-auto"
          >
            Rewrite resume
          </LoadingButton>

          {successKey === "rewrite" && (
            <SuccessMessage>
              Resume rewrite generated successfully
            </SuccessMessage>
          )}

          {rewrite && (
            <div className="mt-7 border-t border-slate-100 pt-7">
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Professional summary */}
                <CopyableText
                  label="Professional summary"
                  text={rewrite.professional_summary}
                />

                {/* Skills */}
                <div className="min-w-0 rounded-xl bg-slate-50 p-4">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Skills
                    </p>

                    <CopyButton
                      text={rewrite.skills?.join(", ")}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {rewrite.skills?.length ? (
                      rewrite.skills.map((skill) => (
                        <span
                          key={skill}
                          className="max-w-full break-words rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No skills returned.
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="min-w-0 lg:col-span-2">
                  <CopyableList
                    label="Experience"
                    items={rewrite.experience}
                    emptyMessage="No experience returned."
                  />
                </div>

                {/* Projects */}
                <div className="min-w-0 rounded-xl bg-slate-50 p-4 lg:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Projects
                    </p>

                    <CopyButton
                      text={rewrite.projects
                        ?.map(
                          (project) =>
                            `${project.title || "Project"}\n${
                              project.descriptions
                                ?.map(
                                  (description) =>
                                    `• ${description}`
                                )
                                .join("\n") || ""
                            }`
                        )
                        .join("\n\n")}
                    />
                  </div>

                  <div className="mt-3 space-y-3">
                    {rewrite.projects?.length ? (
                      rewrite.projects.map(
                        (project, index) => (
                          <div
                            key={`${project.title}-${index}`}
                            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <p className="break-words font-semibold text-slate-900">
                              {project.title ||
                                `Project ${index + 1}`}
                            </p>

                            <div className="mt-3">
                              <ResultList
                                items={
                                  project.descriptions
                                }
                                emptyMessage="No descriptions returned."
                              />
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-slate-400">
                        No projects returned.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DeepToolCard>
      </div>

      {/* =========================================================
          AUTH / USAGE MODALS
      ========================================================== */}
      {showAuthPrompt && (
        <AuthPrompt
          onClose={() => setShowAuthPrompt(false)}
        />
      )}

      {showUsageLimitPrompt && (
        <UsageLimitPrompt
          resetAt={deepAIUsage?.reset_at}
          onClose={() =>
            setShowUsageLimitPrompt(false)
          }
        />
      )}
    </section>
  );
}