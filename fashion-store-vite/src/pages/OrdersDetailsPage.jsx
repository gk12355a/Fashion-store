import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import SearchBar from "../components/OrderDetail/SearchBarOrderDetail";
import OrderDetailTable from "../components/OrderDetail/OrderDetailTable";
import OrderDetailToolbar from "../components/OrderDetail/OrderDetailToolbar"; // Import Toolbar mới
import OrderDetailForm from "../components/OrderDetail/OrderDetailForm";
import LoadingSpinner from "../components/LoadingSpinner";
// import "../styles/FeaturePage.css"; // <- ĐÃ XÓA
import { toast } from "react-toastify"; // Import Toastify

export default function OrderDetailsPage() {
  // --- State cho dữ liệu bảng và phân trang/sắp xếp ---
  const [orderDetails, setOrderDetails] = useState([]);
  const [sortField, setSortField] = useState("id"); // Sort theo ID mặc định
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // --- State cho tìm kiếm ---
  const [search, setSearch] = useState(""); // Input từ search bar
  const [debouncedSearch, setDebouncedSearch] = useState(search); // Giá trị search sau debounce

  // --- State cho Modal ---
  const [showModal, setShowModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null); // Lưu trữ object đang sửa
  // State cho dữ liệu trong Form (Modal)
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
  });
  const [errors, setErrors] = useState({}); // State lưu lỗi validation
  const [loading, setLoading] = useState(true); // Loading state

  // --- Hàm Fetch Dữ liệu (Gọi API GET /order-details hoặc /order-details/search) ---
  const fetchOrderDetails = async () => {
    try {
      let response;
      let params = {}; // Tham số gửi lên API

      if (debouncedSearch) {
        // --- NẾU CÓ TÌM KIẾM ---
        const potentialId = parseInt(debouncedSearch);
        if (!isNaN(potentialId)) {
          // Chỉ tìm theo Mã Đơn Hàng (ưu tiên)
          params.orderId = potentialId;
        } else {
          // Nếu không phải số, không tìm gì cả (hoặc có thể tìm theo tên SP nếu muốn)
          setOrderDetails([]);
          setTotalPages(0);
          toast.info("Vui lòng nhập Mã Đơn Hàng (số) để tìm kiếm.");
          setLoading(false);
          return; // Dừng hàm
        }

        // Gọi API Search
        response = await api.get("/order-details/search", { params });
        setOrderDetails(response.data); // API search trả về List DTO
        setTotalPages(1); // Search chỉ có 1 trang kết quả
        setCurrentPage(1); // Về trang 1
      } else {
        // --- NẾU KHÔNG TÌM KIẾM (Lấy danh sách phân trang) ---
        params = {
          page: currentPage - 1, // API đánh số trang từ 0
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`, // Ghép trường sort và thứ tự
        };

        // Gọi API lấy tất cả
        response = await api.get("/order-details", { params });
        setOrderDetails(response.data.content); // Lấy mảng dữ liệu
        setTotalPages(response.data.totalPages); // Lấy tổng số trang
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      toast.error("Không thể tải danh sách chi tiết đơn hàng!");
      setOrderDetails([]); // Reset bảng nếu lỗi
      setTotalPages(0);
      setLoading(false);
    }
  };

  // --- UseEffect Hooks ---

  // Debounce cho Search Bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Về trang 1 khi thay đổi tìm kiếm
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch dữ liệu khi các tham số thay đổi
  useEffect(() => {
    setLoading(true);
    fetchOrderDetails();
  }, [currentPage, sortField, sortOrder, debouncedSearch]); // Chạy lại khi các giá trị này thay đổi

  // --- Các Hàm Xử Lý Sự Kiện ---

  // Hàm được gọi khi input trong Form thay đổi
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Dùng functional update để không phụ thuộc vào state `formData` bên ngoài
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Hàm kiểm tra lỗi validation trước khi Lưu
  const validate = () => {
    const newErrors = {};
    if (!formData.orderId)
      newErrors.orderId = "Mã đơn hàng không được để trống.";
    if (!formData.productId)
      newErrors.productId = "Vui lòng chọn hoặc nhập mã sản phẩm.";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0.";
    // Khi Thêm mới, vẫn cần giá (dù đã tự điền) để gửi lên API POST
    if (
      !editingDetail &&
      (formData.unitPrice === "" || Number(formData.unitPrice) < 0)
    ) {
      newErrors.unitPrice = "Đơn giá không hợp lệ.";
    }
    // Khi Sửa, backend chỉ nhận quantity, không cần validate giá ở đây
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Hàm xử lý khi bấm nút Lưu trong Form (Modal)
  const handleSave = async () => {
    if (!validate()) {
      // Kiểm tra lỗi trước
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      let actionText = "";
      if (editingDetail) {
        // --- PUT (Sửa) ---
        // Chỉ gửi số lượng (theo yêu cầu API backend)
        const updateData = { quantity: Number(formData.quantity) };
        await api.put(`/order-details/${editingDetail.id}`, updateData);
        actionText = "Cập nhật";
      } else {
        // --- POST (Thêm mới) ---
        // Gửi đủ thông tin (API backend sẽ tự lấy giá nếu không gửi, nhưng ta đã có)
        const requestData = {
          orderId: Number(formData.orderId),
          productId: Number(formData.productId),
          quantity: Number(formData.quantity),
          // unitPrice: Number(formData.unitPrice), // Không cần gửi, backend tự lấy
        };
        await api.post("/order-details", requestData);
        actionText = "Thêm mới";
      }
      fetchOrderDetails(); // Tải lại danh sách
      setShowModal(false); // Đóng modal
      toast.success(`${actionText} chi tiết đơn hàng thành công!`);
    } catch (error) {
      console.error("Lỗi khi lưu chi tiết đơn hàng:", error);
      // Hiển thị lỗi từ backend (nếu có) hoặc lỗi chung
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  // Mở modal Thêm mới
  const handleAddNew = () => {
    setEditingDetail(null); // Đảm bảo không ở trạng thái sửa
    // Reset form về rỗng
    setFormData({ orderId: "", productId: "", quantity: "", unitPrice: "" });
    setErrors({}); // Xóa lỗi cũ
    setShowModal(true); // Mở modal
  };

  // Mở modal Sửa và điền dữ liệu cũ vào form
  const handleEdit = (detail) => {
    setEditingDetail(detail); // Lưu lại object đang sửa
    // Điền dữ liệu của object vào state formData
    setFormData({
      orderId: detail.orderId,
      productId: detail.productId,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
    });
    setErrors({}); // Xóa lỗi cũ
    setShowModal(true); // Mở modal
  };

  // Xử lý Xóa
  const handleDelete = async (id) => {
    // Hiện thông báo xác nhận
    if (
      window.confirm(
        "Bạn có chắc muốn xóa chi tiết đơn này không? Thao tác này sẽ cập nhật lại Tổng tiền Đơn hàng và Hoàn kho Sản phẩm."
      )
    ) {
      try {
        await api.delete(`/order-details/${id}`); // Gọi API DELETE
        fetchOrderDetails(); // Tải lại danh sách
        toast.success("Xóa chi tiết đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Hàm đóng modal (cho nút Hủy)
  const handleCancel = () => {
    setShowModal(false);
    setEditingDetail(null); // Reset trạng thái sửa
  };

  // --- JSX Render ---
  return loading ? (
    <LoadingSpinner />
  ) : (
    // THAY ĐỔI 1: Áp dụng padding 'p-5'
    <div className="p-5">
      {/* THAY ĐỔI 2: Thêm class Tailwind cho H2 */}
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách chi tiết đơn hàng
      </h2>

      {/* Thanh tìm kiếm */}
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      {/* Thanh công cụ (Sắp xếp, Phân trang) */}
      <OrderDetailToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Bảng danh sách */}
      <OrderDetailTable
        orderDetails={orderDetails}
        handleEdit={handleEdit} // Prop để mở modal sửa
        handleDelete={handleDelete} // Prop để xóa
      />

      {/* Modal Form (Thêm/Sửa) */}
      <OrderDetailForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange} // Truyền hàm cập nhật state
        onSave={handleSave} // Truyền hàm lưu
        onCancel={handleCancel} // Truyền hàm hủy
        editing={!!editingDetail} // Truyền trạng thái đang sửa (true/false)
      />
    </div>
  );
}
