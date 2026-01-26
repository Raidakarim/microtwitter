import { useEffect, useMemo, useState } from "react";
import { listUsers } from "../../api/users";
import { follow, unfollow, getFollowing } from "../../api/follows";
import styles from "./Explore.module.css";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Explore({ me, logout }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const meId = useMemo(() => me?.id, [me]);

  async function load() {
    setError("");
    try {
      setLoading(true);
      const [u, f] = await Promise.all([listUsers(search), getFollowing(meId)]);
      setUsers(u.users);
      setFollowingIds(new Set(f.following.map((x) => x.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <div>
            <CardTitle className="text-3xl font-bold">Explore</CardTitle>
          </div>

          <div className={styles.headerActions}>
            <Link
              to="/feed"
              className="text-blue-600 hover:underline font-medium"
            >
              Feed
            </Link>

            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className={styles.content}>
          <div className={styles.searchRow}>
            <Input
              value={search}
              placeholder="Search users..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={load} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.list}>
            {users.map((u) => (
              <Card key={u.id} className={styles.userRow}>
                <CardContent className={styles.userRowContent}>
                  <Link
                    to={`/users/${u.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    @{u.username}
                  </Link>

                  <Button
                    variant={followingIds.has(u.id) ? "outline" : "default"}
                    onClick={() => onToggle(u.id)}
                  >
                    {followingIds.has(u.id) ? "Unfollow" : "Follow"}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {users.length === 0 && !loading && (
              <div className={styles.empty}>No users found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}