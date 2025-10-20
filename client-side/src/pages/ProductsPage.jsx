import React, { useState, useMemo } from "react";
import SearchBarProduct from "../components/Product/SearchBar";
import ProductTable from "../components/Product/ProductTable";
import PaginationProduct from "../components/Product/Pagination";
import ProductForm from "../components/Product/ProductForm";
import { initialProducts } from "../components/Product/products";
import "../styles/FeaturePage.css";

export default function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ image: "", name: "", category: "", size: "", color: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p =>
      !q || [p.name, p.category, p.size, p.color].some(f => String(f).toLowerCase().includes(q))
    ).sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "name") return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortField === "price") return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      if (sortField === "stock") return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock;
      return 0;
    });
  }, [products, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.category?.trim()) newErrors.category = "Loại không được để trống";
    if (!formData.size?.trim()) newErrors.size = "Size không được để trống";
    if (!formData.color?.trim()) newErrors.color = "Màu không được để trống";
    if (formData.price === "" || Number(formData.price) < 0) newErrors.price = "Giá phải ≥ 0";
    if (formData.stock === "" || Number(formData.stock) < 0) newErrors.stock = "Số lượng phải ≥ 0";
    if (formData.image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.image)) {
      // chấp nhận nếu để trống (sẽ dùng placeholder), nếu có url thì kiểm tra định dạng ảnh cơ bản
      newErrors.image = "URL ảnh không hợp lệ (jpg/png/gif/webp)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || "https://via.placeholder.com/80",
    };
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
    } else {
      const nextId = products.reduce((m, x) => Math.max(m, x.id), 0) + 1;
      setProducts([...products, { id: nextId, ...payload }]);
    }
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ image: "", name: "", category: "", size: "", color: "", price: "", stock: "" });
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ image: "", name: "", category: "", size: "", color: "", price: "", stock: "" });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({ image: p.image, name: p.name, category: p.category, size: p.size, color: p.color, price: p.price, stock: p.stock });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // nếu kết quả filter thay đổi, reset trang về 1
  React.useEffect(() => setCurrentPage(1), [search, sortField, sortOrder]);

  return (
    <div className="feature-page">
      <h2>Danh sách sản phẩm</h2>
      <SearchBarProduct search={search} setSearch={setSearch} onAdd={handleAddNew} />

      <ProductTable
        products={paginated}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <PaginationProduct totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <ProductForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => { setShowModal(false); setEditingProduct(null); }}
        editing={editingProduct}
      />
    </div>
  );
}
