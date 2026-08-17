import backgroundImage from "../assets/doodles/professional-presence-bg.png";

const platforms = [
    {
        number: "01",
        title: "LinkedIn",
        description:
            "Profile strength, positioning, and resume consistency.",
    },
    {
        number: "02",
        title: "GitHub",
        description:
            "Projects, repositories, technical evidence, and presentation.",
    },
    {
        number: "03",
        title: "Portfolio",
        description:
            "Projects, experience, identity, and professional presentation.",
    },
];

export default function ProfessionalPresence() {
    return (
        <section className="-mx-4 -my-6 min-h-[calc(100vh-72px)] overflow-hidden bg-[#f7f7f5] sm:-mx-5 sm:-my-8 lg:-mx-8 lg:-my-10">
            <div className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
                {/* =====================================================
                    BACKGROUND ARCHITECTURAL IMAGE
                ====================================================== */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10"
                >
                    <img
                        src={backgroundImage}
                        alt=""
                        className="absolute bottom-0 left-0 w-full h-auto object-center opacity-[0.65]"
                    />

                    {/* Soft wash over the illustration */}
                    <div className="absolute inset-0 bg-[#f7f7f5]/65" />

                    {/* Fade the lower portion into the page */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#f7f7f5] via-[#f7f7f5]/80 to-transparent" />

                    {/* Keep the center readable */}
                    <div className="absolute inset-0 bg-white/10" />
                </div>

                {/* =====================================================
                    HERO
                ====================================================== */}
                <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <div className="mx-auto w-full max-w-4xl text-center">

                        {/* Eyebrow */}
                        <div className="mb-7 flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-slate-300" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                                Coming Soon
                            </p>

                            <span className="h-px w-8 bg-slate-300" />
                        </div>

                        {/* Main heading */}
                        <h1 className="mx-auto max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950">
                            Professional
                            <br />
                            <span className="font-normal text-slate-500">
                                Presence Analyzer
                            </span>
                        </h1>

                        {/* Supporting copy */}
                        <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Your resume is only part of your professional story.
                            We&apos;re building a smarter way to understand and
                            strengthen your presence across the platforms that
                            represent your work.
                        </p>

                        {/* Platform line */}
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            <span>LinkedIn</span>
                            <span className="text-slate-300">•</span>
                            <span>GitHub</span>
                            <span className="text-slate-300">•</span>
                            <span>Portfolio</span>
                        </div>

                        {/* Status */}
                        <div className="mt-9 inline-flex self-center items-center gap-2 rounded-full border border-amber-200/70 bg-white/85 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_2px_12px_rgba(245,158,11,0.08)] backdrop-blur-sm">
                            <span
                                aria-hidden="true"
                                className="construction-light h-2 w-2 rounded-full bg-amber-500"
                            />

                            <span>
                                We&apos;re working on it
                            </span>
                        </div>
                    </div>

                    {/* ===================================================
                        PLATFORM PREVIEW
                    ==================================================== */}
                    <div className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
                        <div className="grid border-y border-slate-300/70 bg-white/35 backdrop-blur-[2px] sm:grid-cols-3">
                            {platforms.map((platform, index) => (
                                <div
                                    key={platform.title}
                                    className={[
                                        "px-5 py-6 sm:px-7 sm:py-7",
                                        index !== platforms.length - 1
                                            ? "border-b border-slate-300/70 sm:border-b-0 sm:border-r"
                                            : "",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400">
                                            {platform.number}
                                        </span>

                                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                                            Soon
                                        </span>
                                    </div>

                                    <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-slate-950">
                                        {platform.title}
                                    </h2>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {platform.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===================================================
                        FOOTER NOTE
                    ==================================================== */}
                    <p className="mt-8 text-center text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        A new layer of professional intelligence
                    </p>
                </div>
            </div>
        </section>
    );
}