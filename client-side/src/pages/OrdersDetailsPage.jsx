// src/pages/OrderDetailPage.jsx
import React, { useState } from "react";
import SearchBar from "../components/OrderDetail/SearchBar";
import OrderDetailTable from "../components/OrderDetail/OrderDetailTable";
import Pagination from "../components/OrderDetail/Pagination";
import OrderDetailForm from "../components/OrderDetail/OrderDetailForm";
import { initialOrderDetails } from "../components/OrderDetail/orderDetails";
import "../styles/FeaturePage.css";

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState(initialOrderDetails);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [formData, setFormData] = useState({ orderId: "", productId: "", quantity: "", unitPrice: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filteredDetails = orderDetails
    .filter((d) =>
      d.orderId.toString().includes(search) || d.productId.toString().includes(search)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const order = sortOrder === "asc" ? 1 : -1;
      return a[sortField] > b[sortField] ? order : -order;
    });

  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const paginated = filteredDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = "Mã đơn không được để trống";
    if (!formData.productId) newErrors.productId = "Mã SP không được để trống";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải > 0";
    if (formData.unitPrice === "" || formData.unitPrice < 0) newErrors.unitPrice = "Đơn giá phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingDetail) {
      setOrderDetails(orderDetails.map((d) => (d.id === editingDetail.id ? { ...d, ...formData, quantity: Number(formData.quantity), unitPrice: Number(formData.unitPrice) } : d)));
    } else {
      const newDetail = { id: orderDetails.length + 1, ...formData, quantity: Number(formData.quantity), unitPrice: Number(formData.unitPrice) };
      setOrderDetails([...orderDetails, newDetail]);
    }
    setShowModal(false);
    setEditingDetail(null);
    setFormData({ orderId: "", productId: "", quantity: "", unitPrice: "" });
  };

  const handleAddNew = () => {
    setEditingDetail(null);
    setFormData({ orderId: "", productId: "", quantity: "", unitPrice: "" });
    setShowModal(true);
  };

  const handleEdit = (d) => {
    setEditingDetail(d);
    setFormData(d);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chi tiết đơn này không?")) {
      setOrderDetails(orderDetails.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách chi tiết đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <OrderDetailTable
        orderDetails={paginated}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <OrderDetailForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingDetail}
      />
    </div>
  );
}

