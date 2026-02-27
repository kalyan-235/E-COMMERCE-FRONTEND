import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login success");
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="pageTitle">Login</h2>
      <p className="subText">Access your account to continue shopping.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <div className="label">Email</div>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formRow">
          <div className="label">Password</div>
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <div style={{ marginTop: 12 }}>
          <span className="subText">New here? </span>
          <Link to="/register" style={{ color: "var(--text)", fontWeight: 800 }}>
            Create account →
          </Link>
        </div>
      </form>
    </div>
  );
}