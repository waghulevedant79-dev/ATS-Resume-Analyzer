import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Matching from "./pages/Matching";
import AI from "./pages/AI";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import ProfessionalPresence from "./pages/ProfessionalPresence";

import { useResume } from "./context/ResumeContext";

import Login from "./pages/Login";
import Register from "./pages/Register";


function RequireResume({ children }) {
  const { hasResume } = useResume();

  if (!hasResume) {
    return <Navigate to="/upload" replace />;
  }

  return children;
}


export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* =========================
            CORE PRODUCT — FREE
        ========================== */}

        <Route path="/" element={<Home />} />

        <Route path="/upload" element={<Upload />} />

        <Route
          path="/professional-presence"
          element={<ProfessionalPresence />}
        />


        {/* Analysis Workspace */}

        <Route
          path="/analysis"
          element={
            <RequireResume>
              <Navigate to="/analysis/ats" replace />
            </RequireResume>
          }
        />

        <Route
          path="/analysis/ats"
          element={
            <RequireResume>
              <Dashboard />
            </RequireResume>
          }
        />

        <Route
          path="/analysis/resume"
          element={
            <RequireResume>
              <Resume />
            </RequireResume>
          }
        />

        <Route
          path="/analysis/match"
          element={
            <RequireResume>
              <Matching />
            </RequireResume>
          }
        />

        {/* AI page itself remains accessible.
            Quick AI is free.
            Deep AI will handle authentication
            at the feature level. */}

        <Route
          path="/analysis/ai"
          element={
            <RequireResume>
              <AI />
            </RequireResume>
          }
        />


        {/* =========================
            BACKWARD-COMPATIBLE ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={<Navigate to="/analysis/ats" replace />}
        />

        <Route
          path="/matching"
          element={<Navigate to="/analysis/match" replace />}
        />

        <Route
          path="/ai"
          element={<Navigate to="/analysis/ai" replace />}
        />


        {/* =========================
            AUTHENTICATION
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            FALLBACK
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>
    </Routes>
  );
}