import { apiFetch } from "./client";

export function signup(payload) {
  return apiFetch("/auth/signup", { method: "POST", body: payload });
}

export function login(payload) {
  return apiFetch("/auth/login", { method: "POST", body: payload });
}

export function me() {
  return apiFetch("/auth/me", { auth: true });
}

