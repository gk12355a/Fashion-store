import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Promotion/SearchBarPromotion";
import PromotionTable from "../components/Promotion/PromotionTable";
import PromotionToolbar from "../components/Promotion/PromotionToolbar"; // Import Toolbar mới
import PromotionForm from "../components/Promotion/PromotionForm";
import Loading from "../components/Loading"; // <-- 1. IMPORT COMPONENT LOADING
import { toast } from 'react-toastify'; // Import Toastify

export default function PromotionPage() {
  // --- States ---
  const [promotions, setPromotions] = useState([]);
  const [sortField, setSortField] = useState("name"); // Mặc định sort tên A-Z
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [suggestions, setSuggestions] = useState([]); // State cho autocomplete
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", discountValue: "", expiryDate: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // <-- 2. THÊM STATE LOADING

  // --- Fetch Data ---
  const fetchPromotions = async () => {
    try {
      // API /promotions/search trả về Page, nên dùng chung logic với API /promotions
      const endpoint = debouncedSearch ? "/promotions/search" : "/promotions";
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sort: `${sortField},${sortOrder}`, // Luôn gửi sort
      };
      if (debouncedSearch) {
        params.keyword = debouncedSearch; // Thêm keyword nếu có search
      }

      const response = await api.get(endpoint, { params });
      setPromotions(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false); // <-- 3. SET LOADING = FALSE KHI THÀNH CÔNG

    } catch (error) {
      console.error("Lỗi khi tải danh sách khuyến mãi:", error);
      toast.error("Không thể tải danh sách khuyến mãi!");
      setPromotions([]); setTotalPages(0);
      setLoading(false); // <-- 4. SET LOADING = FALSE KHI LỖI
    }
  };

  // --- UseEffect Hooks ---
  useEffect(() => { // Debounce Search
    const timer = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { // Fetch on change
    setLoading(true); // <-- 5. SET LOADING = TRUE TRƯỚC KHI GỌI API
    fetchPromotions();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  useEffect(() => { // Autocomplete Suggestions
    const fetchSuggestions = async () => {
      if (search.trim() !== "") {
        try {
          const response = await api.get("/promotions/autocomplete", { params: { q: search } });
          setSuggestions(response.data || []);
        } catch (error) { console.error("Lỗi gợi ý KM:", error); setSuggestions([]); }
      } else { setSuggestions([]); }
    };
    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Event Handlers ---
  const handleSuggestionClick = (suggestion) => {
    const nameOnly = suggestion.split(" (Loại:")[0];
    setSearch(nameOnly);
    setSuggestions([]);
  };
  const handleSearchBlur = () => { setTimeout(() => setSuggestions([]), 150); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Cập nhật Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên KM không được để trống";
    if (!formData.type) newErrors.type = "Vui lòng chọn Loại khuyến mãi"; // Lỗi cho select

    const discountVal = Number(formData.discountValue);
    if (formData.discountValue === "" || isNaN(discountVal)) {
        newErrors.discountValue = "Giá trị giảm giá không hợp lệ";
    } else {
        if (formData.type === "PERCENTAGE") {
            if (discountVal < 0 || discountVal > 100) {
                newErrors.discountValue = "Giá trị % phải từ 0 đến 100";
            }
        } else if (formData.type === "FIXED_AMOUNT") {
            if (discountVal <= 0) {
                newErrors.discountValue = "Số tiền giảm phải lớn hơn 0";
            }
        }
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Thời hạn không được để trống";
    } else {
        // Kiểm tra ngày hợp lệ (phải >= hôm nay)
        const today = new Date().toISOString().split("T")[0];
        if (formData.expiryDate < today) {
             newErrors.expiryDate = "Thời hạn phải là ngày hiện tại hoặc tương lai";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validate()) { toast.error("Kiểm tra lại thông tin!"); return; }
    const requestData = { name: formData.name, type: formData.type, discountValue: Number(formData.discountValue), expiryDate: formData.expiryDate };
    try {
      let actionText = "";
      if (editingPromotion) { await api.put(`/promotions/${editingPromotion.id}`, requestData); actionText = "Cập nhật"; }
      else { await api.post("/promotions", requestData); actionText = "Thêm mới"; }
      fetchPromotions(); setShowModal(false); toast.success(`${actionText} khuyến mãi thành công!`);
    } catch (error) { console.error("Lỗi lưu KM:", error); toast.error(`Lỗi: ${error.response?.data?.message || error.message}`); }
  };

  const handleAddNew = () => {
    setEditingPromotion(null); setFormData({ name: "", type: "", discountValue: "", expiryDate: "" }); setErrors({}); setShowModal(true);
  };
  const handleEdit = (p) => {
    setEditingPromotion(p); setFormData({ name: p.name, type: p.type, discountValue: p.discountValue, expiryDate: p.expiryDate }); setErrors({}); setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
      try { await api.delete(`/promotions/${id}`); fetchPromotions(); toast.success("Xóa khuyến mãi thành công!"); }
      catch (error) { console.error("Lỗi xóa KM:", error); toast.error(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra.'}`); }
    }
  };
  const handleCancel = () => { setShowModal(false); setEditingPromotion(null); };

  // --- JSX Render ---
  // <-- 6. THÊM BIỂU THỨC ĐIỀU KIỆN (TERNARY) ĐỂ HIỂN THỊ LOADING -->
  return loading ? (
    <Loading />
  ) : (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách khuyến mãi
      </h2>
      <SearchBar
        search={search} setSearch={setSearch} onAddNew={handleAddNew} // Sửa onAdd -> onAddNew
        suggestions={suggestions} onSuggestionClick={handleSuggestionClick} onBlur={handleSearchBlur} // Thêm props autocomplete
      />
      <PromotionToolbar
        sortField={sortField} setSortField={setSortField} sortOrder={sortOrder} setSortOrder={setSortOrder}
        currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}
      />
      <PromotionTable promotions={promotions} handleEdit={handleEdit} handleDelete={handleDelete} /> {/* Xóa props sort */}
      <PromotionForm
        show={showModal} formData={formData} errors={errors} onChange={handleChange}
        onSave={handleSave} onCancel={handleCancel} editing={!!editingPromotion}
      />
    </div>
  );
}