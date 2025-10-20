import React, { useState } from "react";
import { orders as initialOrders } from "../components/Order/order";
import OrderList from "../components/Order/OrderList";
import OrderForm from "../components/Order/OrderForm";
import Pagination from "../components/Order/Pagination";
import SearchBar from "../components/Order/SearchBar";
import "../styles/FeaturePage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    date: "",
    status: "",
    total: "",
  });
  const [errors, setErrors] = useState({});

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredOrders = orders
    .filter(
      (o) =>
        o.customerId.toLowerCase().includes(search.toLowerCase()) ||
        o.date.includes(search) ||
        o.status.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "date")
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      if (sortField === "total")
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
      return 0;
    });

  // 🔹 Áp dụng phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.customerId.trim()) newErrors.customerId = "Mã KH không được để trống";
    if (!formData.date) newErrors.date = "Ngày không hợp lệ";
    if (!formData.status.trim()) newErrors.status = "Trạng thái không được để trống";
    if (formData.total === "" || formData.total < 0) newErrors.total = "Tổng tiền phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingOrder) {
      setOrders(orders.map((o) => (o.id === editingOrder.id ? { ...o, ...formData } : o)));
    } else {
      const newOrder = {
        id: orders.length + 1,
        ...formData,
        total: Number(formData.total),
      };
      setOrders([...orders, newOrder]);
    }
    setShowModal(false);
    setEditingOrder(null);
    setFormData({ customerId: "", date: "", status: "", total: "" });
  };

  const handleAddNew = () => {
    setEditingOrder(null);
    setFormData({ customerId: "", date: "", status: "", total: "" });
    setShowModal(true);
  };

  const handleEdit = (o) => {
    setEditingOrder(o);
    setFormData(o);
    setShowModal(true);
  };

  const handleDelete = (id) =>
    window.confirm("Bạn có chắc muốn xóa đơn hàng này không?") &&
    setOrders(orders.filter((o) => o.id !== id));

  return (
    <div className="feature-page">
      <h2>Danh sách đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      <OrderList
        orders={paginatedOrders}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* 🔹 Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <OrderForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingOrder}
      />
    </div>
  );
}
