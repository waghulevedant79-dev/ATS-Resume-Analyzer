import { apiRequest } from "./client";

export function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/resumes/upload", {
    method: "POST",
    body: formData,
  });
}

export function claimResume(resumeId) {
  return apiRequest(`/resumes/${resumeId}/claim`, {
    method: "POST",
  });
}