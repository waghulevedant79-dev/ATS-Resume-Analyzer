import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ResumeProvider } from "./context/ResumeContext";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ResumeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ResumeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
