import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Order/SearchBarOrder";
import OrderList from "../components/Order/OrderList";
import OrderToolbar from "../components/Order/OrderToolbar";
import OrderForm from "../components/Order/OrderForm"; // "Smart Modal"
// import "../styles/FeaturePage.css"; // <- ĐÃ XÓA
import { toast } from "react-toastify";

// TẠO MỘT FORM RIÊNG BIỆT ĐỂ SỬA STATUS
// (Giữ nguyên component này, vì class của nó nằm trong Form.css)
const EditStatusForm = ({
  show,
  formData,
  onChange,
  onSave,
  onCancel,
  isSaving,
}) => {
  if (!show) return null;
  const orderStatuses = [
    "Đang chờ xử lý",
    "Đã xác nhận",
    "Đang giao",
    "Hoàn thành",
    "Đã hủy",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Cập nhật trạng thái đơn hàng (ID: {formData.id})</h2>
        <div className="form">
          <div className="form-group">
            <label>Trạng thái mới</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="">-- Chọn trạng thái --</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button className="save-btn" onClick={onSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Cập nhật"}
            </button>
            <button
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSaving}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// KẾT THÚC FORM SỬA STATUS

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortField, setSortField] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editFormData, setEditFormData] = useState({ id: null, status: "" });
  const [isSaving, setIsSaving] = useState(false);

  // --- SỬA HÀM fetchOrders ĐỂ GỌI API MỚI ---
  const fetchOrders = async () => {
    try {
      // 1. Chuẩn bị các tham số cơ bản
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sort: `${sortField},${sortOrder}`,
      };

      // 2. Phân tích 'debouncedSearch' để thêm tham số tìm kiếm
      if (debouncedSearch) {
        const dateMatch = debouncedSearch.match(
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        );

        if (dateMatch) {
          // --- NẾU LÀ NGÀY (DD/MM/YYYY) ---
          const day = dateMatch[1].padStart(2, "0");
          const month = dateMatch[2].padStart(2, "0");
          const year = dateMatch[3];
          // Chuyển sang YYYY-MM-DD
          params.orderDate = `${year}-${month}-${day}`;
        } else {
          const potentialId = parseInt(debouncedSearch);
          if (!isNaN(potentialId)) {
            // --- NẾU LÀ SỐ (Mã KH) ---
            params.customerId = potentialId;
          } else {
            // --- NẾU LÀ CHUỖI (Trạng thái) ---
            params.status = debouncedSearch;
          }
        }
      }

      // 3. Gọi API (chỉ 1 endpoint duy nhất)
      const response = await api.get("/orders", { params });

      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng!");
      setOrders([]);
      setTotalPages(0);
    }
  };
  // --- KẾT THÚC SỬA HÀM ---

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortField, sortOrder, debouncedSearch]);

  // 1. Lưu đơn hàng MỚI (Smart Modal)
  const handleSaveCreate = async (requestData) => {
    try {
      await api.post("/orders", requestData); // API POST mới
      fetchOrders();
      setShowCreateModal(false);
      toast.success("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  // 2. Lưu cập nhật Status (Edit Modal)
  const handleSaveEdit = async () => {
    if (!editFormData.status) {
      toast.error("Vui lòng chọn trạng thái.");
      return;
    }
    setIsSaving(true);
    try {
      await api.put(`/orders/${editFormData.id}`, {
        status: editFormData.status,
      });
      fetchOrders();
      setShowEditModal(false);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (order) => {
    setEditFormData({
      id: order.id,
      status: order.status,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
        toast.success("Xóa đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    // THAY ĐỔI 1: Áp dụng padding 'p-5'
    <div className="p-5">
      {/* THAY ĐỔI 2: Thêm class Tailwind cho H2 */}
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">
        Danh sách đơn hàng
      </h2>

      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      <OrderToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <OrderList
        orders={orders}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Modal Tạo Đơn Hàng (Smart Modal) */}
      <OrderForm
        show={showCreateModal}
        onSave={handleSaveCreate}
        onCancel={() => setShowCreateModal(false)}
      />

      {/* Modal Sửa Trạng Thái */}
      <EditStatusForm
        show={showEditModal}
        formData={editFormData}
        onChange={(e) =>
          setEditFormData({ ...editFormData, status: e.target.value })
        }
        onSave={handleSaveEdit}
        onCancel={() => setShowEditModal(false)}
        isSaving={isSaving}
      />
    </div>
  );
}