import { apiFetch } from "./client";

export function createPost(content) {
  return apiFetch("/posts", { method: "POST", auth: true, body: { content } });
}

