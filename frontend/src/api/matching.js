import { apiRequest } from "./client";

export function matchResume(resumeId, jobDescription) {
  return apiRequest("/matching/match", {
    method: "POST",
    body: JSON.stringify({
      resume_id: resumeId,
      job_description: jobDescription
    })
  });
}
