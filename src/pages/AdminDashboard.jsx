import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [prodRes, catRes, orderRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
      api.get("/orders"),
    ]);

    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setOrders(orderRes.data || []);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await fetchAll();
      } catch (err) {
        if (mounted) alert(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalOrders = orders.length;

    const countByStatus = orders.reduce((acc, o) => {
      const s = (o.status || "Pending").trim();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const pending = countByStatus.Pending || 0;
    const shipped = countByStatus.Shipped || 0;
    const delivered = countByStatus.Delivered || 0;
    const cancelled = countByStatus.Cancelled || 0;

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      pending,
      shipped,
      delivered,
      cancelled,
      countByStatus,
    };
  }, [products, categories, orders]);

  const statusChartData = useMemo(() => {
    const all = ["Pending", "Shipped", "Delivered", "Cancelled"];
    return all.map((name) => ({
      name,
      value: stats.countByStatus[name] || 0,
    }));
  }, [stats.countByStatus]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [orders]);

  const badgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliver")) return "badge badgeDelivered";
    if (s.includes("cancel")) return "badge badgeCancelled";
    if (s.includes("ship")) return "badge badgePending";
    return "badge badgePending";
  };

  if (loading) return <p style={{ padding: 20 }}>Loading admin dashboard...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 className="pageTitle">Admin Dashboard</h2>
      <p className="subText">Manage products, categories and orders in one place.</p>

      <div className="row" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
        <button className="btn btnSmall" onClick={() => navigate("/admin/products")}>
          Manage Products
        </button>
        <button className="btn btnSmall" onClick={() => navigate("/admin/categories")}>
          Manage Categories
        </button>
        <button className="btn btnSmall btnGhost" onClick={() => navigate("/admin/orders")}>
          Manage Orders
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 16,
          maxWidth: 1000,
        }}
      >
        <div className="card">
          <div className="subText">Total Products</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalProducts}</div>
        </div>

        <div className="card">
          <div className="subText">Total Categories</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalCategories}</div>
        </div>

        <div className="card">
          <div className="subText">Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalOrders}</div>
        </div>

        <div className="card">
          <div className="subText">Status Summary</div>
          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            <div className="row" style={{ marginTop: 0 }}>
              <span className="pill">Pending</span>
              <b>{stats.pending}</b>
            </div>
            <div className="row" style={{ marginTop: 0 }}>
              <span className="pill">Shipped</span>
              <b>{stats.shipped}</b>
            </div>
            <div className="row" style={{ marginTop: 0 }}>
              <span className="pill">Delivered</span>
              <b>{stats.delivered}</b>
            </div>
            <div className="row" style={{ marginTop: 0 }}>
              <span className="pill">Cancelled</span>
              <b>{stats.cancelled}</b>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 12,
          marginTop: 16,
          maxWidth: 1000,
        }}
      >

        <div className="card">
          <div className="cardTitle">Orders by Status (Pie)</div>
          <div className="cardText">Distribution of order statuses.</div>

          <div style={{ width: "100%", height: 320, marginTop: 10 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="cardTitle">Orders by Status (Bar)</div>
          <div className="cardText">Compare counts quickly.</div>

          <div style={{ width: "100%", height: 320, marginTop: 10 }}>
            <ResponsiveContainer>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, maxWidth: 1000 }}>
        <div className="row" style={{ marginTop: 0 }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
          <button className="btn btnSmall btnGhost" onClick={() => navigate("/admin/orders")}>
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="card" style={{ marginTop: 10 }}>
            <div className="cardTitle">No orders yet</div>
            <div className="cardText">Once customers place orders, they appear here.</div>
          </div>
        ) : (
          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <b>#{(o._id || "").slice(-6).toUpperCase()}</b>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{o._id}</div>
                    </td>

                    <td>
                      <div><b>{o.user?.name || "N/A"}</b></div>
                      <div style={{ fontSize: 12, opacity: 0.85 }}>{o.user?.email || ""}</div>
                    </td>

                    <td><b>₹{o.totalPrice}</b></td>

                    <td>
                      <span className={badgeClass(o.status)}>{o.status || "Pending"}</span>
                    </td>

                    <td>
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}