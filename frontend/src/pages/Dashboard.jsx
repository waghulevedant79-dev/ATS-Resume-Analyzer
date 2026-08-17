import { Navigate, useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import ScoreCard from "../components/ats/ScoreCard";
import ScoreBreakdown from "../components/ats/ScoreBreakdown";

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h2 className="mt-1 text-xl font-bold text-slate-950">
          {title}
        </h2>
      </div>

      {action}
    </div>
  );
}

function EmptyState({ message, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
      <p className="text-sm leading-6 text-slate-500">
        {message}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ContactRow({ label, value, href }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 border-b border-slate-100 py-3.5 last:border-0 last:pb-0 first:pt-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      {!value ? (
        <span className="break-words text-sm text-slate-400">
          Not detected
        </span>
      ) : href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 break-all text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950"
        >
          {value}
        </a>
      ) : (
        <span className="min-w-0 break-all text-sm text-slate-700">
          {value}
        </span>
      )}
    </div>
  );
}

function SkillList({ skills }) {
  if (!skills?.length) {
    return <EmptyState message="No skills were detected in this resume." />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className="max-w-full break-words rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function TextList({ items, emptyMessage }) {
  if (!items?.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, index, onImprove }) {
  return (
    <article className="group py-5 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.16em] text-slate-400">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-8 bg-slate-200" />
          </div>

          <h3 className="mt-3 break-words text-lg font-bold tracking-tight text-slate-950">
            {project.title || `Project ${index + 1}`}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onImprove(index)}
          className="btn-secondary w-full shrink-0 px-3 py-2 text-xs sm:w-auto"
        >
          Improve with AI
        </button>
      </div>

      {project.descriptions?.length ? (
        <ul className="mt-4 space-y-2 sm:ml-[3.25rem]">
          {project.descriptions.map((description, descriptionIndex) => (
            <li
              key={descriptionIndex}
              className="flex min-w-0 items-start gap-2.5 break-words text-sm leading-6 text-slate-600"
            >
              <span
                aria-hidden="true"
                className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"
              />

              <span className="min-w-0 break-words">
                {description}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-400 sm:ml-[3.25rem]">
          No project descriptions detected.
        </p>
      )}
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    hasResume,
    parsedResume,
    atsScore,
  } = useResume();

  if (!hasResume) {
    return <Navigate to="/upload" replace />;
  }

  const candidateName = parsedResume?.name || "Your resume";

  const hasSummary = Boolean(parsedResume?.summary);

  function handleImproveProject(index) {
    navigate(`/analysis/ai?project=${index}`);
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Resume analysis</p>

          <h1 className="mt-2 break-words text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-[2.65rem]">
            {candidateName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review your ATS health, understand what was detected, and find
            opportunities to improve your resume.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={() => navigate("/analysis/match")}
          >
            Match a JD
          </button>

          <button
            type="button"
            className="btn-primary w-full sm:w-auto"
            onClick={() => navigate("/analysis/ai")}
          >
            AI Tools
          </button>
        </div>
      </section>

      {/* Score overview */}
      <section className="grid items-start gap-6 sm:gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <ScoreCard atsScore={atsScore} />
        <ScoreBreakdown atsScore={atsScore} />
      </section>

      {/* Contact + Summary */}
      <section className="card min-w-0 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Contact */}
          <div className="min-w-0">
            <SectionHeader
              eyebrow="Contact"
              title="Contact information"
            />

            <div className="mt-6">
              <ContactRow
                label="Email"
                value={parsedResume?.email}
              />

              <ContactRow
                label="Phone"
                value={parsedResume?.phone}
              />

              <ContactRow
                label="LinkedIn"
                value={parsedResume?.linkedin}
                href={parsedResume?.linkedin}
              />

              <ContactRow
                label="GitHub"
                value={parsedResume?.github}
                href={parsedResume?.github}
              />

              <ContactRow
                label="Portfolio"
                value={parsedResume?.portfolio}
                href={parsedResume?.portfolio}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="min-w-0 lg:border-l lg:border-slate-100 lg:pl-10">
            <SectionHeader
              eyebrow="Professional summary"
              title="Resume summary"
            />

            <div className="mt-6">
              {hasSummary ? (
                <p className="max-w-2xl break-words text-sm leading-7 text-slate-600">
                  {parsedResume.summary}
                </p>
              ) : (
                <div className="max-w-md">
                  <p className="text-sm leading-6 text-slate-500">
                    No professional summary was detected in your resume.
                  </p>

                  <button
                    type="button"
                    className="btn-secondary mt-5 w-full sm:w-auto"
                    onClick={() => navigate("/analysis/ai")}
                  >
                    Generate with AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills + Education */}
      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        {/* Skills */}
        <section className="card min-w-0 p-5 sm:p-7">
          <SectionHeader
            eyebrow="Skills"
            title="Detected skills"
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {(parsedResume?.skills ?? []).length > 0 ? (
              parsedResume.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium leading-4 text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-800"
                >
                  <span className="break-words">
                    {skill}
                  </span>
                </span>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                No skills were detected in your resume.
              </p>
            )}
          </div>
        </section>

        {/* Education */}
        <section className="card min-w-0 p-5 sm:p-7">
          <SectionHeader
            eyebrow="Education"
            title="Education"
          />

          <div className="mt-6">
            {(parsedResume?.education ?? []).length > 0 ? (
              <div className="divide-y divide-slate-100">
                {parsedResume.education.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <p className="break-words text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                No education information was detected in your resume.
              </p>
            )}
          </div>
        </section>
      </section>

      {/* Experience + Certifications */}
      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        {/* Experience */}
        <section className="card min-w-0 p-5 sm:p-7">
          <SectionHeader
            eyebrow="Experience"
            title="Experience"
          />

          <div className="mt-6">
            {(parsedResume?.experience ?? []).length > 0 ? (
              <div className="space-y-5">
                {parsedResume.experience.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="relative pl-5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-slate-300"
                    />

                    <div className="border-l border-slate-200 pl-5">
                      <p className="break-words text-sm leading-6 text-slate-600">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                No experience information was detected in your resume.
              </p>
            )}
          </div>
        </section>

        {/* Certifications */}
        <section className="card min-w-0 p-5 sm:p-7">
          <SectionHeader
            eyebrow="Certifications"
            title="Certifications"
          />

          <div className="mt-6">
            {(parsedResume?.certifications ?? []).length > 0 ? (
              <div className="divide-y divide-slate-100">
                {parsedResume.certifications.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <p className="break-words text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                No certifications were detected in your resume.
              </p>
            )}
          </div>
        </section>
      </section>

      {/* Projects */}
      <section className="card min-w-0 p-5 sm:p-6 lg:p-8">
        <SectionHeader
          eyebrow="Projects"
          title="Detected project structure"
          action={
            parsedResume?.project_details?.length ? (
              <button
                type="button"
                className="btn-secondary hidden shrink-0 sm:inline-flex"
                onClick={() => navigate("/analysis/ai")}
              >
                Improve projects
              </button>
            ) : null
          }
        />

        {parsedResume?.project_details?.length ? (
          <div className="mt-6 divide-y divide-slate-100">
            {parsedResume.project_details.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                project={project}
                index={index}
                onImprove={handleImproveProject}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState message="No structured projects were detected in your resume." />
          </div>
        )}

        {parsedResume?.project_details?.length ? (
          <button
            type="button"
            className="btn-secondary mt-4 w-full sm:hidden"
            onClick={() => navigate("/analysis/ai")}
          >
            Improve projects with AI
          </button>
        ) : null}
      </section>

      {/* Bottom CTA */}
      <section className="mt-5 overflow-hidden rounded-2xl bg-slate-900 px-5 py-7 text-white sm:px-7 sm:py-8 lg:px-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Next step
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Ready to take your analysis further?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Compare your resume with a real job description or use AI tools to
              improve the content.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 sm:w-auto"
              onClick={() => navigate("/analysis/match")}
            >
              Match a job
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 active:translate-y-0 sm:w-auto"
              onClick={() => navigate("/analysis/ai")}
            >
              Explore AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}