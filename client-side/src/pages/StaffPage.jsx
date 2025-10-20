import React, { useState, useEffect } from "react"; // Thêm useEffect
import api from "../api"; // Import api.js
import SearchBar from "../components/Staff/SearchBar"; // Đổi tên component SearchBar nếu cần
import StaffTable from "../components/Staff/StaffTable";
import Pagination from "../components/Staff/Pagination";
// import { initialStaffs } from "../components/Staff/staff"; // 1. Xóa data giả
import StaffForm from "../components/Staff/StaffForm";
import "../styles/FeaturePage.css";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]); // 2. Bắt đầu mảng rỗng
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // State cho debounce
  const [sortField, setSortField] = useState("name"); // Sort theo tên mặc định
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  // Đổi tên state cho khớp DTO backend (shift -> workShift)
  const [formData, setFormData] = useState({ name: "", position: "", salary: "", workShift: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0); // 3. State cho tổng số trang

  // 4. HÀM TẢI DỮ LIỆU (GET) - ĐÃ SỬA
  const fetchStaffs = async () => {
    try {
      let response;
      let params = {}; // Initialize params object

      // --- SỬA LẠI LOGIC GỌI API ---
      if (debouncedSearch) {
        // 1. NẾU CÓ TÌM KIẾM: Gọi endpoint /staffs/search với 'keyword'
        params = {
          keyword: debouncedSearch,
        };
        response = await api.get("/staffs/search", { params }); // <-- Sửa endpoint và dùng params

        // API search trả về MẢNG (Array)
        setStaffs(response.data);
        setTotalPages(1); // Assume search doesn't paginate
        setCurrentPage(1);

      } else {
        // 2. NẾU KHÔNG TÌM KIẾM: Gọi endpoint /staffs (phân trang)
        params = { // Define params here
          page: currentPage - 1,
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`,
        };
        response = await api.get("/staffs", { params }); // <-- Sửa endpoint và dùng params

        // API này trả về ĐỐI TƯỢNG (Page)
        setStaffs(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      // --- KẾT THÚC SỬA ---

    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      setStaffs([]);
      setTotalPages(0);
    }
  };

  // ... (Rest of the component: useEffects, handleSort, handleSave, etc.) ...
  // **Effect for debouncing search input**
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 when search term changes
    }, 500); // 500ms delay
    return () => clearTimeout(timer); // Cleanup timer on unmount or if search changes again
  }, [search]);

  // **Effect to fetch data when dependencies change**
  useEffect(() => {
    fetchStaffs();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); // Refetch when page, sort, or debounced search changes

  // **Handler for table sorting**
  const handleSort = (field) => {
    // Only allow sorting when NOT searching (if search API doesn't support it)
    if (debouncedSearch) return;

    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Go to first page when sorting changes
  };

  // **Handler for form input changes**
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // **Validation logic for the form**
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.position.trim()) newErrors.position = "Chức vụ không được để trống";
    if (formData.salary === "" || Number(formData.salary) < 0) newErrors.salary = "Lương phải ≥ 0";
    if (!formData.workShift) newErrors.workShift = "Vui lòng chọn ca làm việc"; // Corrected field name
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // **Handler for saving new or edited staff**
  const handleSave = async () => {
    if (!validate()) return;

    // Map form state to backend DTO (names match)
    const requestData = {
      name: formData.name,
      position: formData.position,
      salary: Number(formData.salary),
      workShift: formData.workShift // Names already match
    };

    try {
      if (editingStaff) {
        // PUT request
        await api.put(`/staffs/${editingStaff.id}`, requestData); // <-- Sửa endpoint
      } else {
        // POST request
        await api.post("/staffs", requestData); // <-- Sửa endpoint
      }
      fetchStaffs(); // Reload data
      setShowModal(false);

    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

 // **Handler for opening the "Add New" modal**
  const handleAddNew = () => {
    setEditingStaff(null);
    setFormData({ name: "", position: "", salary: "", workShift: "" }); // Use correct field name
    setErrors({});
    setShowModal(true);
  };

  // **Handler for opening the "Edit" modal**
  const handleEdit = (s) => {
    setEditingStaff(s);
    // Map API DTO to form state
    setFormData({
      name: s.name,
      position: s.position,
      salary: s.salary,
      workShift: s.workShift // Use correct field name
    });
    setErrors({});
    setShowModal(true);
  };

  // **Handler for deleting staff**
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không? Lưu ý: Hành động này có thể bị chặn nếu nhân viên đã thực hiện thanh toán.")) {
      try {
        await api.delete(`/staffs/${id}`); // <-- Sửa endpoint
        fetchStaffs(); // Reload data
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        alert(`Lỗi: ${error.response?.data?.message || 'Có thể nhân viên đã liên kết với thanh toán hoặc có lỗi khác.'}`);
      }
    }
  };

 // **JSX Rendering**
  return (
    <div className="feature-page">
      <h2>Danh sách nhân viên</h2>
      <SearchBar search={search} setSearch={setSearch} onAddNew={handleAddNew} /> {/* Use onAddNew */}
      <StaffTable
        staffs={staffs}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Use correct prop name
      />
      <StaffForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => {setShowModal(false); setEditingStaff(null);}}
        editing={editingStaff}
      />
    </div>
  );
};