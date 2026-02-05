import { apiFetch } from "./client";

export function createPost({ content, imageFile }) {
  const form = new FormData();
  form.append("content", content || "");
  if (imageFile) form.append("image", imageFile);

  return apiFetch("/posts", {
    method: "POST",
    body: form,
    auth: true,
  });
}