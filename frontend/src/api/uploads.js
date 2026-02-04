import { apiFetch } from "./client";

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append("file", file);

  return apiFetch("/uploads/avatar", {
    method: "POST",
    body: form,
    auth: true,
  });
}
