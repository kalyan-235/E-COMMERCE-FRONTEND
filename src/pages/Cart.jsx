import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, clearCart } from "../utils/cart";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const load = () => setItems(getCart());

  useEffect(() => {
    load();
  }, []);

  const total = items.reduce((sum, it) => sum + it.price * (it.qty || 1), 0);

  if (items.length === 0) {
    return (
      <div>
        <h2>Cart</h2>
        <p>No items in cart</p>
        <button onClick={() => navigate("/products")}>Go Products</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Cart</h2>

      {items.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 10,
            marginTop: 10,
            maxWidth: 750,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <img
            src={p.image || "https://via.placeholder.com/120x90?text=No+Image"}
            alt={p.name}
            style={{
              width: 120,
              height: 90,
              objectFit: "cover",
              borderRadius: 10,
              border: "1px solid #ccc",
            }}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/120x90?text=No+Image";
            }}
          />

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}><b>{p.name}</b></p>
            <p style={{ margin: "6px 0 0" }}>
              ₹{p.price} × {p.qty}
            </p>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => navigate(`/cart/${p._id}`)}>Checkout</button>

              <button
                onClick={() => {
                  removeFromCart(p._id);
                  load();
                }}
                style={{ marginLeft: 10 }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 15 }}>Total: ₹{total}</h3>

      <button
        style={{ marginTop: 10 }}
        onClick={() => {
          clearCart();
          load();
        }}
      >
        Clear Cart
      </button>
    </div>
  );
}