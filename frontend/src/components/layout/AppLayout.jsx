import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useResume } from "../../context/ResumeContext";
import ATSLogo from "../logo/ATSLogo";
import Footer from "./Footer";

const workspaceLinks = [
  {
    to: "/analysis/ats",
    label: "ATS",
  },
  {
    to: "/analysis/resume",
    label: "Resume",
  },
  {
    to: "/analysis/match",
    label: "JD Match",
  },
  {
    to: "/analysis/ai",
    label: "AI Tools",
  },
  {
    to: "/professional-presence",
    label: "Presence",
  },
];

function navLinkClass() {
  return [
    "relative inline-flex items-center rounded-lg px-2.5 py-2",
    "text-sm font-medium",
    "text-slate-500",
    "transition-all duration-200",
    "hover:bg-slate-100/70 hover:text-slate-950",
  ].join(" ");
}

function mobileNavLinkClass({ isActive }) {
  return [
    "flex items-center justify-between rounded-xl px-3 py-3",
    "text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-slate-100 text-slate-950"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
  ].join(" ");
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { hasResume, parsedResume, clearSession } = useResume();

  const [mobileOpen, setMobileOpen] = useState(false);

  /*
   * Shared desktop navigation underline.
   *
   * Instead of every NavLink owning its own underline,
   * one underline travels between the active links.
   */
  const navRef = useRef(null);
  const navLinkRefs = useRef([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const isAnalysisRoute =
    location.pathname.startsWith("/analysis");

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register";

  function navigateAndClose(path) {
    navigate(path);
    setMobileOpen(false);
  }

  function handleNewAnalysis() {
    const confirmed = window.confirm(
      "Start a new analysis? Your current resume session will be cleared."
    );

    if (!confirmed) return;

    clearSession();
    setMobileOpen(false);
    navigate("/upload");
  }

  const candidateName =
    parsedResume?.name || "Your Resume";

  /*
   * Update the shared underline position whenever
   * the route changes or the navigation layout changes.
   */
  useLayoutEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;

      if (!nav) return;

      const activeIndex =
        location.pathname === "/"
          ? 0
          : (() => {
            const index = workspaceLinks.findIndex((link) =>
              location.pathname.startsWith(link.to)
            );

            return index >= 0 ? index + 1 : -1;
          })();

      const activeLink =
        navLinkRefs.current[activeIndex];

      if (!activeLink) {
        setIndicator((current) => ({
          ...current,
          visible: false,
        }));

        return;
      }

      const navRect =
        nav.getBoundingClientRect();

      const linkRect =
        activeLink.getBoundingClientRect();

      setIndicator({
        left:
          linkRect.left -
          navRect.left +
          8,
        width:
          linkRect.width - 16,
        visible: true,
      });
    };

    updateIndicator();

    window.addEventListener(
      "resize",
      updateIndicator
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateIndicator
      );
    };
  }, [location.pathname]);

  /*
   * Run once after the navigation becomes available
   * and after fonts/layout have settled.
   */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nav = navRef.current;

      if (!nav) return;

      const activeIndex =
        location.pathname === "/"
          ? 0
          : workspaceLinks.findIndex((link) =>
            location.pathname.startsWith(link.to)
          ) + 1;

      const activeLink =
        navLinkRefs.current[activeIndex];

      if (!activeLink) return;

      const navRect =
        nav.getBoundingClientRect();

      const linkRect =
        activeLink.getBoundingClientRect();

      setIndicator({
        left:
          linkRect.left -
          navRect.left +
          8,
        width:
          linkRect.width - 16,
        visible: true,
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl">

        {/* =========================================================
            MAIN NAVIGATION
        ========================================================== */}
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="flex min-h-[72px] items-center justify-between gap-4">

            {/* Brand */}
            <button
              type="button"
              onClick={() =>
                navigateAndClose("/")
              }
              className="group flex min-w-0 items-center gap-3 text-left"
            >
              <ATSLogo
                size={40}
                className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
              />

              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold tracking-[-0.02em] text-slate-950 sm:text-sm">
                  ATS Resume Analyzer
                </span>

                <span className="hidden text-[10px] font-medium tracking-[0.01em] text-slate-500 sm:block">
                  Analyze. Improve. Advance.
                </span>
              </span>
            </button>

            {/* =====================================================
                DESKTOP NAVIGATION
            ====================================================== */}
            <nav
              ref={navRef}
              aria-label="Main navigation"
              className="relative hidden items-center gap-1.5 md:flex lg:gap-2"
            >
              <NavLink
                to="/"
                end
                className={navLinkClass}
                ref={(element) => {
                  navLinkRefs.current[0] =
                    element;
                }}
              >
                Overview
              </NavLink>

              {workspaceLinks.map(
                (link, index) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={navLinkClass}
                    ref={(element) => {
                      navLinkRefs.current[
                        index + 1
                      ] = element;
                    }}
                  >
                    {link.label}
                  </NavLink>
                )
              )}

              {/* Shared animated underline */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-slate-950 transition-[left,width] duration-300 ease-out"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.visible
                    ? 1
                    : 0,
                }}
              />
            </nav>

            {/* =====================================================
                DESKTOP ACTIONS
            ====================================================== */}
            <div className="hidden items-center gap-3 md:flex">

              <button
                type="button"
                className="btn-primary whitespace-nowrap"
                onClick={() =>
                  navigate(
                    hasResume
                      ? "/dashboard"
                      : "/upload"
                  )
                }
              >
                {hasResume
                  ? "Open analysis"
                  : "Analyze resume"}
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 active:translate-y-0"
                onClick={
                  handleNewAnalysis
                }
              >
                New analysis
              </button>
            </div>

            {/* =====================================================
                MOBILE MENU BUTTON
            ====================================================== */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:bg-slate-50 active:scale-95 md:hidden"
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={
                mobileOpen
              }
            >
              <span
                aria-hidden="true"
                className="text-xl leading-none"
              >
                {mobileOpen
                  ? "×"
                  : "☰"}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================
            MOBILE NAVIGATION
        ========================================================== */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5">

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                <NavLink
                  to="/"
                  end
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className={
                    mobileNavLinkClass
                  }
                >
                  Overview
                </NavLink>

                {workspaceLinks.map(
                  (link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={
                        mobileNavLinkClass
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* Mobile workspace context */}
              {hasResume &&
                isAnalysisRoute && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Current analysis
                    </p>

                    <p className="mt-1 truncate px-3 text-sm font-semibold text-slate-950">
                      {candidateName}
                    </p>
                  </div>
                )}

              {/* Mobile actions */}
              <div className="mt-4 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() =>
                    navigateAndClose(
                      hasResume
                        ? "/analysis/ats"
                        : "/upload"
                    )
                  }
                >
                  {hasResume
                    ? "Open analysis"
                    : "Analyze resume"}
                </button>

                <button
                  type="button"
                  className="btn-secondary mt-2 w-full"
                  onClick={
                    handleNewAnalysis
                  }
                >
                  New analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          CURRENT ANALYSIS CONTEXT
      ========================================================== */}
      {hasResume &&
        isAnalysisRoute && (
          <div className="border-b border-slate-200/70 bg-white/75">
            <div className="mx-auto flex min-h-[48px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-5 lg:px-8">

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:inline">
                  Current analysis
                </span>

                <span className="hidden h-3 w-px bg-slate-200 sm:block" />

                <span className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                  {candidateName}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleNewAnalysis
                }
                className="shrink-0 text-xs font-medium text-slate-500 transition-colors hover:text-slate-950"
              >
                New analysis
              </button>
            </div>
          </div>
        )}

      {/* =========================================================
          PAGE CONTENT
      ========================================================== */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
        <div
          key={location.pathname}
          className="page-enter"
        >
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}