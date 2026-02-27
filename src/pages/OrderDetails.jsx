import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (!mounted) return;
        setOrder(data);
      } catch (err) {
        if (!mounted) return;
        alert(err.response?.data?.message || "Failed to load order");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!id) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Order Error</h3>
        <p>Order id missing in URL.</p>
        <button className="btn btnSmall" onClick={() => navigate("/my-orders")}>
          Go My Orders
        </button>
      </div>
    );
  }

  if (loading) return <p style={{ padding: 20 }}>Loading order details...</p>;
  if (!order) return <p style={{ padding: 20 }}>Order not found</p>;

  const status = order.status || "Pending";

  const statusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver")) return "badge badgeDelivered";
    if (s.includes("cancel")) return "badge badgeCancelled";
    return "badge badgePending";
  };

  return (
    <div style={{ padding: 20, maxWidth: 860 }}>
      <button className="btn btnSmall btnGhost" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="pageTitle" style={{ marginTop: 12 }}>
        Order Details
      </h2>
      <p className="subText">
        View your order info, product and user details.
      </p>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ marginTop: 0 }}>
          <div>
            <div className="cardTitle">
              Order #{(order._id || "").slice(-6).toUpperCase()}
            </div>
            <div className="subText" style={{ fontSize: 13, marginTop: 6 }}>
              Full ID: {order._id}
            </div>
          </div>

          <span className={statusBadgeClass(status)}>{status}</span>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.10)", margin: "14px 0" }} />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="card" style={{ boxShadow: "none" }}>
            <div className="subText">Total Price</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>₹{order.totalPrice}</div>
          </div>

          <div className="card" style={{ boxShadow: "none" }}>
            <div className="subText">Quantity</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{order.quantity}</div>
          </div>

          <div className="card" style={{ boxShadow: "none" }}>
            <div className="subText">Payment</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>
              {order.paymentMethod || "N/A"}
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none" }}>
            <div className="subText">Created At</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.10)", margin: "14px 0" }} />
        <h3 style={{ margin: "0 0 10px" }}>Product</h3>
        <div className="row" style={{ justifyContent: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900 }}>
              Name: <span style={{ fontWeight: 700 }}>{order.product?.name || "N/A"}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              Price: <b>₹{order.product?.price ?? "N/A"}</b>
            </div>
          </div>
          {order.product?.image && (
            <img
              src={order.product.image}
              alt={order.product.name}
              style={{
                width: 110,
                height: 80,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.10)", margin: "14px 0" }} />

        <h3 style={{ margin: "0 0 10px" }}>User</h3>
        <div style={{ display: "grid", gap: 6 }}>
          <div>
            Name: <b>{order.user?.name || "N/A"}</b>
          </div>
          <div>
            Email: <b>{order.user?.email || "N/A"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}