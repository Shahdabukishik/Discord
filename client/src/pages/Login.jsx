import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">D</div>
        <h1>Welcome back</h1>
        <p className="auth-copy">Log in to rejoin your channels and keep the chat moving.</p>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              autoComplete="email"
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              minLength="6"
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
