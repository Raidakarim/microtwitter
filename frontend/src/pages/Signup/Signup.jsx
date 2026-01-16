import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";
import styles from "./Signup.module.css";

export default function Signup({ setUser }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await signup({ email, username, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      nav("/feed");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Signup</h1>

      <form onSubmit={onSubmit} className={styles.form}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div className={styles.error}>{error}</div>}
        <button type="submit">Create account</button>
      </form>

      <p className={styles.linkRow}>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
