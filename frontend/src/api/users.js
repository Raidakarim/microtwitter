import { apiFetch } from "./client";

export function listUsers(search = "") {
  const q = encodeURIComponent(search);
  return apiFetch(`/users?search=${q}`);
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function getUserPosts(id) {
  return apiFetch(`/users/${id}/posts`);
}
