import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
}