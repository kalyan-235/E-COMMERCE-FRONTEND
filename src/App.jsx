import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";        
import Checkout from "./pages/Checkout"; 

import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

import AdminRoute from "./routes/AdminRoute";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />

      <Route path="/cart" element={<Layout><Cart /></Layout>} />

      <Route path="/cart/:id" element={<Layout><Checkout /></Layout>} />

      <Route path="/my-orders" element={<Layout><MyOrders /></Layout>} />
      <Route path="/orders/:id" element={<Layout><OrderDetails /></Layout>} />

      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/products" element={<Layout><AdminProducts /></Layout>} />
        <Route path="/admin/orders" element={<Layout><AdminOrders /></Layout>} />
        <Route path="/admin/categories" element={<Layout><AdminCategories /></Layout>} />
      </Route>
    </Routes>
  );
}
