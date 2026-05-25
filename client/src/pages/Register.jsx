import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      login(res.data);
      navigate("/chat");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">D</div>
        <h1>Create your account</h1>
        <p className="auth-copy">Pick a username, join a channel, and start chatting in real time.</p>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleRegister}>
          <label>
            Username
            <input
              autoComplete="username"
              maxLength="24"
              minLength="3"
              required
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>

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
              autoComplete="new-password"
              minLength="6"
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
