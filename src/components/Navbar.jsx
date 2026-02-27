import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navInner">
        <Link className="brand" to="/">
          E-COMMERCE
        </Link>

        <button 
          className="hamburger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navLinks ${isMenuOpen ? 'navLinksOpen' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>

          {token && <Link to="/my-orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link>}
          {token && <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart 🛒</Link>}

          {/* ADMIN LINKS */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/products" onClick={() => setIsMenuOpen(false)}>Admin Products</Link>
              <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>Admin Orders</Link>
              <Link to="/admin/categories" onClick={() => setIsMenuOpen(false)}>Admin Categories</Link>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>

        <div className="userBox">
          {user && <span className="pill">{user.name} ({user.role})</span>}
          {token && (
            <button className="btn btnSmall btnGhost" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}