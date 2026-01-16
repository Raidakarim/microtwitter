import { apiFetch } from "./client";

export function follow(userId) {
  return apiFetch(`/follows/${userId}`, {
    method: "POST",
    auth: true,
  });
}

export function unfollow(userId) {
  return apiFetch(`/follows/${userId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getFollowing(userId) {
  return apiFetch(`/users/${userId}/following`);
}

export function getFollowers(userId) {
  return apiFetch(`/users/${userId}/followers`);
}

