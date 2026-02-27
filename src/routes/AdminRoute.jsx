import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) return <Navigate to="/login" replace />;

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  if (!user || user.role !== "admin") return <Navigate to="/products" replace />;

  return <Outlet />;
}
