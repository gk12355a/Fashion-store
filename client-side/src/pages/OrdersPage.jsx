import React, { useState, useEffect } from "react";
import api from "../api";
import SearchBar from "../components/Order/SearchBar";
import OrderList from "../components/Order/OrderList";
import OrderToolbar from "../components/Order/OrderToolbar";
import OrderForm from "../components/Order/OrderForm"; // "Smart Modal"
import "../styles/FeaturePage.css";
import { toast } from "react-toastify";

// (Component EditStatusForm giữ nguyên...)
const EditStatusForm = ({ show, formData, onChange, onSave, onCancel, isSaving }) => {
  if (!show) return null;
  const orderStatuses = ["Đang chờ xử lý", "Đã xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Cập nhật trạng thái đơn hàng (ID: {formData.id})</h2>
        <div className="form">
          <div className="form-group">
            <label>Trạng thái mới</label>
            <select name="status" value={formData.status} onChange={onChange}>
              <option value="">-- Chọn trạng thái --</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button className="save-btn" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
            <button className="cancel-btn" onClick={onCancel} disabled={isSaving}>Hủy</button>
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
  
  // --- 1. STATE MỚI CHO DẢI NGÀY & EXPORT (ĐÃ THÊM DÒNG BỊ THIẾU) ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false); // <-- DÒNG BỊ THIẾU
  // -----------------------------------------------------------

  // --- 2. CẬP NHẬT fetchOrders ---
  const fetchOrders = async () => {
    try {
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        sort: `${sortField},${sortOrder}`,
      };
      if (debouncedSearch) {
        params.textSearch = debouncedSearch; 
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
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
  // ---------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 3. CẬP NHẬT useEffect CHÍNH
  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortField, sortOrder, debouncedSearch, startDate, endDate]);

  // --- 4. HÀM MỚI: XỬ LÝ KHI THAY ĐỔI NGÀY ---
  const handleDateChange = (field, value) => {
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);
    setCurrentPage(1);
  };
  
  // --- 5. HÀM MỚI: XỬ LÝ XUẤT CSV ---
  const handleExportClick = async () => {
    if (!startDate || !endDate) {
        toast.warn("Vui lòng chọn Ngày bắt đầu và Ngày kết thúc để xuất báo cáo.");
        return;
    }
    
    setIsExporting(true); // Bắt đầu loading
    try {
        const response = await api.get("/orders/export", {
            params: { startDate, endDate },
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = "bao-cao-don-hang.csv";
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success("Xuất báo cáo thành công!");

    } catch (error) {
        console.error("Lỗi khi xuất CSV:", error);
        toast.error("Lỗi khi xuất báo cáo.");
    } finally {
        setIsExporting(false); // Dừng loading
    }
  };

  // (Các hàm handleSaveCreate, handleSaveEdit, handleAddNew, handleEdit, handleDelete giữ nguyên...)
  const handleSaveCreate = async (requestData) => {
    try {
      await api.post("/orders", requestData);
      fetchOrders();
      setShowCreateModal(false);
      toast.success("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

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
    <div className="feature-page">
      <h2>Danh sách đơn hàng</h2>
      <SearchBar search={search} setSearch={setSearch} onAdd={handleAddNew} />

      {/* 6. Truyền props mới xuống Toolbar */}
      <OrderToolbar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        // Props mới
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onExportClick={handleExportClick}
        isExporting={isExporting}
      />

      <OrderList
        orders={orders}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      
      {/* (Các Modal giữ nguyên...) */}
      <OrderForm
        show={showCreateModal}
        onSave={handleSaveCreate}
        onCancel={() => setShowCreateModal(false)}
      />
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