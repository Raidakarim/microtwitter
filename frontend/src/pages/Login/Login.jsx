import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth";
import styles from "./Login.module.css";

export default function Login({ setUser }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      nav("/feed");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div className={styles.error}>{error}</div>}
        <button type="submit">Login</button>
      </form>

      <p className={styles.linkRow}>
        No account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

