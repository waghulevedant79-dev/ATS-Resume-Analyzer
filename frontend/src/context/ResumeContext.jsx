import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ResumeContext = createContext(null);
const STORAGE_KEY = "ats-resume-session";

function loadSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function ResumeProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const startSession = (uploadResponse) => {
    setSession({
      resumeId: uploadResponse.resume_id,
      parsedResume: uploadResponse.parsed_resume,
      atsScore: uploadResponse.ats_score
    });
  };

  const clearSession = () => setSession(null);

const value = useMemo(
  () => ({
    session,
    resumeId: session?.resumeId ?? null,
    parsedResume: session?.parsedResume ?? null,
    atsScore: session?.atsScore ?? null,
    hasResume: Boolean(session?.resumeId),

    candidateName: session?.parsedResume?.name ?? null,

    startSession,
    clearSession
  }),
  [session]
);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error("useResume must be used inside ResumeProvider.");
  }

  return context;
}
