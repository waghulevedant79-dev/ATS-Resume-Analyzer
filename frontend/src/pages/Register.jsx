import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { claimResume } from "../api/resume";
import { useResume } from "../context/ResumeContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import signUpDoodle from "../assets/doodles/signup-growth.png";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle } = useAuth();
  const { resumeId } = useResume();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/login", {
        replace: true,
        state: { registered: true, from: location.state?.from || "/" },
      });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    setSubmitting(true);
    try {
      await loginWithGoogle(credential);
      if (resumeId) await claimResume(resumeId);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account with Google.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-2rem)] bg-[#f7f7f5] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft lg:grid-cols-[0.92fr_1fr]">
          <div className="auth-form-enter order-2 flex items-center p-6 sm:p-10 lg:order-1 lg:p-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">A</span>
                <div>
                  <p className="text-sm font-bold text-slate-950">ATS Resume Analyzer</p>
                  <p className="text-xs text-slate-500">Resume intelligence, without the noise.</p>
                </div>
              </div>

              <p className="eyebrow">Get started</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Create your account.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Start analyzing your resume and turn clear feedback into your next improvement.
              </p>

              <ErrorMessage
                message={error}
                onClose={() => setError("")}
                variant="inline"
              />

              <div className="mt-7">
                <GoogleSignInButton onCredential={handleGoogleCredential} disabled={submitting} />
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Your name" className="input mt-2" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="input mt-2" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={handleChange} placeholder="At least 8 characters" className="input mt-2" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" className="input mt-2" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                  {submitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" state={{ from: location.state?.from || "/" }} className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900">Sign in</Link>
              </p>
            </div>
          </div>

          <div className="auth-illustration-enter order-1 flex min-h-[300px] items-center justify-center bg-[#f3f6f0] p-7 sm:min-h-[380px] lg:order-2 lg:min-h-[680px] lg:p-10">
            <img src={signUpDoodle} alt="Person moving upward toward a career goal" className="auth-doodle doodle-float relative z-10 w-full max-w-[560px] object-contain" />
          </div>
        </section>
      </div>
    </main>
  );
}
