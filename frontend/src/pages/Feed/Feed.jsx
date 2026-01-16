import { useEffect, useState } from "react";
import { createPost } from "../../api/posts";
import { getFeed } from "../../api/feed";
import styles from "./Feed.module.css";
import { Link } from "react-router-dom";

export default function Feed({ user, logout }) {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    try {
      setLoading(true);
      const data = await getFeed();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    try {
      await createPost(content);
      setContent("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          Logged in as <b>@{user.username}</b>
        </div>

        <div className={styles.actions}>
          <Link to="/explore">Explore</Link>  
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <form onSubmit={onCreate} className={styles.composer}>
        <textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button type="submit">Post</button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div>Loading feed...</div>
      ) : (
        <div className={styles.feed}>
          {posts.map((p) => (
            <div key={p.id} className={styles.post}>
              <div className={styles.meta}>
                <b>@{p.author.username}</b> · {new Date(p.createdAt).toLocaleString()}
              </div>
              <div>{p.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

