import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Checkout/SearchBarPayment";
import PaymentTable from "../components/Checkout/PaymentTable";
import PaymentToolbar from "../components/Checkout/PaymentToolbar"; // Import Toolbar mới
import PaymentForm from "../components/Checkout/PaymentForm";
import Loading from "../components/Loading"; // <-- 1. IMPORT COMPONENT LOADING
import { toast } from 'react-toastify'; // Import Toastify

export default function CheckoutPage() {
  // --- State cho dữ liệu bảng và phân trang/sắp xếp ---
  const [payments, setPayments] = useState([]);
  const [sortField, setSortField] = useState("paymentDate"); // Sort theo ngày TT mặc định
  const [sortOrder, setSortOrder] = useState("desc"); // Mới nhất lên trước
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // --- State cho tìm kiếm ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [suggestions, setSuggestions] = useState([]);

  // --- State cho Modal ---
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null); // Lưu object đang sửa
  // State cho dữ liệu Form (khớp với logic Form mới)
  const [formData, setFormData] = useState({
    orderId: "",        // Chỉ dùng khi Thêm mới
    paymentMethod: "",  // Dùng cho cả Thêm mới và Sửa
    staffId: "",        // Chỉ dùng khi Thêm mới
    displayAmount: "",      // Chỉ để hiển thị khi Sửa
    displayPaymentDate: "", // Chỉ để hiển thị khi Sửa
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // <-- 2. THÊM STATE LOADING

  // --- Hàm Fetch Dữ liệu ---
  const fetchPayments = async () => {
    try {
      let response;
      let params = {}; // Tham số gửi lên API

      if (debouncedSearch) {
        // --- LOGIC GỌI API SEARCH ---
        const potentialId = parseInt(debouncedSearch);
        if (!isNaN(potentialId)) {
          params.orderId = potentialId; // Gửi orderId nếu là số
        } else {
          params.paymentMethod = debouncedSearch; // Gửi paymentMethod nếu là chữ
        }
        response = await api.get("/payments/search", { params }); // Gọi endpoint /search
        setPayments(response.data); // API search trả về List
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
      setLoading(false); // <-- 3. SET LOADING = FALSE KHI THÀNH CÔNG
    } catch (error) {
      console.error("Lỗi khi tải danh sách thanh toán:", error);
      toast.error("Không thể tải danh sách thanh toán!"); // Thêm Toast
      setPayments([]);
      setTotalPages(0);
      setLoading(false); // <-- 4. SET LOADING = FALSE KHI LỖI
    }
  };
  // --- 2. useEffect MỚI CHO AUTOCOMPLETE ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Chỉ tìm gợi ý nếu không phải là số (là payment method)
      if (search.trim() !== "" && isNaN(Number(search))) {
        try {
          const response = await api.get("/payments/methods/autocomplete", {
            params: { q: search },
          });
          setSuggestions(response.data || []);
        } catch (error) {
          console.error("Lỗi khi tải gợi ý phương thức TT:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]); // Xóa gợi ý nếu là số hoặc rỗng
      }
    };
    // Debounce nhẹ
    const suggestionTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(suggestionTimer);
  }, [search]); // Chạy khi search thay đổi
  // ------------------------------------

  // --- 3. HÀM XỬ LÝ GỢI Ý ---
  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion); // Điền gợi ý vào ô search
    setSuggestions([]);    // Ẩn danh sách
  };

  const handleSearchBlur = () => {
    // Delay để click kịp chạy
    setTimeout(() => setSuggestions([]), 150);
  };
  // ---------------------------

  // --- UseEffect Hooks ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true); // <-- 5. SET LOADING = TRUE TRƯỚC KHI GỌI API
    fetchPayments();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); // Chạy lại khi các giá trị này thay đổi

  // --- Các Hàm Xử Lý Sự Kiện ---
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    // Chỉ validate trường cần gửi đi
    if (!editingPayment) { // Chỉ khi thêm mới
      if (!formData.orderId || Number(formData.orderId) <= 0)
        newErrors.orderId = "Mã đơn hàng hợp lệ là bắt buộc.";
      if (!formData.staffId || Number(formData.staffId) <= 0)
        newErrors.staffId = "Mã nhân viên hợp lệ là bắt buộc.";
    }
    // Luôn validate phương thức
    if (!formData.paymentMethod) // Select box chỉ cần check rỗng
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      let actionText = "";
      if (editingPayment) {
        // --- PUT (Sửa) ---
        // Chỉ gửi paymentMethod
        await api.put(`/payments/${editingPayment.id}`, {
          paymentMethod: formData.paymentMethod,
        });
        actionText = "Cập nhật";
      } else {
        // --- POST (Thêm mới) ---
        // Gửi orderId, paymentMethod, staffId
        await api.post("/payments", {
          orderId: Number(formData.orderId),
          paymentMethod: formData.paymentMethod,
          staffId: Number(formData.staffId),
        });
        actionText = "Thêm mới";
      }
      fetchPayments(); // Tải lại danh sách
      setShowModal(false); // Đóng modal
      toast.success(`${actionText} thanh toán thành công!`); // Thêm Toast

    } catch (error) {
      console.error("Lỗi khi lưu thanh toán:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`); // Thêm Toast
    }
  };

  const handleAddNew = () => {
    setEditingPayment(null);
    // Reset form
    setFormData({
      orderId: "", paymentMethod: "", staffId: "",
      displayAmount: "", displayPaymentDate: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Mở modal Sửa và điền dữ liệu
  const handleEdit = (payment) => {
    setEditingPayment(payment);
    // Điền dữ liệu vào form state
    setFormData({
      orderId: payment.orderId,          // Để hiển thị
      paymentMethod: payment.paymentMethod, // Để sửa
      staffId: payment.staff?.id || "",   // Để hiển thị (nếu có)
      displayAmount: payment.amount,        // Để hiển thị
      displayPaymentDate: payment.paymentDate, // Để hiển thị
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thanh toán này không?")) {
      try {
        await api.delete(`/payments/${id}`);
        fetchPayments(); // Tải lại
        toast.success("Xóa thanh toán thành công!"); // Thêm Toast
      } catch (error) {
        console.error("Lỗi khi xóa thanh toán:", error);
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`); // Thêm Toast
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingPayment(null);
  };

  // --- JSX Render ---
  // <-- 6. THÊM BIỂU THỨC ĐIỀU KIỆN (TERNARY) ĐỂ HIỂN THỊ LOADING -->
  return loading ? (
    <Loading />
  ) : (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách thanh toán
      </h2>

      {/* Thanh tìm kiếm */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        onAdd={handleAddNew}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        onBlur={handleSearchBlur}
      />

      {/* Thanh công cụ (Sắp xếp, Phân trang) */}
      <PaymentToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Bảng danh sách */}
      <PaymentTable
        payments={payments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal Form (Thêm/Sửa) */}
      <PaymentForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={handleCancel}
        editing={!!editingPayment}
      />
    </div>
  );
}