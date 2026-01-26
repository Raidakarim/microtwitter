import { useEffect, useState } from "react";
import { createPost } from "../../api/posts";
import { getFeed } from "../../api/feed";
import styles from "./Feed.module.css";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

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
          <Link to="/explore" className="text-blue-600 hover:underline font-medium">Explore</Link>  
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
        </div>
      </header>

      <form onSubmit={onCreate} className={styles.composer}>
        <Textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none"
        />
        <Button type="submit">Post</Button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div>Loading feed...</div>
      ) : (
        <div className={styles.feed}>
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="space-y-2 p-4">
                <div className={styles.meta}>
                  <Link
                    to={`/users/${p.author.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    @{p.author.username}
                  </Link>
                  {" · "}
                  {new Date(p.createdAt).toLocaleString()}
                </div>

                <div>{p.content}</div>
	       </CardContent>
             </Card>
          ))}
        </div>
      )}
    </div>
  );
}

