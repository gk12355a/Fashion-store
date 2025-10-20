import React, { useState, useEffect } from "react"; // Thêm useEffect
import api from "../api"; // Import api.js
import SearchBar from "../components/Checkout/SearchBar"; // Đổi tên component SearchBar nếu cần
import PaymentTable from "../components/Checkout/PaymentTable";
import Pagination from "../components/Checkout/Pagination";
// import { initialPayments } from '../components/Checkout/payments'; // 1. Xóa data giả
import PaymentForm from "../components/Checkout/PaymentForm";
import "../styles/FeaturePage.css";

export default function CheckoutPage() {
  const [payments, setPayments] = useState([]); // 2. Bắt đầu mảng rỗng
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // State cho debounce
  const [sortField, setSortField] = useState("paymentDate"); // Sort theo ngày TT mặc định
  const [sortOrder, setSortOrder] = useState("desc"); // Mới nhất lên trước
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  // 3. Sửa formData cho khớp CreatePaymentRequest + UpdatePaymentRequest
  const [formData, setFormData] = useState({
    orderId: "", // ID số của đơn hàng
    paymentMethod: "", // Phương thức (text)
    staffId: "", // ID số của nhân viên (chỉ khi tạo mới)
    // Các trường amount, paymentDate chỉ dùng để hiển thị khi sửa
    displayAmount: "",
    displayPaymentDate: "",
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0); // 4. State cho tổng số trang

  // 5. HÀM TẢI DỮ LIỆU (GET)
  const fetchPayments = async () => {
    try {
      let response;
      let params = {};

      if (debouncedSearch) {
        // --- LOGIC GỌI API SEARCH ---
        const potentialId = parseInt(debouncedSearch);
        if (!isNaN(potentialId)) {
          params.orderId = potentialId; // Gửi orderId nếu là số
        } else {
          // --- SỬA TÊN THAM SỐ Ở ĐÂY ---
          params.paymentMethod = debouncedSearch; // 'method' -> 'paymentMethod'
          // --------------------------
        }
        response = await api.get("/payments/search", { params }); // Gọi endpoint /search
        setPayments(response.data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        // --- LOGIC GỌI API LẤY TẤT CẢ (PHÂN TRANG) ---
        params = {
          page: currentPage - 1,
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`,
        };
        response = await api.get("/payments", { params }); // Gọi endpoint chính
        setPayments(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách thanh toán:", error);
      setPayments([]);
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
    fetchPayments();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 8. XÓA LOGIC FILTER/SORT/PAGINATE CŨ
  // ... (Đã xóa filteredPayments, paginated) ...

  const handleSort = (field) => {
    // Chỉ sort khi không tìm kiếm (nếu API search không hỗ trợ)
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

  // 9. SỬA VALIDATE cho logic backend mới
  const validate = () => {
    const newErrors = {};
    // Chỉ cần validate các trường gửi đi
    if (!editingPayment) {
      // Chỉ kiểm tra khi thêm mới
      if (
        !formData.orderId ||
        isNaN(Number(formData.orderId)) ||
        Number(formData.orderId) <= 0
      )
        newErrors.orderId = "Mã đơn hàng hợp lệ là bắt buộc";
      if (
        !formData.staffId ||
        isNaN(Number(formData.staffId)) ||
        Number(formData.staffId) <= 0
      )
        newErrors.staffId = "Mã nhân viên hợp lệ là bắt buộc";
    }
    // Luôn kiểm tra phương thức
    if (!formData.paymentMethod?.trim())
      newErrors.paymentMethod = "Phương thức không được để trống";

    // Bỏ validate amount, date, orderCode
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 10. HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingPayment) {
        // --- PUT (Sửa) ---
        // Chỉ gửi paymentMethod theo logic backend
        await api.put(`/payments/${editingPayment.id}`, {
          paymentMethod: formData.paymentMethod,
        });
      } else {
        // --- POST (Thêm mới) ---
        // Gửi orderId, paymentMethod, staffId
        await api.post("/payments", {
          orderId: Number(formData.orderId),
          paymentMethod: formData.paymentMethod,
          staffId: Number(formData.staffId),
        });
      }
      fetchPayments(); // Tải lại
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu thanh toán:", error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`); // Hiển thị lỗi rõ hơn
    }
  };

  const handleAddNew = () => {
    setEditingPayment(null);
    // Reset form cho các trường cần nhập
    setFormData({
      orderId: "",
      paymentMethod: "",
      staffId: "",
      displayAmount: "",
      displayPaymentDate: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Map data từ API (response) sang Form state (để hiển thị)
  const handleEdit = (p) => {
    setEditingPayment(p);
    setFormData({
      orderId: p.orderId, // Để hiển thị (disabled)
      paymentMethod: p.paymentMethod, // Cho phép sửa
      staffId: p.staff?.id || "", // Để hiển thị (disabled) - Giả sử API trả về staff object
      displayAmount: p.amount, // Để hiển thị (disabled)
      displayPaymentDate: p.paymentDate, // Để hiển thị (disabled)
    });
    setErrors({});
    setShowModal(true);
  };

  // 11. HÀM XÓA (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thanh toán này không?")) {
      try {
        await api.delete(`/payments/${id}`);
        fetchPayments(); // Tải lại
      } catch (error) {
        console.error("Lỗi khi xóa thanh toán:", error);
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách thanh toán</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <PaymentTable
        payments={payments} // Dùng data từ state
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
      <PaymentForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => {
          setShowModal(false);
          setEditingPayment(null);
        }}
        editing={editingPayment}
      />
    </div>
  );
}
