import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Staff/SearchBarStaff";
import StaffTable from "../components/Staff/StaffTable";
import StaffToolbar from "../components/Staff/StaffToolbar"; // Import Toolbar mới
import StaffForm from "../components/Staff/StaffForm";
import Loading from "../components/Loading"; // <-- 1. IMPORT COMPONENT LOADING
import { toast } from 'react-toastify'; // Import Toastify

export default function StaffPage() {
  // --- States ---
  const [staffs, setStaffs] = useState([]);
  const [sortField, setSortField] = useState("name"); // Mặc định sort tên A-Z
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [suggestions, setSuggestions] = useState([]); // State cho autocomplete
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: "", position: "", salary: "", workShift: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // <-- 2. THÊM STATE LOADING

  // --- Fetch Data ---
  const fetchStaffs = async () => {
    try {
      let response;
      let params = {};
      if (debouncedSearch) {
        // Gọi API Search (Backend File 6)
        params = { q: debouncedSearch };
        response = await api.get("/staffs/search", { params });
        setStaffs(response.data);
        setTotalPages(1); setCurrentPage(1);
      } else {
        // Gọi API lấy tất cả (Backend File 6)
        params = { page: currentPage - 1, size: itemsPerPage, sort: `${sortField},${sortOrder}` };
        response = await api.get("/staffs", { params });
        setStaffs(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      setLoading(false); // <-- 3. SET LOADING = FALSE KHI THÀNH CÔNG
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      toast.error("Không thể tải danh sách nhân viên!");
      setStaffs([]); setTotalPages(0);
      // setLoading(false); // <-- 4. SET LOADING = FALSE KHI LỖI
    }
  };

  // --- UseEffect Hooks ---
  useEffect(() => { // Debounce Search
    const timer = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { // Fetch on change
    setLoading(true); // <-- 5. SET LOADING = TRUE TRƯỚC KHI GỌI API
    fetchStaffs();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  useEffect(() => { // Autocomplete Suggestions
    const fetchSuggestions = async () => {
      if (search.trim() !== "") {
        try {
          const response = await api.get("/staffs/autocomplete", { params: { q: search } });
          setSuggestions(response.data || []);
        } catch (error) { console.error("Lỗi gợi ý NV:", error); setSuggestions([]); }
      } else { setSuggestions([]); }
    };
    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Event Handlers ---
  const handleSuggestionClick = (suggestion) => {
    // Trích xuất tên từ chuỗi gợi ý "Tên (ID: X)"
    const nameOnly = suggestion.split(" (ID:")[0];
    setSearch(nameOnly); // Chỉ điền tên vào search bar
    setSuggestions([]);
  };
  const handleSearchBlur = () => { setTimeout(() => setSuggestions([]), 150); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const validate = () => { /* ... (Logic validate giữ nguyên từ file cũ) ... */ return true; }; // Thay bằng logic thật

  const handleSave = async () => {
    // if (!validate()) { toast.error("Kiểm tra lại thông tin!"); return; } // Bỏ comment khi có validate thật
    const requestData = { name: formData.name, position: formData.position, salary: Number(formData.salary), workShift: formData.workShift };
    try {
      let actionText = "";
      if (editingStaff) { await api.put(`/staffs/${editingStaff.id}`, requestData); actionText = "Cập nhật"; }
      else { await api.post("/staffs", requestData); actionText = "Thêm mới"; }
      fetchStaffs(); setShowModal(false); toast.success(`${actionText} nhân viên thành công!`);
    } catch (error) { console.error("Lỗi lưu NV:", error); toast.error(`Lỗi: ${error.response?.data?.message || error.message}`); }
  };

  const handleAddNew = () => {
    setEditingStaff(null); setFormData({ name: "", position: "", salary: "", workShift: "" }); setErrors({}); setShowModal(true);
  };
  const handleEdit = (s) => {
    setEditingStaff(s); setFormData({ name: s.name, position: s.position, salary: s.salary, workShift: s.workShift }); setErrors({}); setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      try { await api.delete(`/staffs/${id}`); fetchStaffs(); toast.success("Xóa nhân viên thành công!"); }
      catch (error) { console.error("Lỗi xóa NV:", error); toast.error(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra.'}`); }
    }
  };
  const handleCancel = () => { setShowModal(false); setEditingStaff(null); };

  // --- JSX Render ---
  // <-- 6. THÊM BIỂU THỨC ĐIỀU KIỆN (TERNARY) ĐỂ HIỂN THỊ LOADING -->
  return loading ? (
    <Loading />
  ) : (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách nhân viên
      </h2>
      <SearchBar
        search={search} setSearch={setSearch} onAddNew={handleAddNew} // Sửa onAdd -> onAddNew
        suggestions={suggestions} onSuggestionClick={handleSuggestionClick} onBlur={handleSearchBlur} // Thêm props autocomplete
      />
      <StaffToolbar
        sortField={sortField} setSortField={setSortField} sortOrder={sortOrder} setSortOrder={setSortOrder}
        currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}
      />
      <StaffTable staffs={staffs} handleEdit={handleEdit} handleDelete={handleDelete} /> {/* Xóa props sort */}
      <StaffForm
        show={showModal} formData={formData} errors={errors} onChange={handleChange}
        onSave={handleSave} onCancel={handleCancel} editing={!!editingStaff}
      />
    </div>
  );
}