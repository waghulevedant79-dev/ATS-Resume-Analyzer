import { apiRequest } from "./client";

export function analyzeResume(resumeId, jobDescription) {
  return apiRequest("/ai/analyze", {
    method: "POST",
    body: JSON.stringify({
      resume_id: resumeId,
      job_description: jobDescription
    })
  });
}

export function generateProfessionalSummary(resumeId) {
  return apiRequest("/ai/professional-summary", {
    method: "POST",
    body: JSON.stringify({ resume_id: resumeId })
  });
}

export function enhanceProject(resumeId, projectIndex) {
  return apiRequest("/ai/enhance-project", {
    method: "POST",
    body: JSON.stringify({
      resume_id: resumeId,
      project_index: projectIndex
    })
  });
}

export function explainMissingKeywords(resumeId, jobDescription) {
  return apiRequest("/ai/explain-missing-keywords", {
    method: "POST",
    body: JSON.stringify({
      resume_id: resumeId,
      job_description: jobDescription
    })
  });
}

export function rewriteResume(resumeId) {
  return apiRequest("/ai/rewrite-resume", {
    method: "POST",
    body: JSON.stringify({ resume_id: resumeId })
  });
}

export async function getDeepAIUsage() {
  return apiRequest("/ai/usage", {
    method: "GET",
  });
}