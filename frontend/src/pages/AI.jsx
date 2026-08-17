import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import {
  analyzeResume,
  explainMissingKeywords,
  generateProfessionalSummary,
  enhanceProject,
  rewriteResume,
  getDeepAIUsage,
} from "../api/ai";

import AIErrorCard from "../components/ai/AIErrorCard";
import QuickAISection from "../components/ai/QuickAISection";
import DeepAISection from "../components/ai/DeepAISection";
import { useResume } from "../context/ResumeContext";

export default function AI() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { hasResume, resumeId, parsedResume } = useResume();

  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [summary, setSummary] = useState("");
  const [keywordExplanations, setKeywordExplanations] = useState([]);
  const [rewrite, setRewrite] = useState(null);
  const [enhancement, setEnhancement] = useState(null);
  const [deepAIUsage, setDeepAIUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const [projectIndex, setProjectIndex] = useState(0);

  const [error, setError] = useState("");
  const [loadingKey, setLoadingKey] = useState("");
  const [failedKey, setFailedKey] = useState("");
  const [successKey, setSuccessKey] = useState("");

  const errorRef = useRef(null);
  const successTimerRef = useRef(null);

  const requestedProject = searchParams.get("project");
  const requestedTool = searchParams.get("tool");

  const deepAILimitReached =
    deepAIUsage && deepAIUsage.remaining_uses <= 0;

  useEffect(() => {
    if (requestedProject === null) return;

    const index = Number(requestedProject);

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < (parsedResume?.project_details?.length || 0)
    ) {
      setProjectIndex(index);

      setTimeout(() => {
        document
          .getElementById("deep-ai")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [requestedProject, parsedResume]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      errorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (requestedTool === "missing-keywords") {
      setTimeout(() => {
        document
          .getElementById("missing-keywords")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [requestedTool]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDeepAIUsage() {
      try {
        setUsageLoading(true);

        const data = await getDeepAIUsage();

        if (!cancelled) {
          setDeepAIUsage(data);
        }
      } catch (err) {
        console.error("Failed to load Deep AI usage:", err);
      } finally {
        if (!cancelled) {
          setUsageLoading(false);
        }
      }
    }

    loadDeepAIUsage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasResume) {
    return <Navigate to="/upload" replace />;
  }

  function showSuccess(key) {
    setSuccessKey(key);

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = setTimeout(() => {
      setSuccessKey("");
    }, 2500);
  }

  async function run(key, action, onSuccess) {
    setLoadingKey(key);
    setFailedKey("");
    setError("");
    setSuccessKey("");

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }

    try {
      const data = await action();

      onSuccess(data);

      if (
        key === "summary" ||
        key === "project" ||
        key === "rewrite"
      ) {
        try {
          const usage = await getDeepAIUsage();
          setDeepAIUsage(usage);
        } catch (usageError) {
          console.error(
            "Failed to refresh Deep AI usage:",
            usageError
          );
        }
      }

      showSuccess(key);
    } catch (err) {
      console.error(`AI request failed (${key}):`, err);

      setFailedKey(key);

      setError(
        "Something went wrong while processing your request. Please try again in a moment."
      );
    } finally {
      setLoadingKey("");
    }
  }

  async function retryFailedTool() {
    if (!failedKey) return;

    if (failedKey === "analyze") {
      await run(
        "analyze",
        () => analyzeResume(resumeId, jobDescription),
        setAnalysis
      );

      return;
    }

    if (failedKey === "keywords") {
      await run(
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
      );

      return;
    }

    if (failedKey === "summary") {
      await run(
        "summary",
        () => generateProfessionalSummary(resumeId),
        (data) =>
          setSummary(data.professional_summary)
      );

      return;
    }

    if (failedKey === "project") {
      await run(
        "project",
        () =>
          enhanceProject(
            resumeId,
            projectIndex
          ),
        setEnhancement
      );

      return;
    }

    if (failedKey === "rewrite") {
      await run(
        "rewrite",
        () => rewriteResume(resumeId),
        setRewrite
      );
    }
  }

  const canUseJD = jobDescription.trim().length >= 100;

  function clearError() {
    if (error) {
      setError("");
    }

    if (failedKey) {
      setFailedKey("");
    }

    if (successKey) {
      setSuccessKey("");
    }
  }

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <section className="max-w-4xl">
        <p className="eyebrow">AI tools</p>

        <div className="mt-2">
          <h1 className="break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
            Improve the resume you already have
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Use AI to understand your resume, improve its wording, and make
            better decisions without inventing experience or changing your ATS
            score.
          </p>
        </div>
      </section>

      {/* =========================================================
          GLOBAL AI ERROR
      ========================================================== */}
      <div ref={errorRef}>
        <AIErrorCard
          message={error}
          onRetry={failedKey ? retryFailedTool : null}
        />
      </div>

      <QuickAISection
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        canUseJD={canUseJD}
        loadingKey={loadingKey}
        run={run}
        resumeId={resumeId}
        analysis={analysis}
        setAnalysis={setAnalysis}
        successKey={successKey}
        keywordExplanations={keywordExplanations}
        setKeywordExplanations={setKeywordExplanations}
        clearError={clearError}
      />

      <DeepAISection
        parsedResume={parsedResume}
        projectIndex={projectIndex}
        setProjectIndex={setProjectIndex}
        loadingKey={loadingKey}
        run={run}
        resumeId={resumeId}
        successKey={successKey}
        summary={summary}
        setSummary={setSummary}
        enhancement={enhancement}
        setEnhancement={setEnhancement}
        rewrite={rewrite}
        setRewrite={setRewrite}
        clearError={clearError}
        deepAIUsage={deepAIUsage}
        deepAILimitReached={deepAILimitReached}
      />

      {/* =========================================================
          FUTURE AI WORKSPACE
      ========================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">AI workspace</p>

            <h2 className="mt-1 break-words text-xl font-bold tracking-tight text-slate-950">
              More powerful AI tools are coming
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              The advanced AI layer will eventually include personalized
              usage limits, accounts, saved generations, and premium
              capabilities.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary w-full shrink-0 sm:w-auto"
            onClick={() => navigate("/analysis/ats")}
          >
            Back to ATS
          </button>
        </div>
      </section>
    </div>
  );
}