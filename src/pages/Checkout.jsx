import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (!mounted) return;
        setProduct(res.data);
        setQty(res.data.stock > 0 ? 1 : 0);
      })
      .catch((err) => alert(err.response?.data?.message || "Product load failed"));

    return () => (mounted = false);
  }, [id]);

  const clampQty = (val) => {
    if (!product) return 1;
    return Math.max(1, Math.min(Number(val), product.stock));
  };

  const placeOrder = async () => {
    try {
      if (!product) return;
      if (product.stock <= 0) return alert("Out of stock ❌");

      setLoading(true);

      const payload = {
        productId: id,
        quantity: Number(qty),
        paymentMethod,
      };

      await api.post("/orders", payload);
      alert("Order placed");
      navigate("/my-orders");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="card" style={{ maxWidth: 650 }}>
        <h3 className="cardTitle">Checkout Error</h3>
        <p className="cardText">Product ID missing in URL.</p>
        <button className="btn" onClick={() => navigate("/products")}>Go Products</button>
      </div>
    );
  }

  if (!product) return <p style={{ padding: 10 }}>Loading checkout...</p>;

  const outOfStock = product.stock <= 0;
  const subtotal = product.price * (qty || 0);

  return (
    <div>
      <button className="btn btnSmall btnGhost" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="pageTitle" style={{ marginTop: 12 }}>
        Checkout
      </h2>
      <p className="subText">Confirm quantity and place your order securely.</p>

      <div className="card" style={{ maxWidth: 820, marginTop: 14 }}>
        <div className="row" style={{ marginTop: 0 }}>
          <div>
            <div className="cardTitle">{product.name}</div>
            <div className="subText">Stock: {product.stock}</div>
          </div>
          <div className="price">₹{product.price}</div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="label">Quantity</div>
          <input
            className="input"
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            disabled={outOfStock}
            onChange={(e) => setQty(clampQty(e.target.value))}
            style={{ width: 160 }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="label">Payment Method</div>
          <select
            className="input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: 240 }}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online (Demo)</option>
          </select>
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <span className="pill">
            Subtotal: <b style={{ color: "var(--text)" }}>₹{subtotal}</b>
          </span>

          <button
            className="btn"
            onClick={placeOrder}
            disabled={outOfStock || loading}
          >
            {outOfStock ? "Out of Stock" : loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}