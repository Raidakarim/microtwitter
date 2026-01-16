import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getUserPosts } from "../../api/users";
import { getFollowers, getFollowing, follow, unfollow } from "../../api/follows";
import styles from "./Profile.module.css";

export default function Profile({ me }) {
  const { id } = useParams(); // profile user id
  const isMe = useMemo(() => me?.id === id, [me, id]);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);

  async function load() {
    setError("");
    try {
      setLoading(true);

      const [u, p, fol, fing, myFollowing] = await Promise.all([
        getUser(id),
        getUserPosts(id),
        getFollowers(id),
        getFollowing(id),
        getFollowing(me.id), // who I follow
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
      if (isFollowing) {
        await unfollow(id);
        setIsFollowing(false);
        // refresh follower list count quickly
        const fol = await getFollowers(id);
        setFollowers(fol.followers);
      } else {
        await follow(id);
        setIsFollowing(true);
        const fol = await getFollowers(id);
        setFollowers(fol.followers);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className={styles.container}>Loading profile...</div>;
  if (error) return <div className={styles.container}><div className={styles.error}>{error}</div></div>;
  if (!user) return <div className={styles.container}>User not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>@{user.username}</h2>
          <div className={styles.stats}>
            <span><b>{followers.length}</b> followers</span>
            <span><b>{following.length}</b> following</span>
            <span><b>{posts.length}</b> posts</span>
          </div>
        </div>

        {!isMe && (
          <button onClick={onToggleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <h3 className={styles.sectionTitle}>Posts</h3>
      <div className={styles.feed}>
        {posts.map((p) => (
          <div key={p.id} className={styles.post}>
            <div className={styles.meta}>
              {new Date(p.createdAt).toLocaleString()}
            </div>
            <div>{p.content}</div>
          </div>
        ))}
        {posts.length === 0 && <div>No posts yet.</div>}
      </div>
    </div>
  );
}

