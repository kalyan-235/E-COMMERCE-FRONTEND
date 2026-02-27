import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await api.get("/orders"); 
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders().catch((err) => {
      alert(err.response?.data?.message || "Failed to load orders");
      setLoading(false);
    });
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status });
      alert("Status updated");
      
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <h3>Loading orders...</h3>;

  return (
    <div>
      <h2>Admin Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((o) => (
          <div
            key={o._id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 12,
              borderRadius: 6,
            }}
          >
            <p><b>Order ID:</b> {o._id}</p>
            <p><b>User:</b> {o.user?.name} ({o.user?.email})</p>
            <p><b>Product:</b> {o.product?.name}</p>
            <p><b>Qty:</b> {o.quantity}</p>
            <p><b>Total:</b> ₹{o.totalPrice}</p>
            <p><b>Status:</b> {o.status}</p>

            <select
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}