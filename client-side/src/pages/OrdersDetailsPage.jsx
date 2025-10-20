import React, { useState, useEffect } from "react"; // Thêm useEffect
import api from "../api"; // Import api.js
import SearchBar from "../components/OrderDetail/SearchBar";
import OrderDetailTable from "../components/OrderDetail/OrderDetailTable";
import Pagination from "../components/OrderDetail/Pagination";
import OrderDetailForm from "../components/OrderDetail/OrderDetailForm";
// import { initialOrderDetails } from "../components/OrderDetail/orderDetails"; // 1. Xóa data giả
import "../styles/FeaturePage.css";

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState([]); // 2. Bắt đầu mảng rỗng
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // State cho debounce
  const [sortField, setSortField] = useState("id"); // Sort theo ID mặc định
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [formData, setFormData] = useState({ orderId: "", productId: "", quantity: "", unitPrice: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0); // 3. State cho tổng số trang

  // 4. HÀM TẢI DỮ LIỆU (GET)
  const fetchOrderDetails = async () => {
    try {
      let response;
      let params = {};

      if (debouncedSearch) {
        // --- LOGIC GỌI API SEARCH ---
        const potentialId = parseInt(debouncedSearch);
        if (!isNaN(potentialId)) {
           params.orderId = potentialId;
           params.productId = potentialId;
        } else {
          setOrderDetails([]);
          setTotalPages(0);
          return;
        }

        response = await api.get("/order-details/search", { params });

        // --- BỎ ĐOẠN MAP ---
        // Giờ API trả về đúng cấu trúc DTO rồi
        setOrderDetails(response.data);
        // ------------------
        setTotalPages(1);
        setCurrentPage(1);

      } else {
        // --- LOGIC GỌI API LẤY TẤT CẢ (PHÂN TRANG) ---
        params = {
          page: currentPage - 1,
          size: itemsPerPage,
          sort: `${sortField},${sortOrder}`,
        };
        response = await api.get("/order-details", { params });
        setOrderDetails(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      setOrderDetails([]);
      setTotalPages(0);
    }
  };
  // 5. DEBOUNCE EFFECT (Giống các trang khác)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 6. FETCH EFFECT (Giống các trang khác)
  useEffect(() => {
    fetchOrderDetails();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 7. XÓA LOGIC FILTER/SORT/PAGINATE CŨ (filteredDetails, paginated)
  // ... (Đã xóa) ...

  const handleSort = (field) => {
    // Chỉ sort khi không tìm kiếm (vì API search không hỗ trợ sort)
    if (debouncedSearch) return;

    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
    setCurrentPage(1); // Về trang 1 khi sort
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validate giữ nguyên vì khớp với form hiện tại
  const validate = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = "Mã đơn không được để trống";
    if (!formData.productId) newErrors.productId = "Mã SP không được để trống";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải > 0";
    // Vẫn validate unitPrice vì backend yêu cầu
    if (formData.unitPrice === "" || Number(formData.unitPrice) < 0) newErrors.unitPrice = "Đơn giá phải ≥ 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 8. HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) return;

    // Chuẩn bị data gửi đi (khớp với DTO backend)
    const requestData = {
      orderId: Number(formData.orderId),
      productId: Number(formData.productId),
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
    };

    // Dữ liệu cho PUT (chỉ quantity và unitPrice)
    const updateData = {
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
    };

    try {
      if (editingDetail) {
        // --- PUT (Sửa) ---
        await api.put(`/order-details/${editingDetail.id}`, updateData);
      } else {
        // --- POST (Thêm mới) ---
        await api.post("/order-details", requestData);
      }
      fetchOrderDetails(); // Tải lại
      setShowModal(false);

    } catch (error) {
      console.error("Lỗi khi lưu chi tiết đơn hàng:", error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddNew = () => {
    setEditingDetail(null);
    setFormData({ orderId: "", productId: "", quantity: "", unitPrice: "" });
    setErrors({});
    setShowModal(true);
  };

  // Map data từ API (response) sang Form state
  const handleEdit = (d) => {
    setEditingDetail(d);
    setFormData({
        orderId: d.orderId,
        productId: d.productId,
        quantity: d.quantity,
        unitPrice: d.unitPrice
    });
    setErrors({});
    setShowModal(true);
  };

  // 9. HÀM XÓA (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chi tiết đơn này không? Thao tác này sẽ cập nhật lại Tổng tiền Đơn hàng và Hoàn kho Sản phẩm.")) {
      try {
        await api.delete(`/order-details/${id}`);
        fetchOrderDetails(); // Tải lại
      } catch (error) {
        console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách chi tiết đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />
      <OrderDetailTable
        orderDetails={orderDetails} // Dùng data từ state
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        // Sửa prop name cho khớp
        onPageChange={setCurrentPage} 
      />
      <OrderDetailForm
        show={showModal}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => {setShowModal(false); setEditingDetail(null);}}
        editing={editingDetail}
      />
    </div>
  );
}