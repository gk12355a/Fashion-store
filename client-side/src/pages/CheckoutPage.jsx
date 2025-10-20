import React, { useState } from "react";
import SearchBar from "../components/Checkout/SearchBar";
import PaymentTable from "../components/Checkout/PaymentTable";
import Pagination from "../components/Checkout/Pagination";
import { initialPayments } from '../components/Checkout/payments';
import PaymentForm from "../components/Checkout/PaymentForm";
import "../styles/FeaturePage.css";

export default function CheckoutPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({ orderCode: "", method: "", amount: "", date: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filteredPayments = payments
    .filter((p) => p.orderCode.toLowerCase().includes(search.toLowerCase()) || p.method.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "amount") return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      if (sortField === "date") return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      return 0;
    });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginated = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.orderCode.trim()) newErrors.orderCode = "Mã đơn không được để trống";
    if (!/^DH\d+$/.test(formData.orderCode)) newErrors.orderCode = "Mã đơn phải bắt đầu bằng 'DH' và theo sau là số";
    if (!formData.method.trim()) newErrors.method = "Phương thức không được để trống";
    if (formData.amount === "" || formData.amount < 0) newErrors.amount = "Số tiền phải ≥ 0";
    if (!formData.date) newErrors.date = "Ngày thanh toán không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingPayment) {
      setPayments(payments.map((p) => (p.id === editingPayment.id ? { ...p, ...formData } : p)));
    } else {
      const newPayment = { id: payments.length + 1, ...formData, amount: Number(formData.amount) };
      setPayments([...payments, newPayment]);
    }
    setShowModal(false);
    setEditingPayment(null);
    setFormData({ orderCode: "", method: "", amount: "", date: "" });
  };
  const handleAddNew = () => {
  setEditingPayment(null); // bỏ trạng thái sửa
  setFormData({ orderCode: "", method: "", amount: "", date: "" }); // reset form
  setShowModal(true); // mở modal
};
  const handleEdit = (p) => {
  setEditingPayment(p);
  setFormData(p);
  setShowModal(true);
};
  const handleDelete = (id) => window.confirm("Bạn có chắc muốn xóa thanh toán này không?") && setPayments(payments.filter((p) => p.id !== id));

  return (
    <div className="feature-page">
      <h2>Danh sách thanh toán</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      <PaymentTable
        payments={paginated}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <PaymentForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingPayment}
      />
    </div>
  );
}
