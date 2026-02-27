import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await api.get("/orders"); 
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

  const statusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver")) return "badge badgeDelivered";
    if (s.includes("cancel")) return "badge badgeCancelled";
    return "badge badgePending";
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      alert("Status updated ✅");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p style={{ padding: 10 }}>Loading admin orders...</p>;

  return (
    <div>
      <h2 className="pageTitle">Admin Orders</h2>
      <p className="subText">Manage all customer orders and update status.</p>

      {orders.length === 0 ? (
        <div className="card" style={{ maxWidth: 700 }}>
          <h3 className="cardTitle">No orders found</h3>
          <p className="cardText">Once users place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="tableWrap" style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <b>#{o._id.slice(-6).toUpperCase()}</b>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {o._id}
                    </div>
                  </td>

                  <td>
                    <div><b>{o.user?.name || "N/A"}</b></div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                      {o.user?.email || ""}
                    </div>
                  </td>

                  <td>
                    <div><b>{o.product?.name || "N/A"}</b></div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                      ₹{o.product?.price ?? "N/A"}
                    </div>
                  </td>

                  <td>
                    <b>₹{o.totalPrice}</b>
                  </td>

                  <td>
                    <span className={statusBadgeClass(o.status)}>
                      {o.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "N/A"}
                  </td>

                  <td>
                    <select
                      className="input"
                      style={{ width: 170, marginTop: 0 }}
                      defaultValue={o.status || "Pending"}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
