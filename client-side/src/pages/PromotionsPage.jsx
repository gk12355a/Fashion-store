import React, { useState, useEffect } from "react"; // Thêm useEffect
import api from "../api"; // Import api.js
import SearchBar from "../components/Promotion/SearchBar";
import PromotionTable from "../components/Promotion/PromotionTable";
import Pagination from "../components/Promotion/Pagination";
import PromotionForm from "../components/Promotion/PromotionForm";
// import { initialPromotions } from "../components/Promotion/promotions"; // 1. Xóa data giả
import "../styles/FeaturePage.css";

export default function PromotionPage() {
  const [promotions, setPromotions] = useState([]); // 2. Bắt đầu mảng rỗng
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // State cho debounce
  const [sortField, setSortField] = useState("name"); // Sort theo tên mặc định
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  // 3. Đổi tên state cho gần DTO (discount -> discountValue, expiry -> expiryDate)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    discountValue: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0); // 4. State cho tổng số trang

  // 5. HÀM TẢI DỮ LIỆU (GET)
  // 5. HÀM TẢI DỮ LIỆU (GET) - ĐÃ SỬA
  const fetchPromotions = async () => {
    try {
      let response;
      let params = {};
      let endpoint = "/promotions"; // Mặc định là endpoint chính

      // --- SỬA LẠI LOGIC GỌI API ---
      if (debouncedSearch) {
        // 1. NẾU CÓ TÌM KIẾM:
        endpoint = "/promotions/search"; // Đổi endpoint
        params = {
          keyword: debouncedSearch,
          page: currentPage - 1, // Vẫn gửi page (API search nhận Pageable)
          size: itemsPerPage,
          // Có thể gửi sort nếu API search hỗ trợ
          // sort: `${sortField},${sortOrder}`,
        };
      } else {
        // 2. NẾU KHÔNG TÌM KIẾM:
        params = {
          page: currentPage - 1,
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`,
        };
      }

      // Gọi API với endpoint và params đã xác định
      response = await api.get(endpoint, { params });

      // Cả hai endpoint đều trả về cấu trúc Page, xử lý giống nhau
      setPromotions(response.data.content);
      setTotalPages(response.data.totalPages);

      // Reset về trang 1 nếu kết quả search chỉ có 1 trang (hoặc ít hơn trang hiện tại)
      if (debouncedSearch && currentPage > response.data.totalPages) {
        setCurrentPage(1);
      }
      // --- KẾT THÚC SỬA ---
    } catch (error) {
      console.error("Lỗi khi tải danh sách khuyến mãi:", error);
      setPromotions([]);
      setTotalPages(0);
    }
  };

  // 6. DEBOUNCE EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 7. FETCH EFFECT
  useEffect(() => {
    fetchPromotions();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 8. XÓA LOGIC FILTER/SORT/PAGINATE CŨ
  // ... (Đã xóa filteredPromotions, paginated) ...

  const handleSort = (field) => {
    // Chỉ sort khi không tìm kiếm (nếu API search không hỗ trợ sort)
    if (debouncedSearch) return;

    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 9. SỬA VALIDATE cho khớp tên state (discountValue, expiryDate)
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên KM không được để trống";
    if (!formData.type.trim()) newErrors.type = "Loại không được để trống";
    // Sửa tên field
    if (formData.discountValue === "" || Number(formData.discountValue) < 0)
      newErrors.discountValue = "Giảm giá phải ≥ 0";
    if (!formData.expiryDate)
      newErrors.expiryDate = "Thời hạn không được để trống"; // Sửa tên field
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 10. HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) return;

    // Map form state sang DTO backend (tên đã khớp)
    const requestData = {
      name: formData.name,
      type: formData.type,
      discountValue: Number(formData.discountValue),
      expiryDate: formData.expiryDate, // Giữ dạng YYYY-MM-DD
    };

    try {
      if (editingPromotion) {
        // --- PUT (Sửa) ---
        await api.put(`/promotions/${editingPromotion.id}`, requestData);
      } else {
        // --- POST (Thêm mới) ---
        await api.post("/promotions", requestData);
      }
      fetchPromotions(); // Tải lại
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu khuyến mãi:", error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    // Reset form (khớp tên state)
    setFormData({ name: "", type: "", discountValue: "", expiryDate: "" });
    setErrors({});
    setShowModal(true);
  };

  // Map DTO từ API sang Form state
  const handleEdit = (p) => {
    setEditingPromotion(p);
    setFormData({
      name: p.name,
      type: p.type,
      discountValue: p.discountValue, // Khớp tên DTO
      expiryDate: p.expiryDate, // Khớp tên DTO
    });
    setErrors({});
    setShowModal(true);
  };

  // 11. HÀM XÓA (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
      try {
        await api.delete(`/promotions/${id}`);
        fetchPromotions(); // Tải lại
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách khuyến mãi</h2>
      <SearchBar
        search={search}
        setSearch={setSearch}
        onAddNew={handleAddNew}
      />{" "}
      {/* Sửa prop onAdd -> onAddNew */}
      <PromotionTable
        promotions={promotions} // Dùng data từ state
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Sửa prop
      />
      <PromotionForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => {
          setShowModal(false);
          setEditingPromotion(null);
        }}
        editing={editingPromotion}
      />
    </div>
  );
}
