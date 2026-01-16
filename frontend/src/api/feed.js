import { apiFetch } from "./client";

export function getFeed({ take = 20, skip = 0 } = {}) {
  return apiFetch(`/feed?take=${take}&skip=${skip}`, { auth: true });
}

