import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [file, setFile] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories().catch(() => alert("Failed to load categories"));
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Category name required");

    try {
      setCreating(true);

      let imageUrl = "";

      if (file) {
        const fd = new FormData();
        fd.append("image", file);

        const uploadRes = await api.post("/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      await api.post("/categories", {
        name: name.trim(),
        image: imageUrl || undefined,
      });

      alert("Category created");
      setName("");
      setFile(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Create category failed");
    } finally {
      setCreating(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      alert("Deleted");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 className="pageTitle">Admin Categories</h2>
      <p className="subText">Create and manage product categories.</p>

      <form onSubmit={createCategory} className="card" style={{ maxWidth: 700 }}>
        <div className="label">Category Name</div>
        <input
          className="input"
          placeholder="Ex: Mobiles, Laptops, Shoes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="label" style={{ marginTop: 12 }}>
          Category Image (optional)
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        <button className="btn" style={{ marginTop: 12 }} disabled={creating}>
          {creating ? "Creating..." : "Create Category"}
        </button>
      </form>

      <h3 style={{ marginTop: 18 }}>All Categories</h3>

      {categories.length === 0 ? (
        <p>No categories yet</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 12, maxWidth: 900 }}>
          {categories.map((c) => (
            <div
              key={c._id}
              className="card"
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <img
                src={c.image || "https://via.placeholder.com/300x200?text=Category"}
                alt={c.name}
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=Category";
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{c.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{c._id}</div>
              </div>

              <button className="btn btnSmall btnDanger" onClick={() => deleteCategory(c._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}