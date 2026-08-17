import { Navigate, useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";

function SectionHeading({ eyebrow, title }) {
    return (
        <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {eyebrow}
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                {title}
            </h2>

            <div className="mt-3 h-px w-full bg-slate-200" />
        </div>
    );
}

function EmptySection({ message }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4">
            <p className="text-sm leading-6 text-slate-400">
                {message}
            </p>
        </div>
    );
}

function ContactItem({ label, value, href }) {
    if (!value) return null;

    return (
        <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            {href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                >
                    {value}
                </a>
            ) : (
                <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {value}
                </p>
            )}
        </div>
    );
}

function SkillPills({ skills }) {
    if (!skills?.length) {
        return <EmptySection message="No skills were detected." />;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
                <span
                    key={`${skill}-${index}`}
                    className="max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
}

function ExperienceList({ items }) {
    if (!items?.length) {
        return (
            <EmptySection message="No experience information was detected." />
        );
    }

    return (
        <div className="relative ml-1 border-l border-slate-200 pl-6">
            <div className="space-y-7">
                {items.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className="relative break-words"
                    >
                        <span className="absolute -left-[30px] top-2 h-2 w-2 rounded-full border-2 border-white bg-slate-300 ring-1 ring-slate-200" />

                        <p className="text-sm leading-7 text-slate-600">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SimpleList({ items, emptyMessage }) {
    if (!items?.length) {
        return <EmptySection message={emptyMessage} />;
    }

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={`${item}-${index}`}
                    className="break-words text-sm leading-7 text-slate-600"
                >
                    {item}
                </div>
            ))}
        </div>
    );
}

function ProjectCard({ project, index }) {
    const title =
        project?.title || `Project ${index + 1}`;

    const descriptions = Array.isArray(project?.descriptions)
        ? project.descriptions
        : [];

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 sm:p-5">
            <div className="flex items-start gap-3">
                <span className="mt-1 shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-bold tracking-tight text-slate-950">
                        {title}
                    </h3>

                    {descriptions.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                            {descriptions.map(
                                (description, descriptionIndex) => (
                                    <li
                                        key={descriptionIndex}
                                        className="flex gap-2 break-words text-sm leading-6 text-slate-600"
                                    >
                                        <span className="mt-1 text-slate-300">
                                            •
                                        </span>

                                        <span>
                                            {description}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            No project description was detected.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function Resume() {
    const navigate = useNavigate();

    const {
        hasResume,
        parsedResume,
    } = useResume();

    if (!hasResume) {
        return <Navigate to="/upload" replace />;
    }

    const candidateName =
        parsedResume?.name || "Your Resume";

    const projectDetails =
        parsedResume?.project_details || [];

    return (
        <div className="space-y-7 sm:space-y-9">

            {/* Page header */}
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="eyebrow">
                        Resume
                    </p>

                    <h1 className="mt-2 break-words text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                        {candidateName}
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        A clear view of the information extracted from
                        your uploaded resume.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <button
                        type="button"
                        className="btn-secondary w-full sm:w-auto"
                        onClick={() => navigate("/analysis/ats")}
                    >
                        View ATS score
                    </button>

                    <button
                        type="button"
                        className="btn-primary w-full sm:w-auto"
                        onClick={() => navigate("/analysis/ai")}
                    >
                        Improve with AI
                    </button>
                </div>
            </section>

            {/* Resume document */}
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Resume identity */}
                <header className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Candidate
                            </p>

                            <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                {candidateName}
                            </h2>

                            {parsedResume?.headline && (
                                <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-slate-500">
                                    {parsedResume.headline}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                            <ContactItem
                                label="Email"
                                value={parsedResume?.email}
                            />

                            <ContactItem
                                label="Phone"
                                value={parsedResume?.phone}
                            />

                            <ContactItem
                                label="LinkedIn"
                                value={parsedResume?.linkedin}
                                href={parsedResume?.linkedin}
                            />

                            <ContactItem
                                label="GitHub"
                                value={parsedResume?.github}
                                href={parsedResume?.github}
                            />

                            <ContactItem
                                label="Portfolio"
                                value={parsedResume?.portfolio}
                                href={parsedResume?.portfolio}
                            />
                        </div>
                    </div>
                </header>

                {/* Main resume content */}
                <div className="border-t border-slate-200 px-5 sm:px-8 lg:px-10">

                    {/* Summary */}
                    <section className="py-7 sm:py-8">
                        <SectionHeading
                            eyebrow="Profile"
                            title="Professional Summary"
                        />

                        {parsedResume?.summary ? (
                            <p className="max-w-4xl break-words text-sm leading-7 text-slate-600">
                                {parsedResume.summary}
                            </p>
                        ) : (
                            <EmptySection message="No professional summary was detected." />
                        )}
                    </section>

                    {/* Skills */}
                    <section className="border-t border-slate-200 py-7 sm:py-8">
                        <SectionHeading
                            eyebrow="Capabilities"
                            title="Skills"
                        />

                        <SkillPills
                            skills={parsedResume?.skills}
                        />
                    </section>

                    {/* Experience */}
                    <section className="border-t border-slate-200 py-7 sm:py-8">
                        <SectionHeading
                            eyebrow="Work history"
                            title="Experience"
                        />

                        <ExperienceList
                            items={parsedResume?.experience}
                        />
                    </section>

                    {/* Projects */}
                    <section className="border-t border-slate-200 py-7 sm:py-8">
                        <SectionHeading
                            eyebrow="Selected work"
                            title="Projects"
                        />

                        {projectDetails.length > 0 ? (
                            <div className="space-y-3">
                                {projectDetails.map(
                                    (project, index) => (
                                        <ProjectCard
                                            key={`${project?.title || "project"}-${index}`}
                                            project={project}
                                            index={index}
                                        />
                                    )
                                )}
                            </div>
                        ) : parsedResume?.projects?.length ? (
                            <SimpleList
                                items={parsedResume.projects}
                                emptyMessage="No projects were detected."
                            />
                        ) : (
                            <EmptySection message="No projects were detected." />
                        )}
                    </section>

                    {/* Education + Certifications */}
                    <section className="grid border-t border-slate-200 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">

                        <div className="py-7 sm:py-8 lg:pr-8">
                            <SectionHeading
                                eyebrow="Academic background"
                                title="Education"
                            />

                            <SimpleList
                                items={parsedResume?.education}
                                emptyMessage="No education information was detected."
                            />
                        </div>

                        <div className="border-t border-slate-200 py-7 sm:py-8 lg:border-t-0 lg:pl-8">
                            <SectionHeading
                                eyebrow="Credentials"
                                title="Certifications"
                            />

                            <SimpleList
                                items={parsedResume?.certifications}
                                emptyMessage="No certifications were detected."
                            />
                        </div>

                    </section>
                </div>
            </article>

            {/* Continue analysis */}
            <section className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white sm:p-6 lg:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Continue analysis
                        </p>

                        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                            What would you like to do next?
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            Check your ATS score, compare the resume with
                            a job description, or improve the content with AI.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <button
                            type="button"
                            className="btn-secondary w-full sm:w-auto"
                            onClick={() =>
                                navigate("/analysis/ats")
                            }
                        >
                            ATS Analysis
                        </button>

                        <button
                            type="button"
                            className="btn-secondary w-full sm:w-auto"
                            onClick={() =>
                                navigate("/analysis/match")
                            }
                        >
                            JD Match
                        </button>

                        <button
                            type="button"
                            className="btn-primary w-full sm:w-auto"
                            onClick={() =>
                                navigate("/analysis/ai")
                            }
                        >
                            AI Tools
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}