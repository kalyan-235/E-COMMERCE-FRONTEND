import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load home data");
      }
    })();
  }, []);

  const productsByCategory = useMemo(() => {
    const map = {};
    for (const p of products) {
      const cid = p.category?._id || "unknown";
      if (!map[cid]) map[cid] = [];
      map[cid].push(p);
    }
    return map;
  }, [products]);

  return (
    <div style={{ padding: 20 }}>
      <h2 className="pageTitle">Home</h2>
      <p className="subText">Browse categories and shop the best deals.</p>

      <div style={{ marginTop: 10 }}>
        <Link to="/products" style={{ fontWeight: 800 }}>
          View All Products →
        </Link>
      </div>
      <h3 style={{ marginTop: 20 }}>Shop by Category</h3>

      {categories.length === 0 ? (
        <p>No categories yet</p>
      ) : (
        <div className="grid" style={{ marginTop: 10 }}>
          {categories.map((c) => (
            <div
              key={c._id}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/products?category=${c._id}`)}
            >
              <img
                src={c.image || "https://via.placeholder.com/300x200?text=Category"}
                alt={c.name}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=Category";
                }}
              />
              <h3 className="cardTitle">{c.name}</h3>
              <p className="cardText">Tap to view products</p>
            </div>
          ))}
        </div>
      )}
      {categories.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <h3>Top Products</h3>
          <p className="subText" style={{ marginTop: 6 }}>
            Quick picks from each category.
          </p>

          {categories.map((c) => {
            const list = (productsByCategory[c._id] || []).slice(0, 4);
            if (list.length === 0) return null;

            return (
              <div key={c._id} style={{ marginTop: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <h4 style={{ margin: 0 }}>{c.name}</h4>
                  <button
                    className="btn btnSmall btnGhost"
                    onClick={() => navigate(`/products?category=${c._id}`)}
                  >
                    View all →
                  </button>
                </div>

                <div className="grid">
                  {list.map((p) => (
                    <div 
                      className="card clickableCard" 
                      key={p._id}
                      onClick={() => navigate(`/products/${p._id}`)}
                    >
                      <img
                        src={p.image || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 10,
                          marginBottom: 10,
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />

                      <h3 className="cardTitle">{p.name}</h3>
                      <p className="cardDescription">
                        {p.description || 'No description available for this product.'}
                      </p>
                      <div className="row">
                        <span className="price">₹{p.price}</span>
                        <span className="pill">Stock: {p.stock}</span>
                      </div>

                      <div className="row" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btnSmall"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${p._id}`);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn btnSmall btnGhost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cart/${p._id}`);
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}