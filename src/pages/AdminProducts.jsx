import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",     
    newCategoryName: "",
  });

  const [stockInputs, setStockInputs] = useState({});

  const [imageFiles, setImageFiles] = useState({});

  const [creating, setCreating] = useState(false);

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load admin data");
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setForm((prev) => ({ ...prev, categoryId: value, newCategoryName: "" }));
      return;
    }

    if (name === "newCategoryName") {
      setForm((prev) => ({ ...prev, newCategoryName: value, categoryId: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const ensureCategoryId = async () => {

    if (form.categoryId) return form.categoryId;

    const newName = (form.newCategoryName || "").trim();
    if (!newName) return null;

    const existing = categories.find(
      (c) => c.name.toLowerCase() === newName.toLowerCase()
    );
    if (existing) return existing._id;

    const { data } = await api.post("/categories", {
      name: newName,
    });

    await fetchCategories();

    return data._id;
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      const categoryId = await ensureCategoryId();
      if (!categoryId) {
        return alert("Select a category OR type a new category name");
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: categoryId, 
      };

      await api.post("/products", payload);
      alert("Product added");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        newCategoryName: "",
      });

      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Add product failed");
    } finally {
      setCreating(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      alert("Deleted");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const addStockToProduct = async (id) => {
    try {
      const stockToAdd = Number(stockInputs[id]);
      if (!stockToAdd || stockToAdd <= 0) return alert("Enter stock value (ex: 10)");

      await api.put(`/products/${id}/stock`, { stockChange: stockToAdd });
      alert("Stock updated ✅");

      setStockInputs((prev) => ({ ...prev, [id]: "" }));
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Stock update failed");
    }
  };

  const handlePickImage = (productId, file) => {
    setImageFiles((prev) => ({ ...prev, [productId]: file }));
  };

  const uploadAndUpdateImage = async (productId) => {
    try {
      const file = imageFiles[productId];
      if (!file) return alert("Choose an image first");

      const fd = new FormData();
      fd.append("image", file);

      const uploadRes = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadRes.data.url;

      await api.put(`/products/${productId}`, { image: imageUrl });
      alert("Image updated ✅");

      setImageFiles((prev) => ({ ...prev, [productId]: null }));
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Image upload/update failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Products</h2>
      <form onSubmit={addProduct} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <br /><br />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            style={{ width: 260 }}
          >
            <option value="">Select Category (optional)</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <span style={{ fontWeight: 800 }}>OR</span>

          <input
            name="newCategoryName"
            placeholder="Type new category (ex: Laptops)"
            value={form.newCategoryName}
            onChange={handleChange}
            style={{ width: 280 }}
          />
        </div>

        <p style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>
          Tip: Select existing category OR type a new one. New category will be auto-created.
        </p>

        <button type="submit" disabled={creating}>
          {creating ? "Adding..." : "Add Product"}
        </button>
      </form>

      <hr />
      
      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginTop: 10,
              borderRadius: 8,
              maxWidth: 920,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <img
                src={p.image || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={p.name}
                style={{
                  width: 140,
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              <div style={{ flex: 1 }}>
                <p><b>ID:</b> {p._id}</p>
                <p><b>Name:</b> {p.name}</p>
                <p><b>Category:</b> {p.category?.name || "N/A"}</p>
                <p><b>Price:</b> ₹{p.price}</p>
                <p><b>Stock:</b> {p.stock}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    type="number"
                    placeholder="Add Stock (ex: 10)"
                    value={stockInputs[p._id] ?? ""}
                    onChange={(e) =>
                      setStockInputs((prev) => ({ ...prev, [p._id]: e.target.value }))
                    }
                    style={{ width: 180 }}
                  />
                  <button onClick={() => addStockToProduct(p._id)}>Add Stock</button>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePickImage(p._id, e.target.files?.[0])}
                  />
                  <button onClick={() => uploadAndUpdateImage(p._id)}>
                    Upload & Update Image
                  </button>

                  <button onClick={() => deleteProduct(p._id)} style={{ marginLeft: "auto" }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}