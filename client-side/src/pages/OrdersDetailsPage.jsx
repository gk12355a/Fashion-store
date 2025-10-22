import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/OrderDetail/SearchBar";
import OrderDetailTable from "../components/OrderDetail/OrderDetailTable";
// import Pagination from "../components/OrderDetail/Pagination"; // 1. Xóa Pagination cũ
import OrderDetailToolbar from "../components/OrderDetail/OrderDetailToolbar"; // 2. Import Toolbar mới
import OrderDetailForm from "../components/OrderDetail/OrderDetailForm";
import "../styles/FeaturePage.css";
import { toast } from 'react-toastify'; // 3. Import Toastify

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);
  const [formData, setFormData] = useState({ orderId: "", productId: "", quantity: "", unitPrice: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrderDetails = async () => {
    try {
      let response;
      let params = {};

      if (debouncedSearch) {
        // Logic search cũ (vẫn hoạt động)
        const potentialId = parseInt(debouncedSearch);
        if (!isNaN(potentialId)) {
           // Sửa logic: Chỉ tìm theo 1 trong 2
           // Giả sử ưu tiên tìm theo Mã Đơn Hàng
           params.orderId = potentialId; 
           // params.productId = potentialId; // Bỏ dòng này
        } else {
          setOrderDetails([]);
          setTotalPages(0);
          return;
        }
        response = await api.get("/order-details/search", { params });
        setOrderDetails(response.data);
        setTotalPages(1);
        setCurrentPage(1);

      } else {
        // Logic lấy tất cả (dùng toolbar)
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
      toast.error("Không thể tải chi tiết đơn hàng!"); // 4. Thêm Toast
      setOrderDetails([]);
      setTotalPages(0);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchOrderDetails();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 5. XÓA hàm handleSort cũ
  // const handleSort = (field) => { ... };

  // 6. Cập nhật handleChange (vẫn giữ nguyên)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 7. Cập nhật Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = "Mã đơn không được để trống";
    // Kiểm tra Mã SP (đã được điền tự động)
    if (!formData.productId) newErrors.productId = "Vui lòng chọn một sản phẩm";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải > 0";
    
    // Khi Thêm mới, không cần validate unitPrice (vì nó tự điền)
    if (editingDetail && (formData.unitPrice === "" || Number(formData.unitPrice) < 0)) {
        // (Khi Sửa, chúng ta chỉ cho sửa Số lượng, nên bỏ qua validate giá)
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 8. Cập nhật HÀM LƯU (POST / PUT)
  const handleSave = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      let actionText = "";
      if (editingDetail) {
        // --- PUT (Sửa) ---
        // Backend (OrderDetailServiceImpl) chỉ cho phép sửa Số lượng
        const updateData = {
          quantity: Number(formData.quantity),
        };
        await api.put(`/order-details/${editingDetail.id}`, updateData);
        actionText = "Cập nhật";
      } else {
        // --- POST (Thêm mới) ---
        // Backend (OrderDetailServiceImpl) sẽ tự lấy giá nếu unitPrice không được gửi
        // Nhưng form của chúng ta đã tự động điền giá rồi.
        const requestData = {
          orderId: Number(formData.orderId),
          productId: Number(formData.productId),
          quantity: Number(formData.quantity),
          // unitPrice: Number(formData.unitPrice), // Gửi giá đã tự động điền
        };
        await api.post("/order-details", requestData);
        actionText = "Thêm mới";
      }
      fetchOrderDetails();
      setShowModal(false);
      toast.success(`${actionText} chi tiết đơn hàng thành công!`); // Thêm Toast

    } catch (error) {
      console.error("Lỗi khi lưu chi tiết đơn hàng:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddNew = () => {
    setEditingDetail(null);
    setFormData({ orderId: "", productId: "", quantity: "", unitPrice: "" });
    setErrors({});
    setShowModal(true);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chi tiết đơn này?")) {
      try {
        await api.delete(`/order-details/${id}`);
        fetchOrderDetails();
        toast.success("Xóa chi tiết đơn hàng thành công!"); // Thêm Toast
      } catch (error) {
        console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="feature-page">
      <h2>Danh sách chi tiết đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      {/* 9. Thêm Toolbar mới */}
      <OrderDetailToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <OrderDetailTable
        orderDetails={orderDetails}
        // 10. Xóa props sort cũ
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      
      {/* 11. Xóa Pagination cũ */}
      {/* <Pagination ... /> */}
      
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