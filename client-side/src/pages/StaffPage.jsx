// src/pages/NhanVienPage.jsx
import React, { useState } from "react";
import SearchBar from "../components/Staff/SearchBar";
import StaffTable from "../components/Staff/StaffTable";
import Pagination from "../components/Staff/Pagination";
import { initialStaffs } from "../components/Staff/staff";
import StaffForm from "../components/Staff/StaffForm";
import "../styles/FeaturePage.css";

export default function StaffPage() {
  const [staffs, setStaffs] = useState(initialStaffs);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: "", position: "", salary: "", shift: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filteredStaffs = staffs
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "name") return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortField === "salary") return sortOrder === "asc" ? a.salary - b.salary : b.salary - a.salary;
      return 0;
    });

  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const paginated = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.position.trim()) newErrors.position = "Chức vụ không được để trống";
    if (formData.salary === "" || formData.salary < 0) newErrors.salary = "Lương phải ≥ 0";
    if (!formData.shift) newErrors.shift = "Vui lòng chọn ca làm việc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingStaff) {
      setStaffs(staffs.map((s) => (s.id === editingStaff.id ? { ...s, ...formData } : s)));
    } else {
      const newStaff = { id: staffs.length + 1, ...formData, salary: Number(formData.salary) };
      setStaffs([...staffs, newStaff]);
    }
    setShowModal(false);
    setEditingStaff(null);
    setFormData({ name: "", position: "", salary: "", shift: "" });
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    setFormData({ name: "", position: "", salary: "", shift: "" });
    setShowModal(true);
  };

  const handleEdit = (s) => {
    setEditingStaff(s);
    setFormData(s);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      setStaffs(staffs.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách nhân viên</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <StaffTable
        staffs={paginated}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <StaffForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => setShowModal(false)}
        editing={editingStaff}
      />
    </div>
  );
}
