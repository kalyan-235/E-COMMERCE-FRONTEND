import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      alert("Registered successfully Please login");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="pageTitle">Register</h2>
      <p className="subText">Create your account in seconds.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <div className="label">Full Name</div>
          <input
            className="input"
            name="name"
            type="text"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

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
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div style={{ marginTop: 12 }}>
          <span className="subText">Already have an account? </span>
          <Link to="/login" style={{ color: "var(--text)", fontWeight: 800 }}>
            Login →
          </Link>
        </div>
      </form>
    </div>
  );
}