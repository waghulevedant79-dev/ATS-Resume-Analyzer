import { useNavigate } from "react-router-dom";
import ATSLogo from "../logo/ATSLogo";

const productLinks = [
  { label: "ATS analysis", path: "/analysis/ats" },
  { label: "JD matching", path: "/analysis/match" },
  { label: "AI tools", path: "/analysis/ai" },
  { label: "Professional presence", path: "/professional-presence" },
];

const resourceLinks = [
  { label: "Analyze a resume", path: "/upload" },
  { label: "Resume overview", path: "/analysis/resume" },
  { label: "Start new analysis", path: "/upload" },
];

const projectLinks = [
  { label: "Home", path: "/" },
  { label: "Professional presence", path: "/professional-presence" },
  { label: "New analysis", path: "/upload" },
];

function FooterLink({ label, path, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(path)}
      className="block text-left text-[12px] leading-6 text-slate-500 transition-colors duration-200 hover:text-slate-950"
    >
      {label}
    </button>
  );
}

function FooterColumn({ title, links, onNavigate }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
        {title}
      </p>

      <div className="mt-2.5 space-y-0.5">
        {links.map((link) => (
          <FooterLink
            key={`${title}-${link.label}`}
            {...link}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const navigate = useNavigate();

  function navigateTo(path) {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative px-4 pb-6 pt-8 sm:px-5 sm:pt-10 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* CTA */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-11 text-center shadow-soft sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-44 w-72 -translate-x-1/2 rounded-full bg-white/[0.08] blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              ATS Resume Analyzer
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
              Turn your resume into clarity.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Understand what is working, see where your resume can improve,
              and make stronger decisions before you apply.
            </p>

            <button
              type="button"
              onClick={() => navigateTo("/upload")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm active:translate-y-0"
            >
              Analyze my resume
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
              >
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Footer card — deliberately separated from the CTA */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#fbfbf9] shadow-soft">
          <div className="relative z-10 grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.6fr_repeat(3,1fr)] lg:gap-10 lg:px-10 lg:py-9">
            <div className="max-w-sm">
              <button
                type="button"
                onClick={() => navigateTo("/")}
                className="group inline-flex items-center gap-2.5 text-left"
              >
                <ATSLogo
                  size={30}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                />

                <span className="text-sm font-bold tracking-[-0.02em] text-slate-950">
                  ATS Resume Analyzer
                </span>
              </button>

              <p className="mt-3 max-w-xs text-[12px] leading-5 text-slate-500">
                A practical resume workspace for ATS analysis, job matching,
                and grounded AI improvements.
              </p>
            </div>

            <FooterColumn
              title="Product"
              links={productLinks}
              onNavigate={navigateTo}
            />

            <FooterColumn
              title="Resources"
              links={resourceLinks}
              onNavigate={navigateTo}
            />

            <FooterColumn
              title="Project"
              links={projectLinks}
              onNavigate={navigateTo}
            />
          </div>

          <div className="relative z-10 mx-6 border-t border-slate-100 sm:mx-8 lg:mx-10">
            <div className="flex flex-col gap-2 py-3.5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} ATS Resume Analyzer. All rights reserved.</p>
              <p>Built for better applications.</p>
            </div>
          </div>

          {/* Subtle brand watermark — kept behind the footer content */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[3.5rem] font-bold leading-none tracking-[-0.08em] text-slate-900/[0.045] sm:text-[4.5rem] lg:text-[6rem]"
          >
            ATS Resume Analyzer
          </div>
        </section>
      </div>
    </footer>
  );
}