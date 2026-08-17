import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import homeDoodle from "../assets/doodles/home-resume-check.png";

const features = [
  ["01", "ATS scoring", "See an explainable score across the resume sections the backend evaluates."],
  ["02", "JD matching", "Compare your resume with a real job description and see matched and missing skills."],
  ["03", "AI improvements", "Use AI-powered tools to improve summaries, projects, keywords, and the full resume."],
];

export default function Home() {
  const navigate = useNavigate();
  const { hasResume, atsScore } = useResume();

  return (
    <div className="page-enter">
      <section className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8 lg:py-16 xl:gap-14">
        <div className="max-w-2xl">
          <p className="eyebrow">ATS Resume Analyzer</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[4.4rem]">
            Make your resume easier to understand.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            For ATS systems and recruiters. Upload once, understand what is working,
            and improve the content without inventing experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="btn-primary w-full sm:w-auto"
              onClick={() => navigate(hasResume ? "/analysis/ats" : "/upload")}
            >
              {hasResume ? "Continue analysis" : "Analyze my resume"}
            </button>
            <button
              className="btn-secondary w-full sm:w-auto"
              onClick={() => navigate("/analysis/match")}
            >
              Explore JD matching
            </button>
          </div>
        </div>

        <div className="doodle-frame min-h-[360px] p-5 sm:min-h-[440px] lg:min-h-[500px]">
          <img
            src={homeDoodle}
            alt="A person checking and organizing resume information"
            className="doodle-float relative z-10 h-auto w-full max-w-[540px] object-contain mix-blend-multiply"
          />
        </div>
      </section>

      <section className="grid gap-5 border-t border-slate-200/80 py-10 md:grid-cols-3 lg:py-14">
        {features.map(([number, title, text]) => (
          <article
            key={number}
            className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-250 hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm"
          >
            <p className="text-xs font-bold tracking-[0.12em] text-slate-400">{number}</p>
            <h2 className="mt-5 text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>

      <section className="mb-8 grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow">Current session</p>
          {hasResume ? (
            <>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                {atsScore?.percentage ?? 0}%
              </p>
              <p className="mt-1 text-sm text-slate-500">Current ATS score</p>
            </>
          ) : (
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Upload a PDF or DOCX and get your first explainable ATS analysis.
            </p>
          )}
        </div>
        <button
          className="btn-secondary w-full lg:w-auto"
          onClick={() => navigate(hasResume ? "/analysis/ats" : "/upload")}
        >
          {hasResume ? "Open dashboard" : "Start with a resume"}
        </button>
      </section>
    </div>
  );
}
