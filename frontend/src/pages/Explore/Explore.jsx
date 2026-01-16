import { useEffect, useState } from "react";
import { listUsers } from "../../api/users";
import { follow, unfollow, getFollowing } from "../../api/follows";
import styles from "./Explore.module.css";
import { Link } from "react-router-dom";

export default function Explore({ me }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const [u, f] = await Promise.all([listUsers(search), getFollowing(me.id)]);
      setUsers(u.users);

      // f.following is an array of {id, username}
      setFollowingIds(new Set(f.following.map((x) => x.id)));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onToggle(userId) {
    setError("");
    try {
      if (followingIds.has(userId)) {
        await unfollow(userId);
        const next = new Set(followingIds);
        next.delete(userId);
        setFollowingIds(next);
      } else {
        await follow(userId);
        const next = new Set(followingIds);
        next.add(userId);
        setFollowingIds(next);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Explore</h2>

      <div className={styles.searchRow}>
        <input
          value={search}
          placeholder="Search users..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={load}>Search</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.list}>
        {users.map((u) => (
          <div key={u.id} className={styles.card}>
            <div>
              <Link to={`/users/${u.id}`}>@{u.username}</Link>
            </div>
            <button onClick={() => onToggle(u.id)}>
              {followingIds.has(u.id) ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
