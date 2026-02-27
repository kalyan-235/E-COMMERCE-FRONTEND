import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryIdFromUrl = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryIdFromUrl);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("latest");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryIdFromUrl);
  }, [categoryIdFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `/products?category=${selectedCategory}`
          : "/products";

        const { data } = await api.get(url);
        setProducts(data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const finalList = useMemo(() => {
    let list = [...products];

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query)
      );
    }

    if (sort === "low") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") list.sort((a, b) => (b.price || 0) - (a.price || 0));

    return list;
  }, [products, q, sort]);

  const onChangeCategory = (val) => {
    if (!val) {
      setSearchParams({});
      setSelectedCategory("");
    } else {
      setSearchParams({ category: val });
      setSelectedCategory(val);
    }
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <h2 style={{ marginRight: "auto" }}>Products</h2>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <select
          className="input"
          value={selectedCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          style={{ width: 240, marginTop: 0 }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 260, marginTop: 0 }}
        />

        <select
          className="input"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ width: 200, marginTop: 0 }}
        >
          <option value="latest">Sort: Latest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

        {selectedCategory && (
          <button className="btn btnSmall btnGhost" onClick={() => onChangeCategory("")}>
            Clear
          </button>
        )}
      </div>

      <hr />

      {finalList.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid">
          {finalList.map((p) => (
            <div className="card" key={p._id}>
              <img
                src={p.image || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: 10,
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              <h3 className="cardTitle">{p.name}</h3>
              <div style={{ marginBottom: 8 }}>
                <span className="pill">{p.category?.name || "Category"}</span>
              </div>

              <p className="cardText">{p.description}</p>

              <div className="row">
                <span className="price">₹{p.price}</span>
                <span className="pill">Stock: {p.stock}</span>
              </div>

              <div className="row">
                <button className="btn btnSmall" onClick={() => navigate(`/products/${p._id}`)}>
                  View
                </button>
                <button className="btn btnSmall btnGhost" onClick={() => navigate(`/cart/${p._id}`)}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}