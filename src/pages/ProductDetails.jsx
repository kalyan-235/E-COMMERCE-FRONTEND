// frontend/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { addToCart } from "../utils/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (!mounted) return;
        setProduct(res.data);
        setQty(1);
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Failed to load product")
      );

    return () => (mounted = false);
  }, [id]);

  const clampQty = (val) => {
    if (!product) return 1;
    return Math.max(1, Math.min(Number(val), product.stock));
  };

  if (!product) return <p style={{ padding: 10 }}>Loading...</p>;

  const outOfStock = product.stock <= 0;

  return (
    <div>
      <button
        className="btn btnSmall btnGhost"
        onClick={() => navigate("/products")}
      >
        ← Back
      </button>

      <h2 className="pageTitle" style={{ marginTop: 12 }}>
        {product.name}
      </h2>
      <p className="subText">
        View product details, choose quantity and checkout.
      </p>

      <div className="card" style={{ maxWidth: 820, marginTop: 14 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: 260,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 12,
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />

        <div className="row" style={{ marginTop: 0 }}>
          <div>
            <div className="price">₹{product.price}</div>
            <div className="subText" style={{ marginTop: 4 }}>
              Stock:{" "}
              <b
                style={{
                  color: outOfStock ? "var(--danger)" : "var(--text)",
                }}
              >
                {product.stock}
              </b>
            </div>
          </div>

          <span className="pill">{outOfStock ? "Out of Stock" : "Available"}</span>
        </div>

        <p className="cardText" style={{ marginTop: 12 }}>
          {product.description}
        </p>

        <div style={{ marginTop: 12 }}>
          <div className="label">Quantity</div>
          <input
            className="input"
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            disabled={outOfStock}
            onChange={(e) => setQty(clampQty(e.target.value))}
            style={{ width: 140 }}
          />
        </div>

        <div className="row" style={{ justifyContent: "flex-start", marginTop: 14 }}>
          <button
            className="btn btnSmall"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product, qty);
              alert("Added to cart");
              navigate("/cart");
            }}
          >
            Add to Cart
          </button>

          <button
            className="btn btnSmall btnGhost"
            disabled={outOfStock}
            onClick={() => navigate(`/cart/${product._id}`)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}