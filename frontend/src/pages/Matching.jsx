import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { matchResume } from "../api/matching";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingButton from "../components/common/LoadingButton";


function SectionHeading({ eyebrow, title, description }) {
    return (
        <div>
            <p className="eyebrow">
                {eyebrow}
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                {title}
            </h2>

            {description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    {description}
                </p>
            )}

            <div className="mt-4 h-px w-full bg-slate-200" />
        </div>
    );
}


function MatchScore({ value }) {
    const percentage = Math.max(
        0,
        Math.min(100, Number(value || 0))
    );

    const label =
        percentage >= 80
            ? "Strong match"
            : percentage >= 60
                ? "Good match"
                : percentage >= 40
                    ? "Partial match"
                    : "Low match";

    return (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div
                className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                style={{
                    background: `conic-gradient(#0f172a ${percentage}%, #e2e8f0 ${percentage}% 100%)`,
                }}
            >
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-bold tracking-tight text-slate-950">
                        {percentage.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="min-w-0 text-center sm:text-left">
                <p className="text-lg font-bold text-slate-950">
                    {label}
                </p>

                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    Your resume was compared against the requirements
                    found in this job description.
                </p>
            </div>
        </div>
    );
}


function MetricBlock({ label, value, description }) {
    return (
        <div className="min-w-0 py-4 sm:px-5 sm:py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                {value}
            </p>

            {description && (
                <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
}


function SkillChip({ children, matched }) {
    return (
        <span
            className={
                matched
                    ? "max-w-full break-words rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                    : "max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
            }
        >
            {children}
        </span>
    );
}


function StatusBadge({ matched }) {
    return (
        <span
            className={
                matched
                    ? "inline-flex shrink-0 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white"
                    : "inline-flex shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
            }
        >
            {matched ? "Matched" : "Not matched"}
        </span>
    );
}


function ResponsibilityList({ items, matched }) {
    if (!items?.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4">
                <p className="text-sm leading-6 text-slate-400">
                    {matched
                        ? "No responsibilities matched."
                        : "No missing responsibilities detected."}
                </p>
            </div>
        );
    }

    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li
                    key={`${item}-${index}`}
                    className="flex gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                >
                    <span className="shrink-0 font-semibold text-slate-300">
                        {matched ? "✓" : "•"}
                    </span>

                    <span className="min-w-0 break-words">
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    );
}


export default function Matching() {
    const navigate = useNavigate();

    const {
        hasResume,
        resumeId,
    } = useResume();

    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showJobDescription, setShowJobDescription] = useState(false);

    if (!hasResume) {
        return <Navigate to="/upload" replace />;
    }


    async function handleMatch(event) {
        event.preventDefault();

        const trimmedDescription =
            jobDescription.trim();

        if (trimmedDescription.length < 100) {
            setError(
                "Please enter at least 100 characters for a meaningful job description."
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await matchResume(
                resumeId,
                trimmedDescription
            );

            setResult(response);
            setShowJobDescription(false);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            setError(
                err.message ||
                "We couldn't analyze this job description."
            );
        } finally {
            setLoading(false);
        }
    }


    function handleNewMatch() {
        setResult(null);
        setError("");
        setShowJobDescription(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }


    return (
        <div className="space-y-7 sm:space-y-9">

            {/* =====================================================
                HEADER
            ===================================================== */}
            <section>
                <p className="eyebrow">
                    Job matching
                </p>

                <h1 className="mt-2 break-words text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                    Match your resume to a job
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                    Compare your resume with a real job description
                    and understand where your experience aligns or
                    falls short.
                </p>
            </section>


            {/* =====================================================
                JOB DESCRIPTION INPUT
            ===================================================== */}
            <form
                onSubmit={handleMatch}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8"
            >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <label
                            htmlFor="job-description"
                            className="text-base font-bold text-slate-950"
                        >
                            Job description
                        </label>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Paste the complete job description for
                            the most useful match.
                        </p>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-slate-400">
                        Minimum 100 characters
                    </span>
                </div>


                <textarea
                    id="job-description"
                    className="input mt-5 min-h-52 w-full resize-y leading-6 sm:min-h-56"
                    placeholder="Paste the complete job description here..."
                    value={jobDescription}
                    onChange={(event) =>
                        setJobDescription(event.target.value)
                    }
                />


                <div className="mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span
                        className={
                            jobDescription.trim().length >= 100
                                ? "font-medium text-slate-500"
                                : "text-slate-400"
                        }
                    >
                        {jobDescription.trim().length >= 100
                            ? "Ready to analyze"
                            : "Add more detail to continue"}
                    </span>

                    <span className="text-slate-400">
                        {jobDescription.length} characters
                    </span>
                </div>


                <ErrorMessage
                    message={error}
                    onClose={() => setError("")}
                    variant="inline"
                />


                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    {result && (
                        <button
                            type="button"
                            onClick={handleNewMatch}
                            className="btn-secondary w-full sm:w-auto"
                        >
                            Analyze another job
                        </button>
                    )}

                    <LoadingButton loading={loading}>
                        {result
                            ? "Analyze again"
                            : "Analyze match"}
                    </LoadingButton>
                </div>
            </form>


            {/* =====================================================
                RESULTS
            ===================================================== */}
            {result && (
                <section className="space-y-7 sm:space-y-8">

                    {/* -------------------------------------------------
                        MATCH OVERVIEW
                    ------------------------------------------------- */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid lg:grid-cols-[1fr_1.35fr]">

                            {/* Score */}
                            <div className="min-w-0 p-5 sm:p-7 lg:p-8">
                                <p className="eyebrow">
                                    Overall match
                                </p>

                                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                                    How well does your resume fit?
                                </h2>

                                <div className="mt-7">
                                    <MatchScore
                                        value={result.overall_match}
                                    />
                                </div>
                            </div>


                            {/* Metrics */}
                            <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
                                <div className="grid sm:grid-cols-2">

                                    <div className="border-b border-slate-200 sm:border-r">
                                        <MetricBlock
                                            label="Skills"
                                            value={`${result.skills.match_percentage}%`}
                                            description={`${result.skills.matched_skills.length} matched skills`}
                                        />
                                    </div>

                                    <div className="border-b border-slate-200">
                                        <MetricBlock
                                            label="Experience"
                                            value={
                                                result.experience.matched
                                                    ? "Matched"
                                                    : "Not matched"
                                            }
                                            description={`${result.experience.candidate_years}y candidate experience`}
                                        />
                                    </div>

                                    <div className="border-b border-slate-200 sm:border-r sm:border-b-0">
                                        <MetricBlock
                                            label="Education"
                                            value={
                                                result.education.matched
                                                    ? "Matched"
                                                    : "Not matched"
                                            }
                                            description={`Required level ${result.education.required_level}`}
                                        />
                                    </div>

                                    <div>
                                        <MetricBlock
                                            label="Responsibilities"
                                            value={`${result.responsibilities.match_percentage}%`}
                                            description={`${result.responsibilities.matched_responsibilities} of ${result.responsibilities.total_responsibilities} matched`}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* Confidence */}
                        <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Analysis confidence
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {result.confidence.level} confidence
                                    </p>
                                </div>

                                <span className="text-xs text-slate-500">
                                    Based on the information available
                                    in your resume and job description.
                                </span>
                            </div>
                        </div>
                    </section>


                    {/* -------------------------------------------------
                        SKILLS
                    ------------------------------------------------- */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                        <SectionHeading
                            eyebrow="Skills"
                            title="Matched and missing skills"
                            description="See which skills are already present and which ones were not found in your resume."
                        />


                        <div className="mt-6 grid gap-7 lg:grid-cols-2 lg:gap-10">

                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Matched
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        {result.skills.matched_skills.length}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {result.skills.matched_skills.length ? (
                                        result.skills.matched_skills.map(
                                            (skill) => (
                                                <SkillChip
                                                    key={skill}
                                                    matched
                                                >
                                                    {skill}
                                                </SkillChip>
                                            )
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            No matched skills.
                                        </p>
                                    )}
                                </div>
                            </div>


                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Missing
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        {result.skills.missing_skills.length}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {result.skills.missing_skills.length ? (
                                        result.skills.missing_skills.map(
                                            (skill) => (
                                                <SkillChip
                                                    key={skill}
                                                    matched={false}
                                                >
                                                    {skill}
                                                </SkillChip>
                                            )
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            No missing skills detected.
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </section>


                    {/* -------------------------------------------------
                        QUALIFICATION
                    ------------------------------------------------- */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                        <SectionHeading
                            eyebrow="Qualification match"
                            title="Education and experience"
                            description="See how your qualifications compare with the requirements identified in the job description."
                        />


                        <div className="mt-6 grid gap-3 lg:grid-cols-2">

                            <div className="rounded-xl border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">
                                            Education
                                        </p>

                                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                            Required level
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-950">
                                            {result.education.required_level}
                                        </p>

                                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                            Your resume
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-950">
                                            {result.education.candidate_level}
                                        </p>
                                    </div>

                                    <StatusBadge
                                        matched={result.education.matched}
                                    />
                                </div>
                            </div>


                            <div className="rounded-xl border border-slate-200 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">
                                            Experience
                                        </p>

                                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                            Required
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-950">
                                            {result.experience.required_years}y
                                        </p>

                                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                            Your resume
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-950">
                                            {result.experience.candidate_years}y
                                        </p>
                                    </div>

                                    <StatusBadge
                                        matched={result.experience.matched}
                                    />
                                </div>
                            </div>

                        </div>
                    </section>


                    {/* -------------------------------------------------
                        RESPONSIBILITIES
                    ------------------------------------------------- */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0">
                                <p className="eyebrow">
                                    Responsibilities
                                </p>

                                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                                    Where your experience aligns
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {result.responsibilities.matched_responsibilities} of{" "}
                                    {result.responsibilities.total_responsibilities}{" "}
                                    responsibilities matched.
                                </p>
                            </div>

                            <span className="inline-flex w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                {result.responsibilities.match_percentage}% match
                            </span>
                        </div>


                        <div className="mt-6 grid gap-7 lg:grid-cols-2 lg:gap-10">

                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Matched responsibilities
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        {result.responsibilities.matched_items?.length || 0}
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <ResponsibilityList
                                        items={
                                            result.responsibilities.matched_items
                                        }
                                        matched
                                    />
                                </div>
                            </div>


                            <div className="min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Missing responsibilities
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        {result.responsibilities.missing_items?.length || 0}
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <ResponsibilityList
                                        items={
                                            result.responsibilities.missing_items
                                        }
                                        matched={false}
                                    />
                                </div>
                            </div>

                        </div>
                    </section>


                    {/* -------------------------------------------------
                        JOB DESCRIPTION
                    ------------------------------------------------- */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() =>
                                setShowJobDescription(
                                    (current) => !current
                                )
                            }
                            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
                        >
                            <div className="min-w-0">
                                <p className="eyebrow">
                                    Job description
                                </p>

                                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                                    Review the job you analyzed
                                </h2>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-500">
                                {showJobDescription
                                    ? "Hide"
                                    : "View"}
                            </span>
                        </button>


                        {showJobDescription && (
                            <div className="border-t border-slate-200 px-5 py-5 sm:px-7 sm:py-6">
                                <div className="rounded-xl bg-slate-50 px-4 py-4 sm:px-5">
                                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                                        {jobDescription}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>


                    {/* -------------------------------------------------
                        NEXT STEP
                    ------------------------------------------------- */}
                    <section className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white sm:p-7 lg:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Next step
                                </p>

                                <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                                    Want to improve your match?
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                                    Use AI Tools to understand missing
                                    keywords and improve your resume
                                    without inventing experience.
                                </p>
                            </div>


                            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleNewMatch}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                                >
                                    Analyze another job
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/analysis/ai")
                                    }
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
                                >
                                    Improve with AI
                                </button>
                            </div>

                        </div>
                    </section>

                </section>
            )}
        </div>
    );
}