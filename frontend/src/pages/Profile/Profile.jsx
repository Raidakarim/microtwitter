import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, getUserPosts } from "../../api/users";
import { getFollowers, getFollowing, follow, unfollow } from "../../api/follows";
import styles from "./Profile.module.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile({ me, logout }) {
  const { id } = useParams();
  const isMe = useMemo(() => me?.id === id, [me, id]);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function load() {
    setError("");
    try {
      setLoading(true);

      const [u, p, fol, fing, myFollowing] = await Promise.all([
        getUser(id),
        getUserPosts(id),
        getFollowers(id),
        getFollowing(id),
        getFollowing(me.id),
      ]);

      setUser(u.user);
      setPosts(p.posts);
      setFollowers(fol.followers);
      setFollowing(fing.following);

      const myFollowingIds = new Set(myFollowing.following.map((x) => x.id));
      setIsFollowing(myFollowingIds.has(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onToggleFollow() {
    setError("");
    try {
      setToggling(true);
      if (isFollowing) {
        await unfollow(id);
        setIsFollowing(false);
      } else {
        await follow(id);
        setIsFollowing(true);
      }

      // refresh followers count
      const fol = await getFollowers(id);
      setFollowers(fol.followers);
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  }

  if (loading) return <div className={styles.container}>Loading profile...</div>;
  if (error)
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  if (!user) return <div className={styles.container}>User not found</div>;

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <div>
            <CardTitle className="text-3xl font-bold">@{user.username}</CardTitle>

            <div className={styles.stats}>
              <span>
                <b>{followers.length}</b> followers
              </span>
              <span>
                <b>{following.length}</b> following
              </span>
              <span>
                <b>{posts.length}</b> posts
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {!isMe && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={onToggleFollow}
                disabled={toggling}
              >
                {toggling ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className={styles.content}>
          <div className={styles.sectionRow}>
            <h2 className={`${styles.sectionTitle} font-bold`}>Posts</h2>

            <div className={styles.sectionActions}>
              <Link
                to="/explore"
                className="text-blue-600 hover:underline font-medium"
              >
                Explore
              </Link>

              <Button
                variant="outline"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>


          <div className={styles.feed}>
            {posts.map((p) => (
              <Card key={p.id}>
                <CardContent className="space-y-2 p-4">
                  <div className={styles.meta}>
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                  <div>{p.content}</div>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && <div className={styles.empty}>No posts yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}