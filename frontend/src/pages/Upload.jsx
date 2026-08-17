import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../api/resume";
import { useResume } from "../context/ResumeContext";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingButton from "../components/common/LoadingButton";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

export default function Upload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { startSession } = useResume();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  function chooseFile(nextFile) {
    setError("");

    if (!nextFile) return;

    const extension = nextFile.name
      .slice(nextFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFile(null);
      setError("Please choose a PDF or DOCX resume.");
      return;
    }

    if (nextFile.size > MAX_SIZE) {
      setFile(null);
      setError("The backend accepts files up to 10 MB.");
      return;
    }

    setFile(nextFile);
  }

  function handleFileChange(event) {
    chooseFile(event.target.files?.[0]);

    // Allows selecting the same file again after removing/rejecting it.
    event.target.value = "";
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);

    chooseFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    setFile(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Select a resume before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await uploadResume(file);

      startSession(response);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message ||
        "We couldn't analyze your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <section className="mb-8">
        <p className="eyebrow">Resume analysis</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Analyze your resume
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Upload your resume and we'll extract the important information,
          calculate your ATS score, and prepare your analysis.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
        {/* Upload area */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed px-6 py-12 text-center transition sm:px-10 ${dragging
            ? "border-slate-900 bg-slate-100"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
        >
          {!file ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-900 shadow-sm">
                ↑
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-950">
                Drop your resume here
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                or choose a file from your computer
              </p>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn-secondary mt-5"
              >
                Choose file
              </button>

              <p className="mt-4 text-xs text-slate-400">
                PDF or DOCX · Maximum 10 MB
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                ✓
              </div>

              <p className="mt-5 text-base font-bold text-slate-950">
                Resume selected
              </p>

              <p className="mx-auto mt-2 w-full max-w-md truncate text-sm text-slate-500">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <button
                type="button"
                onClick={removeFile}
                className="btn-secondary mt-5"
              >
                Choose another file
              </button>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />

        <ErrorMessage
          message={error}
          onClose={() => setError("")}
          variant="inline"
        />

        {/* Information */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Supported
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              PDF & DOCX
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              File size
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              Up to 10 MB
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Analysis
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              ATS score included
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>

          <LoadingButton loading={loading}
            className="w-full sm:w-auto">
            {loading ? "Analyzing resume..." : "Upload & analyze"}
          </LoadingButton>
        </div>

        {loading && (
          <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center">
            <p className="text-sm font-medium text-slate-700">
              We're processing your resume...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This may take a moment.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}