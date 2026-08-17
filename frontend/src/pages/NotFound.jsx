import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  function handleGoBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <main
      className="
        relative
        isolate
        flex
        min-h-[calc(100vh-140px)]
        items-center
        justify-center
        overflow-hidden
        px-5
        py-16
        sm:px-8
        sm:py-20
        lg:px-12
        lg:py-24
      "
    >
      {/* Large editorial 404 watermark */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          flex
          select-none
          items-center
          justify-center
          overflow-hidden
        "
      >
        <span
          className="
            not-found-watermark
            block
            text-[clamp(15rem,55vw,32rem)]
            font-bold
            leading-none
            tracking-[-0.08em]
          "
        >
          404
        </span>
      </div>

      {/* Subtle editorial vertical line */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-1/2
          hidden
          w-px
          -translate-x-1/2
          bg-slate-200/40
          lg:block
        "
      />

      {/* Content */}
      <section
        className="
          relative
          z-10
          w-full
          max-w-3xl
          text-center
        "
      >
        <div className="not-found-content">
          {/* Small editorial label */}
          <p className="eyebrow">
            Error 404
          </p>

          {/* Heading */}
          <h1
            className="
              mt-4
              text-4xl
              font-semibold
              leading-[1.05]
              tracking-[-0.04em]
              text-slate-950
              sm:mt-5
              sm:text-6xl
              lg:text-7xl
          "
          >
            Page not found
          </h1>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              px-2
              text-sm
              leading-7
              text-slate-500
              sm:px-0
              sm:text-base
            "
          >
            The page you're looking for doesn't exist or may have
            been moved. Let's get you back to your resume analysis.
          </p>

          {/* Actions */}
          <div
            className="
              mt-8
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:mt-9
              sm:flex-row
            "
          >
            <Link
              to="/"
              className="
                btn-primary
                w-full
                min-w-0
                sm:w-auto
                sm:min-w-[150px]
              "
            >
              Back to overview
            </Link>

            <button
              type="button"
              onClick={handleGoBack}
              className="
                btn-secondary
                w-full
                min-w-0
                sm:w-auto
                sm:min-w-[150px]
              "
            >
              Go back
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}