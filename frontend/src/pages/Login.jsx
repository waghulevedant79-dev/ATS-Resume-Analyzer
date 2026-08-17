import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { claimResume } from "../api/resume";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import signInDoodle from "../assets/doodles/signin-workspace.png";
import ErrorMessage from "../components/common/ErrorMessage";
import SuccessMessage from "../components/common/SuccessMessage";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const { resumeId } = useResume();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const [success, setSuccess] = useState(
    location.state?.registered
      ? "Account created successfully. Please sign in."
      : ""
  );
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await login(form);
      if (resumeId) await claimResume(resumeId);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await loginWithGoogle(credential);
      if (resumeId) await claimResume(resumeId);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in with Google. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] bg-[#f7f7f5] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft lg:grid-cols-[1fr_0.92fr]">
          <div className="auth-illustration-enter order-1 flex min-h-[300px] items-center justify-center bg-[#f3f6f0] p-7 sm:min-h-[380px] lg:order-1 lg:min-h-[680px] lg:p-10">
            <img
              src={signInDoodle}
              alt="Minimal workspace with a laptop displaying a resume"
              className="auth-doodle w-full max-w-[560px] object-contain"
            />
          </div>

          <div className="auth-form-enter order-2 flex items-center p-6 sm:p-10 lg:p-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                  A
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950">ATS Resume Analyzer</p>
                  <p className="text-xs text-slate-500">Resume intelligence, without the noise.</p>
                </div>
              </div>

              <p className="eyebrow">Welcome back</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Sign in to continue.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Return to your resume workspace and pick up where you left off.
              </p>

              <div className="mt-6 space-y-3">
                <ErrorMessage
                  message={error}
                  onClose={() => setError("")}
                  variant="inline"
                />

                {success && (
                  <SuccessMessage
                    onClose={() => setSuccess("")}
                    variant="inline"
                  >
                    {success}
                  </SuccessMessage>
                )}
              </div>

              <div className="mt-6">
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  disabled={submitting}
                />
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="input mt-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  </div>
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={form.password} onChange={handleChange} placeholder="Enter your password" className="input mt-2" />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link to="/register" state={{ from: redirectTo }} className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
