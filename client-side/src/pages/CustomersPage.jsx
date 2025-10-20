import React, { useState } from "react";
import SearchBar from "../components/Customer/SearchBar";
import CustomerTable from "../components/Customer/CustomerTable";
import Pagination from "../components/Customer/Pagination";
import { initialCustomers } from "../components/Customer/customers";
import CustomerForm from "../components/Customer/CustomerForm";
import "../styles/FeaturePage.css";

export default function CustomerPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    membership: "",
    points: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "name")
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortField === "points")
        return sortOrder === "asc" ? a.points - b.points : b.points - a.points;
      return 0;
    });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginated = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone))
      newErrors.phone = "SĐT không hợp lệ";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.membership.trim())
      newErrors.membership = "Loại thành viên không được để trống";
    if (formData.points === "" || formData.points < 0)
      newErrors.points = "Điểm thưởng phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
        points: Number(formData.points),
      };
      setCustomers([...customers, newCustomer]);
    }
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      membership: "",
      points: "",
    });
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", membership: "", points: "" });
    setShowModal(true);
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setFormData(c);
    setShowModal(true);
  };

  const handleDelete = (id) =>
    window.confirm("Bạn có chắc muốn xóa khách hàng này không?") &&
    setCustomers(customers.filter((c) => c.id !== id));

  return (
    <div className="feature-page">
      <h2>Danh sách khách hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <CustomerTable
        customers={paginated}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <CustomerForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingCustomer}
      />
    </div>
  );
}
