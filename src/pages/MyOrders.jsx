import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const { data } = await api.get("/orders/myorders");
    setOrders(data);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await fetchOrders();
      } catch (err) {
        if (mounted) {
          alert(err.response?.data?.message || "Failed to load orders");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const cancelOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/cancel`);
      alert("Order Cancelled");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const statusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver")) return "badge badgeDelivered";
    if (s.includes("cancel")) return "badge badgeCancelled";
    return "badge badgePending";
  };

  if (loading) return <p style={{ padding: 10 }}>Loading orders...</p>;

  return (
    <div>
      <h2 className="pageTitle">My Orders</h2>
      <p className="subText">Track your orders and manage cancellations.</p>

      {orders.length === 0 ? (
        <div className="card" style={{ maxWidth: 650 }}>
          <h3 className="cardTitle">No orders yet</h3>
          <p className="cardText">Start shopping and place your first order.</p>
          <button className="btn" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {orders.map((o) => (
            <div className="card" key={o._id} style={{ maxWidth: 750 }}>
              <div className="row" style={{ marginTop: 0 }}>
                <div>
                  <div className="cardTitle" style={{ marginBottom: 6 }}>
                    Order #{o._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="subText" style={{ fontSize: 13 }}>
                    Full ID: {o._id}
                  </div>
                </div>

                <span className={statusBadgeClass(o.status)}>
                  {o.status || "Pending"}
                </span>
              </div>

              <div style={{ marginTop: 12 }}>
                {o.product?.name && (
                  <p style={{ margin: 0 }}>
                    <b>Product:</b> {o.product.name}
                  </p>
                )}

                <p style={{ margin: "6px 0 0" }}>
                  <b>Total:</b> ₹{o.totalPrice}
                </p>

                {o.paymentMethod && (
                  <p style={{ margin: "6px 0 0" }}>
                    <b>Payment:</b> {o.paymentMethod}
                  </p>
                )}

                {o.createdAt && (
                  <p style={{ margin: "6px 0 0" }}>
                    <b>Date:</b> {new Date(o.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="row" style={{ justifyContent: "flex-start" }}>
                <button
                  className="btn btnSmall"
                  onClick={() => navigate(`/orders/${o._id}`)}
                >
                  View Details
                </button>

                {o.status !== "Cancelled" && o.status !== "Delivered" && (
                  <button
                    className="btn btnSmall btnDanger"
                    onClick={() => cancelOrder(o._id)}
                  >
                    Cancel
                  </button>
                )}

                {(o.status === "Cancelled" || o.status === "Delivered") && (
                  <button className="btn btnSmall btnGhost" disabled>
                    Cannot Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}